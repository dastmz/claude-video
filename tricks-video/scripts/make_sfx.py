"""Procedurally synthesised SFX for the TRICKS video (numpy only, no samples).

Writes public/sfx/{whoosh,pop,slam,ding,type,scribble}.mp3 (needs ffmpeg).
Run:  python3 scripts/make_sfx.py
"""
import os, subprocess, tempfile, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(11)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def onepole_lp(x, cutoff):
    """One-pole low-pass; cutoff may be a scalar or a per-sample array (Hz)."""
    c = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    a = np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def bandpass(x, lo, hi):
    return onepole_lp(onepole_lp(x, hi), hi) - onepole_lp(onepole_lp(x, lo), lo)


def fade(x, a=0.002, r=0.02):
    n = len(x)
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return x * e


def norm(x, peak_db):
    return x / (np.max(np.abs(x)) + 1e-9) * 10 ** (peak_db / 20)


def whoosh():
    t = t_axis(0.5)
    p = t / t[-1]
    noise = rng.standard_normal(len(t))
    sweep = 400 + 5200 * np.sin(np.pi * np.clip(p * 1.1, 0, 1)) ** 2  # filter opens then closes
    x = onepole_lp(onepole_lp(noise, sweep), sweep)
    x -= onepole_lp(x, 250)  # remove rumble
    env = np.sin(np.pi * np.clip(p, 0, 1) ** 0.7) ** 1.5
    return norm(fade(x * env), -7)


def pop():
    t = t_axis(0.14)
    f = 260 + 900 * np.exp(-t / 0.018)  # quick downward chirp, like a bubble
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.035)
    click = rng.standard_normal(len(t)) * np.exp(-t / 0.002) * 0.3
    return norm(fade(body + onepole_lp(click, 4000)), -8)


def slam():
    t = t_axis(0.75)
    f = 42 + 110 * np.exp(-t / 0.05)
    thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
    crack = onepole_lp(rng.standard_normal(len(t)), 2500) * np.exp(-t / 0.03)
    tail = onepole_lp(rng.standard_normal(len(t)), 700) * np.exp(-t / 0.25) * 0.35
    x = 1.0 * thump + 0.9 * crack + tail
    x = np.tanh(2.2 * x)  # a little punch / saturation
    return norm(fade(x, 0.001, 0.08), -3)


def ding():
    t = t_axis(1.4)
    f0 = 1318.5  # E6
    parts = [(1, 1.0, 0.9), (2.0, 0.4, 0.5), (2.76, 0.28, 0.35), (5.4, 0.12, 0.18)]
    x = sum(a * np.exp(-t / d) * np.sin(2 * np.pi * f0 * r * t) for r, a, d in parts)
    x += 0.5 * np.exp(-t / 0.7) * np.sin(2 * np.pi * f0 * 1.5 * t) * (t > 0.07)  # second, higher note
    return norm(fade(x * np.clip(t / 0.002, 0, 1), 0.001, 0.2), -9)


def type_click():
    t = t_axis(0.06)
    x = onepole_lp(rng.standard_normal(len(t)), 5000) * np.exp(-t / 0.006)
    x += 0.4 * np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.01)
    return norm(fade(x - onepole_lp(x, 600), 0.0005, 0.01), -14)


def scribble():
    t = t_axis(0.6)
    noise = rng.standard_normal(len(t))
    x = bandpass(noise, 1800, 6500)
    strokes = 0.5 + 0.5 * np.sin(2 * np.pi * 9 * t + 2 * np.sin(2 * np.pi * 3 * t))  # back-and-forth pen motion
    env = np.clip(t / 0.03, 0, 1) * np.clip((t[-1] - t) / 0.12, 0, 1)
    return norm(fade(x * strokes ** 2 * env), -13)


def write_mp3(name, x):
    os.makedirs(OUT, exist_ok=True)
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        path = tmp.name
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    out = os.path.join(OUT, f"{name}.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ac", "2", "-b:a", "192k", out], check=True)
    os.remove(path)
    print("wrote", os.path.normpath(out))


if __name__ == "__main__":
    for name, fn in [("whoosh", whoosh), ("pop", pop), ("slam", slam), ("ding", ding), ("type", type_click), ("scribble", scribble)]:
        write_mp3(name, fn())
