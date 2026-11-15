# TRICKS — TikTok video (Remotion)

Kinetic-typography explainer for HALUS candidates (TRICKS untuk LULUS Kertas 1), light theme, 1080×1920, 30fps, 75s (2250 frames). Composition id: `TricksVideo`.

- Wording: `src/content.ts` (markup: `[kuning]`, `{garis merah}`, `|bulatan merah|`, `~` = non-breaking space)
- Colours, fonts, safe zone: `src/theme.ts`
- Scene lengths: `src/timeline.ts`
- One component per scene: `src/scenes/`

## Audio (optional)
- `public/music.mp3`: background track (volume 0.6, fade in/out, looped)
- `public/sfx/whoosh.mp3`, `pop.mp3`, `slam.mp3`, `ding.mp3`: skipped automatically if missing

## Commands
```bash
npm install
npx remotion studio
node scripts/stills.mjs --extra          # stills -> out/stills/
npx remotion render src/index.ts TricksVideo out/tricks.mp4 --codec=h264 --crf=18
```

Fonts (Poppins 800/900, Inter 500/700, OFL) are bundled in `public/fonts` so rendering works offline.
If you delete them, they load from Google Fonts via `@remotion/google-fonts`.
