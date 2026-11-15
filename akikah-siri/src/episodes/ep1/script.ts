import type { Cue } from "../../shared/Subtitle";
import { sec } from "../../shared/theme";

/** Masa babak (saat). */
export const BABAK = {
  b1: { start: 0, end: 10 },
  b2: { start: 10, end: 30 },
  b3: { start: 30, end: 55 },
  b4: { start: 55, end: 75 },
  b5: { start: 75, end: 90 },
} as const;

export const babakFrames = (b: keyof typeof BABAK) => ({
  from: sec(BABAK[b].start),
  duration: sec(BABAK[b].end - BABAK[b].start),
});

/**
 * Sari kata Episod 1 — teks tepat seperti skrip.
 * Ayat panjang dipecah kepada beberapa paparan supaya maksimum 2 baris.
 * Laraskan start/end di sini supaya sepadan dengan audio public/audio/ep1.mp3.
 */
export const CUES: Cue[] = [
  // Babak 1
  { start: 5.6, end: 9.8, speaker: "AYAH", text: "Umar, ayah nak sangat buat akikah untuk kamu..." },
  // Babak 2
  { start: 11.0, end: 15.6, speaker: "IBU", text: "Abang, Sabtu ni dah masuk hari ketujuh Umar." },
  { start: 15.6, end: 21.5, speaker: "IBU", text: "Kita buat akikah, ya? Jemput jiran sekali." },
  { start: 22.5, end: 28.8, speaker: "AYAH", text: "Insya-Allah... nanti abang usahakan." },
  // Babak 3
  { start: 31.0, end: 34.6, speaker: "FAIZ", text: "Pinjam je kat app ni." },
  { start: 34.6, end: 40.0, speaker: "FAIZ", text: "Anak sulung, kena buat besar-besaran!" },
  { start: 41.0, end: 46.0, speaker: "AYAH", text: "Faedah dia berapa, ya?" },
  { start: 47.0, end: 54.2, speaker: "FAIZ", text: "Tak ingat pula... sikit je kot." },
  // Babak 4
  { start: 56.5, end: 61.8, speaker: "IBU", text: "Abang, bil dan susu Umar bulan ni pun belum selesai." },
  { start: 61.8, end: 67.6, speaker: "IBU", text: "Kalau berhutang, kita mampu bayar ke?" },
  // Babak 5
  { start: 75.6, end: 79.4, speaker: "NARATOR", text: "Situasi macam ni boleh keluar dalam soalan KBAT SPM!" },
  { start: 79.4, end: 82.0, speaker: "NARATOR", text: "Patutkah Encik Hakim berhutang?" },
  { start: 82.0, end: 84.0, speaker: "NARATOR", text: "Komen pandangan anda." },
  { start: 84.0, end: 86.0, speaker: "NARATOR", text: "Jawapannya dalam Episod 2!" },
];

/** Teks situasi Babak 5 (muncul baris demi baris). */
export const SITUASI = [
  "Akikah 2 ekor kambing: RM1,400",
  "Baki bank: RM320",
  "Bil & susu Umar belum selesai",
  "Tawaran pinjaman segera",
];
