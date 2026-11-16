import type { Cue } from "../../shared/Subtitle";
import type { SfxCue } from "../../shared/SfxTrack";
import { sec } from "../../shared/theme";

/** Episod 3: "Jom Jawab KBAT!" — masa babak (saat). */
export const BABAK = {
  b1: { start: 0, end: 8 }, // navy: soalan KBAT
  b2: { start: 8, end: 14 }, // kelas: pengenalan P-H-K-R
  b3: { start: 14, end: 28 }, // kelas: P – Pendirian
  b4: { start: 28, end: 46 }, // kelas: H – Hujah
  b5: { start: 46, end: 62 }, // kelas: K – Kaitan dalil
  b6: { start: 62, end: 80 }, // ruangTamu: R – Rumusan (Ayah & Ibu)
  b7: { start: 80, end: 90 }, // navy: penutup
} as const;

export const babakFrames = (b: keyof typeof BABAK) => ({
  from: sec(BABAK[b].start),
  duration: sec(BABAK[b].end - BABAK[b].start),
});

export const SOALAN = "Patutkah Encik Hakim berhutang untuk mengadakan akikah Umar? Wajarkan jawapan anda.";

/** Sari kata Episod 3 (draf) — maksimum 2 baris setiap paparan. */
export const CUES: Cue[] = [
  // Babak 1
  { start: 0.5, end: 4.2, speaker: "NARATOR", text: "Soalan KBAT: Patutkah Encik Hakim berhutang?" },
  { start: 4.2, end: 7.6, speaker: "NARATOR", text: "Jom jawab guna teknik P-H-K-R!" },
  // Babak 2
  { start: 8.4, end: 13.6, speaker: "USTAZAH", text: "Jawapan KBAT yang baik ada empat langkah." },
  // Babak 3 – P
  { start: 14.4, end: 19.0, speaker: "USTAZAH", text: "P, Pendirian: Encik Hakim tidak patut berhutang." },
  { start: 19.2, end: 23.4, speaker: "USTAZAH", text: "Nyatakan pendirian dengan jelas di awal jawapan." },
  { start: 23.6, end: 27.6, speaker: "USTAZAH", text: "Kemudian, berikan alasan anda." },
  // Babak 4 – H
  { start: 28.4, end: 32.4, speaker: "USTAZAH", text: "H, Hujah: Akikah sunat, bukan wajib." },
  { start: 32.4, end: 37.0, speaker: "USTAZAH", text: "Pinjaman berfaedah ialah riba, hukumnya haram." },
  { start: 37.2, end: 41.4, speaker: "USTAZAH", text: "Hutang pula membebankan keluarga." },
  { start: 41.6, end: 45.6, speaker: "USTAZAH", text: "Susu dan bil Umar pun belum selesai." },
  // Babak 5 – K
  { start: 46.4, end: 50.6, speaker: "USTAZAH", text: "K, Kaitkan dengan dalil al-Quran dan hadis." },
  { start: 50.6, end: 55.4, speaker: "USTAZAH", text: "Riba haram: Surah al-Baqarah ayat 275." },
  { start: 55.4, end: 61.4, speaker: "USTAZAH", text: "Ikut kemampuan: Surah al-Baqarah ayat 286." },
  // Babak 6 – R
  { start: 62.4, end: 66.6, speaker: "USTAZAH", text: "R, Rumusan: cadangkan cara lain yang lebih baik." },
  { start: 66.6, end: 71.0, speaker: "USTAZAH", text: "Tangguh hingga mampu, atau buat seekor kambing." },
  { start: 71.0, end: 75.0, speaker: "USTAZAH", text: "Hari ketujuh, cukur rambut dan beri nama dulu." },
  { start: 75.4, end: 78.0, speaker: "AYAH", text: "Kita buat ikut kemampuan, ya?" },
  { start: 78.0, end: 80.0, speaker: "IBU", text: "Yang penting berkat, abang." },
  // Babak 7
  { start: 80.4, end: 84.2, speaker: "NARATOR", text: "Cuba tulis jawapan P-H-K-R anda di ruangan komen!" },
  { start: 84.2, end: 88.0, speaker: "NARATOR", text: "Ikuti siri ini untuk tips SPM Pendidikan Islam!" },
];

/** Isi kad setiap langkah (saat mutlak bila baris muncul). */
export const ISI = {
  P: [
    { text: "Encik Hakim tidak patut berhutang untuk akikah.", at: 15.6 },
    { text: "Nyatakan di ayat pertama jawapan.", at: 19.4 },
  ],
  H: [
    { text: "Akikah sunat muakkad, ikut kemampuan", at: 28.8 },
    { text: "Pinjaman berfaedah = riba (haram)", at: 32.6 },
    { text: "Hutang membebankan, wajib dibayar", at: 37.4 },
    { text: "Keperluan asas keluarga didahulukan", at: 41.8 },
  ],
  K: [
    { text: "Riba haram – al-Baqarah 2:275", at: 50.8 },
    { text: "Ikut kemampuan – al-Baqarah 2:286", at: 55.6 },
    { text: "Bahaya hutang – HR at-Tirmizi", at: 58.4 },
  ],
  R: [
    { text: "Tangguh hingga mampu (sebelum baligh)", at: 66.8 },
    { text: "Seekor kambing atau 1/7 lembu", at: 69.0 },
    { text: "Hari ke-7: cukur rambut & beri nama", at: 71.2 },
  ],
};

export const SFX: SfxCue[] = [
  { at: 0.0, name: "whoosh", volume: 0.35 },
  { at: 0.4, name: "pop", volume: 0.5 },
  { at: 4.4, name: "chime", volume: 0.35 },
  { at: 8.0, name: "whoosh", volume: 0.35 },
  { at: 9.2, name: "pop", volume: 0.5 },
  { at: 10.0, name: "pop", volume: 0.5 },
  { at: 10.8, name: "pop", volume: 0.5 },
  { at: 11.6, name: "pop", volume: 0.5 },
  ...[14.4, 28.4, 46.4, 62.4].map((at) => ({ at, name: "ding", volume: 0.45 })),
  ...[15.6, 19.4, 28.8, 32.6, 37.4, 41.8, 50.8, 55.6, 58.4, 66.8, 69.0, 71.2].map((at) => ({ at, name: "tik", volume: 0.5 })),
  { at: 62.0, name: "whoosh", volume: 0.35 },
  { at: 80.0, name: "whoosh", volume: 0.35 },
  { at: 80.6, name: "pop", volume: 0.6 },
  { at: 84.4, name: "chime", volume: 0.55 },
];
