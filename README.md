# Al-Muntaqim — TikTok SPM Pendidikan Islam

9:16 (1080×1920, 30fps) motion-graphics video, rendered procedurally with Python (Pillow + NumPy) and ffmpeg.

- `output/Al-Muntaqim_TikTok_60s.mp4` — 60 s, background nasyid-style hum + soft percussion + "ding" SFX, room left for a voice-over.
- `output/Al-Muntaqim_TikTok_Suara.mp4` — **main version** (2:13), synced to the teacher's voice-over `assets/voiceover.m4a`. Phrase timings come from `src/align.py`, which matches `assets/transcript.txt` to the pauses in the recording and writes `assets/alignment.json`; every animation, SFX and subtitle in `src/render_vo.py` is keyed to those timings.

## Render

```bash
pip install pillow numpy scipy
cd src && python3 render.py          # 60 s version
cd src && python3 align.py && python3 render_vo.py   # voice-synced version
cd src && python3 render.py --still 12 28 --safe   # preview frames with TikTok UI overlay
```

Safe zone: content stays within x 80–900, y 190–1380; watermark "Ustazah Rasyidah@Penrissen" is centred at y 1440 (above TikTok's caption/nav area), on every frame.
Fonts: Poppins, Baloo 2, Amiri (SIL Open Font License).
