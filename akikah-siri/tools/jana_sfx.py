"""Jana kesan bunyi sintetik (WAV 44.1 kHz) ke public/audio/sfx/.
Jalankan: python3 tools/jana_sfx.py   (perlu numpy)"""
import os, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "sfx")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a=0.005, r=0.2):
    x = np.arange(n) / SR
    e = np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / r)
    return e
def save(name, y, gain=0.8):
    y = y / (np.max(np.abs(y)) + 1e-9) * gain
    fade = min(len(y), 400); y[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())

def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")

# ding notifikasi (dua nada)
x = t(0.9)
d = np.sin(2*np.pi*1318*x)*env(len(x), r=0.25) + 0.5*np.sin(2*np.pi*2637*x)*env(len(x), r=0.12)
x2 = t(0.9); d2 = np.sin(2*np.pi*1760*x2)*env(len(x2), r=0.3)
save("ding", np.concatenate([d[:int(SR*0.12)], d2]))

# buzz amaran (baki rendah)
x = t(0.45)
b = np.sign(np.sin(2*np.pi*110*x)) * 0.6 + np.sin(2*np.pi*220*x)
b *= np.where((x % 0.22) < 0.17, 1, 0) * env(len(x), a=0.005, r=1)
save("buzz", lowpass(b, 6), 0.6)

# pop (tajuk muncul)
x = t(0.25)
f = 900 * np.exp(-x * 18) + 250
save("pop", np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(x), a=0.002, r=0.06))

# whoosh
x = t(0.7)
n = rng.standard_normal(len(x))
sh = np.sin(np.pi * x / x[-1]) ** 2
w = np.zeros_like(n)
for k in (3, 6, 12):
    w += lowpass(n, k)
save("whoosh", w * sh, 0.5)

# coretan pen (bulatkan kalendar)
x = t(1.2)
n = rng.standard_normal(len(x))
s = lowpass(n, 3) * (0.6 + 0.4*np.sin(2*np.pi*7*x)) * np.minimum(1, (x[-1]-x)*6)
save("pen", s, 0.35)

# hentakan (ikon jatuh ke meja)
x = t(0.35)
th = np.sin(2*np.pi*(120*np.exp(-x*8)+60)*x) * env(len(x), a=0.001, r=0.08)
th[:300] += rng.standard_normal(300) * np.linspace(1, 0, 300) * 0.5
save("thud", th, 0.8)

# impak freeze (boom rendah + kilatan)
x = t(2.0)
bm = np.sin(2*np.pi*(80*np.exp(-x*3)+35)*x) * env(len(x), a=0.002, r=0.6)
bm += lowpass(rng.standard_normal(len(x)), 20) * env(len(x), a=0.001, r=0.15) * 0.6
save("impak", bm, 0.9)

# degupan jantung (lub-dub, 0.9 s)
x = t(0.9)
def beat(off, amp):
    y = np.zeros_like(x); i = int(off*SR); xx = x[: len(x)-i]
    y[i:] = amp * np.sin(2*np.pi*(55*np.exp(-xx*10)+38)*xx) * env(len(xx), a=0.004, r=0.07)
    return y
save("heartbeat", beat(0.0, 1.0) + beat(0.17, 0.7), 0.95)

# klik/tik (teks situasi)
x = t(0.12)
save("tik", np.sin(2*np.pi*2200*x) * env(len(x), a=0.0005, r=0.02), 0.5)

# kilauan / chime kad episod
x = t(2.2)
c = sum(np.sin(2*np.pi*f*x) * env(len(x), a=0.003 + i*0.06, r=0.7) * (0.9 ** i)
        for i, f in enumerate([784, 988, 1175, 1568]))
save("chime", c, 0.6)
print("SFX dijana di", os.path.abspath(OUT))
