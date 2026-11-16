import type { Cue } from "../../shared/Subtitle";
import type { SfxCue } from "../../shared/SfxTrack";
import { sec } from "../../shared/theme";

/** Episod 2: "Apa Kata Syarak?" — masa babak (saat). */
export const BABAK = {
  b1: { start: 0, end: 8 }, // imbas kembali Episod 1
  b2: { start: 8, end: 28 }, // masjid: hukum akikah
  b3: { start: 28, end: 51 }, // kelas: hadis, bilangan & waktu
  b4: { start: 51, end: 72 }, // masjid: pinjaman berfaedah = riba, hutang
  b5: { start: 72, end: 81 }, // masjid: ikut kemampuan (al-Baqarah 286)
  b6: { start: 81, end: 90 }, // navy: ringkasan + kad Episod 3
} as const;

export const babakFrames = (b: keyof typeof BABAK) => ({
  from: sec(BABAK[b].start),
  duration: sec(BABAK[b].end - BABAK[b].start),
});

/** Sari kata Episod 2 (draf) — maksimum 2 baris setiap paparan. */
export const CUES: Cue[] = [
  // Babak 1
  { start: 0.5, end: 4.4, speaker: "NARATOR", text: "Encik Hakim hampir tekan butang pinjaman..." },
  { start: 4.4, end: 7.7, speaker: "NARATOR", text: "Apa kata syarak tentang akikah dan hutang?" },
  // Babak 2
  { start: 8.6, end: 13.0, speaker: "AYAH", text: "Ustazah, akikah ni wajib ke? Duit saya tak cukup." },
  { start: 13.4, end: 17.6, speaker: "USTAZAH", text: "Akikah hukumnya sunat muakkad, bukan wajib." },
  { start: 17.6, end: 21.8, speaker: "USTAZAH", text: "Ia dituntut bagi wali yang berkemampuan." },
  { start: 21.8, end: 27.4, speaker: "USTAZAH", text: "Kalau tak mampu, tidak berdosa jika tak dibuat." },
  // Babak 3
  { start: 28.6, end: 32.6, speaker: "USTAZAH", text: "Sabda Nabi SAW: Setiap anak tergadai dengan akikahnya," },
  { start: 32.6, end: 37.2, speaker: "USTAZAH", text: "disembelih pada hari ketujuh, dicukur dan diberi nama." },
  { start: 37.6, end: 42.0, speaker: "USTAZAH", text: "Anak lelaki afdal dua ekor kambing, perempuan seekor." },
  { start: 42.0, end: 44.8, speaker: "USTAZAH", text: "Seekor untuk anak lelaki pun sah." },
  { start: 44.8, end: 47.6, speaker: "USTAZAH", text: "Boleh juga kongsi 1/7 bahagian lembu." },
  { start: 47.6, end: 50.8, speaker: "USTAZAH", text: "Tak sempat hari ketujuh? Boleh buat kemudian." },
  // Babak 4
  { start: 51.4, end: 54.8, speaker: "AYAH", text: "Kalau saya pinjam dari app tu, boleh?" },
  { start: 55.2, end: 59.6, speaker: "USTAZAH", text: "Pinjaman yang ada faedah itu riba. Riba haram." },
  { start: 59.6, end: 63.6, speaker: "USTAZAH", text: "Takkan nak buat amalan sunat dengan cara haram?" },
  { start: 63.8, end: 66.0, speaker: "USTAZAH", text: "Hutang wajib dibayar." },
  { start: 66.0, end: 71.4, speaker: "USTAZAH", text: "Jiwa mukmin tergantung dengan hutangnya." },
  // Babak 5
  { start: 72.4, end: 75.2, speaker: "USTAZAH", text: "Allah tidak membebankan seseorang" },
  { start: 75.2, end: 78.2, speaker: "USTAZAH", text: "melainkan sesuai dengan kemampuannya." },
  { start: 78.6, end: 81.0, speaker: "AYAH", text: "Alhamdulillah, lega saya, ustazah." },
  // Babak 6
  { start: 81.4, end: 84.4, speaker: "NARATOR", text: "Jadi, apa pilihan terbaik Encik Hakim?" },
  { start: 84.4, end: 87.6, speaker: "NARATOR", text: "Kita jawab ala KBAT dalam Episod 3!" },
];

/** Teks dalil (draf — sila semak). */
export const DALIL = {
  hadisAkikah: {
    arab: "كُلُّ غُلَامٍ رَهِينَةٌ بِعَقِيقَتِهِ، تُذْبَحُ عَنْهُ يَوْمَ سَابِعِهِ، وَيُحْلَقُ، وَيُسَمَّى",
    terjemahan: "Setiap anak tergadai dengan akikahnya, disembelih untuknya pada hari ketujuh, dicukur dan diberi nama.",
    rujukan: "(HR Abu Daud & at-Tirmizi)",
  },
  riba: {
    arab: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
    terjemahan: "Allah menghalalkan jual beli dan mengharamkan riba.",
    rujukan: "(Surah al-Baqarah 2:275)",
  },
  hutang: {
    arab: "نَفْسُ الْمُؤْمِنِ مُعَلَّقَةٌ بِدَيْنِهِ حَتَّى يُقْضَى عَنْهُ",
    terjemahan: "Jiwa orang mukmin tergantung dengan hutangnya sehingga hutang itu dilunaskan.",
    rujukan: "(HR at-Tirmizi)",
  },
  kemampuan: {
    arab: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    terjemahan: "Allah tidak membebankan seseorang melainkan sesuai dengan kemampuannya.",
    rujukan: "(Surah al-Baqarah 2:286)",
  },
};

export const SFX: SfxCue[] = [
  { at: 0.0, name: "impak", volume: 0.4 },
  { at: 4.4, name: "pop", volume: 0.6 },
  { at: 8.0, name: "whoosh", volume: 0.35 },
  { at: 13.4, name: "pop", volume: 0.5 },
  { at: 13.6, name: "tik", volume: 0.5 },
  { at: 17.8, name: "tik", volume: 0.5 },
  { at: 22.0, name: "tik", volume: 0.5 },
  { at: 28.0, name: "whoosh", volume: 0.35 },
  { at: 28.6, name: "chime", volume: 0.35 },
  { at: 37.6, name: "pop", volume: 0.5 },
  { at: 42.0, name: "tik", volume: 0.5 },
  { at: 44.8, name: "tik", volume: 0.5 },
  { at: 47.6, name: "tik", volume: 0.5 },
  { at: 51.0, name: "whoosh", volume: 0.35 },
  { at: 51.6, name: "ding", volume: 0.4 },
  { at: 55.2, name: "buzz", volume: 0.4 },
  { at: 63.8, name: "pop", volume: 0.5 },
  { at: 72.0, name: "whoosh", volume: 0.3 },
  { at: 72.4, name: "chime", volume: 0.35 },
  { at: 81.0, name: "whoosh", volume: 0.35 },
  { at: 81.6, name: "tik", volume: 0.5 },
  { at: 82.4, name: "tik", volume: 0.5 },
  { at: 83.2, name: "tik", volume: 0.5 },
  { at: 83.8, name: "pop", volume: 0.6 },
  { at: 85.0, name: "chime", volume: 0.55 },
];
