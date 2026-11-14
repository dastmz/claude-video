"""Synthesised soundtrack: nasyid-style vocal hum + soft frame-drum percussion + SFX.

No melodic instruments are used: the only pitched musical sound is a hummed
"mmm" voice pad, plus a daf/frame-drum style percussion loop. SFX (ding, pop,
whoosh, stamp, chime) are generated procedurally.
"""
import numpy as np
import wave
from scipy.signal import lfilter

SR = 48000
rng = np.random.default_rng(7)


def env_adsr(n, a, d, s, r):
    t = np.arange(n) / SR
    dur = n / SR
    e = np.ones(n) * s
    e[t < a] = t[t < a] / max(a, 1e-4)
    m = (t >= a) & (t < a + d)
    e[m] = 1 - (1 - s) * (t[m] - a) / max(d, 1e-4)
    rm = t > dur - r
    e[rm] *= np.clip((dur - t[rm]) / max(r, 1e-4), 0, 1)
    return e


def lowpass(x, cutoff):
    # one-pole lowpass applied twice (gentle 12dB/oct)
    a = np.exp(-2 * np.pi * cutoff / SR)
    for _ in range(2):
        x = lfilter([1 - a], [1, -a], x)
    return x


def hum_voice(freq, dur, amp=1.0):
    """A soft hummed 'mmm' vowel: harmonic stack, nasal low-pass, vibrato."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t + rng.uniform(0, 6)) * np.clip(t / 0.6, 0, 1)
    phase = 2 * np.pi * np.cumsum(freq * vib) / SR
    sig = np.zeros(n)
    for h in range(1, 9):
        # nasal hum: strong fundamental, formant bump ~250Hz & ~2.2k damped
        f = freq * h
        w = 1.0 / h ** 1.6
        if 180 < f < 380:
            w *= 1.8
        sig += w * np.sin(h * phase)
    sig += 0.004 * rng.standard_normal(n)  # breath
    sig = lowpass(sig, 1200)
    return amp * sig * env_adsr(n, 0.35, 0.3, 0.85, min(0.8, dur * 0.4))


def bell(freq, dur=1.6, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    parts = [(1, 1.0, 1.4), (2.0, 0.45, 0.9), (2.76, 0.35, 0.7), (5.4, 0.18, 0.35), (8.93, 0.08, 0.2)]
    s = sum(a * np.exp(-t / d) * np.sin(2 * np.pi * freq * r * t) for r, a, d in parts)
    s *= np.clip(t / 0.003, 0, 1)
    return amp * s


def dum(amp=1.0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 62 + 45 * np.exp(-t / 0.03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    s += 0.25 * rng.standard_normal(n) * np.exp(-t / 0.006)
    return amp * lowpass(s, 900)


def tak(amp=1.0):
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    hp = nz - lowpass(nz, 1500)
    s = lowpass(hp, 6000) * np.exp(-t / 0.035)
    s += 0.3 * np.sin(2 * np.pi * 420 * t) * np.exp(-t / 0.04)
    return amp * s


def shaker(amp=1.0):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    s = (nz - lowpass(nz, 5000)) * np.exp(-((t - 0.02) / 0.02) ** 2)
    return amp * s


def whoosh(dur=0.45, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    e = np.sin(np.pi * t / dur) ** 2
    # sweep: blend between low and high passed noise
    lo = lowpass(nz, 700)
    hi = nz - lowpass(nz, 2500)
    mix = t / dur
    return amp * e * ((1 - mix) * lo * 2.2 + mix * hi * 0.6)


def pop(amp=1.0):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 500 + 900 * np.exp(-t / 0.02)
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.04)


def stamp(amp=1.0):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(90 + 80 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.12)
    s += 0.6 * lowpass(rng.standard_normal(n), 2500) * np.exp(-t / 0.03)
    return amp * s


def soft_buzz(amp=1.0):
    """Gentle 'wrong answer' two-note hum (descending), not harsh."""
    a = hum_voice(311.1, 0.28, 1.0)
    b = hum_voice(233.1, 0.5, 1.0)
    out = np.zeros(len(a) + len(b) - int(0.05 * SR))
    out[: len(a)] += a
    out[len(a) - int(0.05 * SR):] += b
    return amp * out


def chime_up(amp=1.0):
    out = np.zeros(int(1.8 * SR))
    for i, f in enumerate([1046.5, 1318.5, 1568.0]):
        b = bell(f, 1.4, 0.5)
        st = int(i * 0.09 * SR)
        out[st: st + len(b)] += b[: len(out) - st]
    return amp * out


def add(buf, sig, t, gain=1.0, pan=0.0):
    st = int(t * SR)
    if st >= buf.shape[1] or st < 0:
        return
    n = min(len(sig), buf.shape[1] - st)
    l = np.sqrt(0.5 * (1 - pan))
    r = np.sqrt(0.5 * (1 + pan))
    buf[0, st: st + n] += gain * l * sig[:n]
    buf[1, st: st + n] += gain * r * sig[:n]


def reverb(x, secs=1.8, wet=0.25):
    n = int(secs * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / (secs / 5.5))
    ir = lowpass(ir, 4000)
    ir /= np.sqrt((ir ** 2).sum())
    L = len(x) + n
    nfft = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return (1 - wet) * x + wet * y * 3


def music(total, bpm=92, music_gain=1.0, end_fade=2.5):
    buf = np.zeros((2, int(total * SR) + SR))
    beat = 60 / bpm
    bar = beat * 4
    # chord progression (A minor feel): Am, F, C, G -> hum pad tones
    chords = [
        [220.0, 261.6, 329.6],
        [174.6, 220.0, 261.6],
        [196.0, 261.6, 329.6],
        [196.0, 246.9, 293.7],
    ]
    melody = [  # hummed melody (pentatonic), per bar: list of (beat_offset, freq, beats)
        [(0, 659.3, 1.5), (1.5, 587.3, 0.5), (2, 523.3, 2)],
        [(0, 523.3, 1), (1, 440.0, 1), (2, 523.3, 2)],
        [(0, 587.3, 1.5), (1.5, 523.3, 0.5), (2, 440.0, 2)],
        [(0, 392.0, 1), (1, 440.0, 1), (2, 493.9, 2)],
    ]
    nbars = int(total / bar) + 1
    pad = np.zeros_like(buf)
    mel = np.zeros_like(buf)
    for b in range(nbars):
        t0 = b * bar
        ch = chords[b % 4]
        for i, f in enumerate(ch):
            add(pad, hum_voice(f, bar + 0.4, 0.16), t0, pan=(i - 1) * 0.5)
        add(pad, hum_voice(ch[0] / 2, bar + 0.4, 0.14), t0)
        # melody on alternating 8-bar phrases (leaves space for voice-over)
        if (b // 8) % 2 == 1 or b < 2:
            continue
        for off, f, ln in melody[b % 4]:
            add(mel, hum_voice(f, ln * beat + 0.15, 0.09), t0 + off * beat, pan=0.15)
        # percussion: dum . tak . dum dum tak .
    perc = np.zeros_like(buf)
    for b in range(nbars):
        t0 = b * bar
        if b == 0:
            continue  # intro bar: hum only
        pat = [("D", 0), ("T", 1), ("D", 2), ("D", 2.5), ("T", 3)]
        for kind, off in pat:
            tt = t0 + off * beat
            if kind == "D":
                add(perc, dum(0.55), tt)
            else:
                add(perc, tak(0.22), tt, pan=0.2)
        for k in range(8):
            add(perc, shaker(0.05 if k % 2 else 0.08), t0 + k * beat / 2, pan=-0.3)
    out = reverb(pad[0] + mel[0], wet=0.35), reverb(pad[1] + mel[1], wet=0.35)
    m = np.stack(out) + perc
    n = int(total * SR)
    m = m[:, :n]
    fade = np.ones(n)
    fi = int(1.0 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fo = int(end_fade * SR)
    fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
    m *= fade
    m /= np.abs(m).max() + 1e-9
    return m * music_gain


SFX = {
    "ding": lambda p: bell(p or 1318.5, 1.8, 0.9),
    "pop": lambda p: pop(0.6),
    "whoosh": lambda p: whoosh(0.5, 0.5),
    "stamp": lambda p: stamp(0.9),
    "buzz": lambda p: soft_buzz(0.55),
    "chime": lambda p: chime_up(0.8),
}


def build(total, events, path, music_level=0.28, sfx_level=0.6):
    m = music(total) * music_level
    sfx = np.zeros((2, m.shape[1] + SR * 3))
    for t, kind, param in events:
        add(sfx, SFX[kind](param), t, gain=1.0)
    sfx = sfx[:, : m.shape[1]]
    sfx = np.stack([reverb(sfx[0], 1.2, 0.18), reverb(sfx[1], 1.2, 0.18)])
    mix = m + sfx * sfx_level
    peak = np.abs(mix).max()
    if peak > 0.95:
        mix *= 0.95 / peak
    data = (mix.T * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
