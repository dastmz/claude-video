# Al-Muntaqim — TikTok SPM Pendidikan Islam

9:16 (1080×1920, 30fps) motion-graphics video, rendered procedurally with Python (Pillow + NumPy) and ffmpeg.

- `output/Al-Muntaqim_TikTok_60s.mp4` — 60 s, background nasyid-style hum + soft percussion + "ding" SFX, room left for a voice-over.
- `output/Al-Muntaqim_TikTok_VO.mp4` — 135 s version with `assets/voiceover.m4a` mixed in; scenes are stretched to the pauses in the recording (`VO_BOUNDS` in `src/render.py`).

## Render

```bash
pip install pillow numpy scipy
cd src && python3 render.py          # 60 s version
cd src && python3 render.py --vo     # voice-over version
cd src && python3 render.py --still 12 28 --safe   # preview frames with TikTok UI overlay
```

Safe zone: content stays within x 80–900, y 190–1380; watermark "Ustazah Rasyidah@Penrissen" is centred at y 1440 (above TikTok's caption/nav area), on every frame.
Fonts: Poppins, Baloo 2, Amiri (SIL Open Font License).
