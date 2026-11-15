/**
 * ALL on-screen text lives here. Edit wording freely.
 *
 * Inline markup (works in most strings):
 *   [teks]  -> yellow highlighter swipe behind the text
 *   {teks}  -> red pen underline (hand-drawn)
 *   |teks|  -> red pen circle (hand-drawn)
 *   ~       -> non-breaking space (keeps words together on one line)
 */

export const hook = {
  slam: "LAGI 2 MARKAH",
  typed: "NAK LULUS...",
  score: "38", // red-pen exam score on the paper
  sub: "Jangan risau, ada caranya! 💪",
};

export const title = {
  small: "TEACH YOU THE",
  word: "TRICKS",
  subtitle: "6 Langkah [LULUS] Kertas~1 Pendidikan Islam SPM",
};

export const stepT = {
  letter: "T",
  headline: "Tahu & Tanda Kehendak Soalan",
  question: "Jelaskan {dua cara meninggalkan sifat mazmumah}.",
  marks: "[2 markah]",
  tip: "Soalan minta [CARA], jangan jawab KESAN!",
};

export const stepR = {
  letter: "R",
  headline: "Rujuk Peruntukan Markah",
  rows: [
    { marks: "[2 markah]", result: "1 isi + 1 huraian" },
    { marks: "[4 markah]", result: "2 isi + 2 huraian" },
  ],
};

export const stepI = {
  letter: "I",
  headline: "Isi Kepala Ayat Jawapan",
  // each entry = one written line on the answer sheet
  lines: [
    "Maksud ujub ialah ...",
    "Dua cara meninggalkan sifat mazmumah ialah:",
    "1. ...",
    "2. ...",
  ],
  tip: "Pemeriksa senang nampak, senang beri markah ✅",
};

export const stepC = {
  letter: "C",
  headline: "Cari Soalan Yang Tidak Memerlukan Hafalan",
  banner: "SOALAN TERBUKA~= [TAK~PERLU~HAFAL!]",
  hikmah: {
    label: "Hikmah / Kelebihan",
    formula: "JIGSI",
    items: [
      "[J]iwa tenang",
      "[I]man bertambah",
      "[G]anjaran pahala/syurga",
      "[S]ilaturahim erat",
      "[I]mej Islam tinggi",
    ],
  },
  kesan: {
    label: "Kesan / Akibat",
    good: {
      emoji: "👍",
      formula: "SA-JI-MAR",
      items: ["di[SA]yangi Allah/masyarakat", "[JI]wa tenang", "[MAR]uah terpelihara"],
    },
    bad: {
      emoji: "👎",
      formula: "BEN-JI-MAR",
      items: ["di[BEN]ci Allah/masyarakat", "[JI]wa tidak tenang", "[MAR]uah tercalar"],
    },
  },
  punca: {
    label: "Punca / Faktor",
    formula: "IMAN · ILMU · RAKAN",
    items: ["[Iman] lemah", "Kurang [ilmu]", "Pengaruh [rakan]"],
  },
  cara: {
    label: "Cara Mengatasi",
    formula: ["NASI LEMAK", "AYAM HANGIT~🍛"],
    items: [
      "[NASI]hat ke arah kebaikan",
      "[L]apor kepada pihak bertanggungjawab",
      "[AJAK] ke arah kebaikan",
      "[HADIR]i majlis ilmu",
    ],
  },
  pengajaran: {
    label: "Pengajaran / Iktibar",
    formula: "PID",
    items: ["[P]emimpin", "[I]lmu", "[D]akwah"],
    template: "Kita [hendaklah]~... [agar]~...",
  },
};

export const kbat = {
  badge: "BONUS",
  headline: "Soalan KBAT: 1~Isi~1~Cerita",
  steps: ["isi", "huraian", "kesan", "contoh", "kesimpulan"],
  connectors: ["supaya", "untuk", "kerana", "agar", "seperti", "sehingga", "contohnya", "dengan~cara"],
};

export const stepK = {
  letter: "K",
  headline: "Kemas & Jelas",
};

export const stepS = {
  letter: "S",
  headline: "Semak & Selawat",
  checklist: ["Semak soalan tertinggal", "Semak kepala ayat", "Tarik nafas, selawat~🤲"],
};

export const outro = {
  recap: [
    { letter: "T", label: "Tanda" },
    { letter: "R", label: "Rujuk" },
    { letter: "I", label: "Isi" },
    { letter: "C", label: "Cari" },
    { letter: "K", label: "Kemas" },
    { letter: "S", label: "Semak" },
  ],
  quoteBefore: "Guna TRICKS, kita~boleh",
  quoteBurst: "LULUS!",
  cta: "📌 Save & tag kawan yang nak LULUS PAI!",
  credit: "Ustazah Rasyidah @ Penrissen",
};
