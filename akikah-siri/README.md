# Siri Akikah — Episod 1: "Sayang Anak" (Remotion)

Video TikTok pendidikan Islam, 1080×1920 (9:16), 30 fps, 90 s (2700 frame).
Composition id: **`Ep1-SayangAnak`**.

## Pasang & semak

```bash
npm install
npx remotion studio          # semakan dalam pelayar
```

Dalam Studio, tetapkan prop `showSafeZone: true` untuk melihat zon UI TikTok (merah),
garis sari kata (y=1250, biru) dan garis watermark (y=1480, kuning).
Still `Helaian-Watak` memaparkan semua watak × 4 ekspresi.

## Render

```bash
npx remotion render Ep1-SayangAnak out/ep1.mp4
```

Draf cepat beresolusi separuh: `npx remotion render Ep1-SayangAnak out/draf.mp4 --scale=0.5`

Fon Poppins & Montserrat dimuat turun daripada Google Fonts semasa render — perlu sambungan internet.

## Ganti klip & audio (pilihan)

Semua fail diletak dalam `public/`. Jika fail tiada, video guna ilustrasi / sari kata sahaja.

| Fail | Kesan |
|---|---|
| `public/clips/ep1_b1.mp4` … `ep1_b5.mp4` | Menggantikan latar **dan** watak ilustrasi babak 1–5. Teks, telefon, kalendar, ikon, sari kata & watermark kekal di atas. Klip dimainkan tanpa bunyi dan diulang jika lebih pendek. Gunakan 9:16. |
| `public/audio/ep1.mp3` | Suara/muzik penuh 90 s, bermula pada 0 s. |
| `public/audio/sfx/heartbeat.mp3` (atau `.wav`) | Bunyi degupan jantung semasa freeze frame (69.6–75 s). |

Selepas menambah fail, mulakan semula Studio (atau render semula) supaya fail dikesan.

## Ubah teks / masa

- Sari kata & masa: `src/episodes/ep1/script.ts` (`CUES`, dalam saat). Laraskan `start`/`end` supaya sepadan dengan audio.
- Teks situasi Babak 5: `SITUASI` dalam fail yang sama.
- Babak: `src/episodes/ep1/scenes/Babak1.tsx` … `Babak5.tsx`.

## Struktur bersama (untuk Episod 2 & 3)

```
src/shared/
  theme.ts            warna, zon selamat, saiz, sec()
  fonts.ts            Poppins (tajuk) & Montserrat (sari kata)
  characters/         Ayah, Ibu, BabyUmar, Faiz, UstazahRasyidah
                      prop: expression ("senyum"|"risau"|"terkejut"|"lega"), talking, armKanan/armKiri, flip
  Subtitle.tsx        sari kata + isTalking()
  OnScreenTitle.tsx   tajuk spring pop
  Watermark.tsx       "Ustazah Rasyidah@Penrissen"
  PhoneScreen.tsx     mockup telefon (+ phone/screens.tsx: notifikasi, bank, iklan pinjaman)
  SceneBackground.tsx ruangTamu | kedaiMakan | masjid | kelas | navy
  SceneBackdrop.tsx   guna klip public/clips jika wujud
  EpisodeCard.tsx     kad "Episod X: tajuk"
  props.tsx           kalendar, ikon bil/susu/lampin, meja, teh tarik
```

Untuk episod baharu: salin `src/episodes/ep1` → `ep2`, tukar `script.ts` & babak, daftar `<Composition>` dalam `src/Root.tsx`.
