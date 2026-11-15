// Gaya visual bersama untuk siri "Akikah" (Episod 1–3)

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const COLORS = {
  navy: "#1B2A4A", // latar utama
  krim: "#F6EBDD",
  bajuAyah: "#22356F", // biru navy baju Melayu ayah
  tudungIbu: "#F4B6C2", // merah jambu pastel
  emas: "#E8B04B", // aksen
  putih: "#FFFFFF",
  hitam: "#000000",
  // Panel P-H-K-R (Episod 3)
  P: "#3B82F6",
  H: "#22C55E",
  K: "#F97316",
  R: "#8B5CF6",
  // Warna sokongan watak
  poloFaiz: "#1F5B3A",
  tudungUstazah: "#A9D3F2",
  blazerUstazah: "#7A808A",
  merahAmaran: "#E5484D",
} as const;

// Zon selamat TikTok: elakkan 220 px atas, 380 px bawah, 140 px kanan.
export const SAFE = {
  top: 220,
  bottom: VIDEO.height - 380, // 1540
  left: 60,
  right: VIDEO.width - 140, // 940
  get centerX() {
    return (this.left + this.right) / 2; // 500
  },
  get width() {
    return this.right - this.left; // 880
  },
} as const;

export const LAYOUT = {
  subtitleY: 1250,
  watermarkY: 1480,
} as const;

export const sec = (s: number) => Math.round(s * VIDEO.fps);

export type Expression = "senyum" | "risau" | "terkejut" | "lega";
