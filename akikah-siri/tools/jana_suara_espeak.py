"""Jana trek suara SEMENTARA (robotik) dengan espeak-ng mengikut masa CUES dalam
src/episodes/ep1/script.ts. Gantikan dengan rakaman sebenar bila ada.
Jalankan: python3 tools/jana_suara_espeak.py   (perlu espeak-ng & ffmpeg)"""
import json, os, re, subprocess, tempfile

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "audio", "sementara", "ep1_espeak.mp3")
src = open(os.path.join(ROOT, "src", "episodes", "ep1", "script.ts"), encoding="utf-8").read()
cues = [
    dict(start=float(a), end=float(b), speaker=c, text=d)
    for a, b, c, d in re.findall(r'start:\s*([\d.]+),\s*end:\s*([\d.]+),\s*speaker:\s*"(\w+)",\s*text:\s*"([^"]+)"', src)
]

VOICE = {  # varian espeak-ng, pic, kelajuan
    "AYAH": ("ms+m3", 42, 150),
    "IBU": ("ms+f4", 62, 150),
    "FAIZ": ("ms+m7", 35, 165),
    "NARATOR": ("ms+m1", 48, 155),
}
SEBUTAN = [  # ejaan sebutan sahaja (sari kata tidak berubah)
    ("KBAT", "kabat"), ("SPM", "es pi em"), ("Insya-Allah", "insya allah"),
    (" app ", " ep "), ("...", ", "), ("Episod 2", "episod dua"),
]

tmp = tempfile.mkdtemp()
inputs, filters = [], []
for i, c in enumerate(cues):
    text = c["text"]
    for a, b in SEBUTAN:
        text = text.replace(a, b)
    v, pitch, speed = VOICE.get(c["speaker"], VOICE["NARATOR"])
    raw = os.path.join(tmp, f"{i}.wav")
    subprocess.run(["espeak-ng", "-v", v, "-p", str(pitch), "-s", str(speed), "-w", raw, text], check=True)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", raw]))
    room = c["end"] - c["start"] - 0.3
    tempo = max(1.0, dur / room) if room > 0 else 1.0
    inputs += ["-i", raw]
    filters.append(f"[{i}]atempo={min(tempo, 2.0):.3f},adelay={int(c['start'] * 1000 + 100)}:all=1[a{i}]")
    print(f"{c['start']:5.1f}s {c['speaker']:8s} {dur:4.1f}s tempo {tempo:.2f}  {c['text']}")

mix = "".join(f"[a{i}]" for i in range(len(cues)))
filters.append(f"{mix}amix=inputs={len(cues)}:normalize=0,apad,atrim=0:90,loudnorm=I=-16[out]")
os.makedirs(os.path.dirname(OUT), exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "44100", "-b:a", "128k", OUT], check=True)
print("Trek suara:", os.path.abspath(OUT))
