import { getStaticFiles, staticFile } from "remotion";
import { loadFont as loadLocal } from "@remotion/fonts";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

/**
 * Poppins 800/900 + Inter 500/700.
 * The same Google Fonts files are bundled in /public/fonts so renders work offline
 * (and in sandboxes where headless Chrome cannot reach fonts.gstatic.com).
 * If those files are removed, fonts load from Google via @remotion/google-fonts.
 */
const bundled = getStaticFiles().some((f) => f.name.endsWith("fonts/inter.woff2"));

const loadFonts = () => {
  if (bundled) {
    loadLocal({ family: "Poppins", url: staticFile("fonts/poppins-800.woff2"), weight: "800" });
    loadLocal({ family: "Poppins", url: staticFile("fonts/poppins-900.woff2"), weight: "900" });
    loadLocal({ family: "Inter", url: staticFile("fonts/inter.woff2"), weight: "500" });
    loadLocal({ family: "Inter", url: staticFile("fonts/inter.woff2"), weight: "700" });
    return { poppins: "Poppins", inter: "Inter" };
  }
  const p = loadPoppins("normal", { weights: ["800", "900"], subsets: ["latin"] });
  const i = loadInter("normal", { weights: ["500", "700"], subsets: ["latin"] });
  return { poppins: p.fontFamily, inter: i.fontFamily };
};
const fam = loadFonts();

const EMOJI = '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"';

export const fonts = {
  headline: `${fam.poppins}, ${EMOJI}, sans-serif`,
  body: `${fam.inter}, ${EMOJI}, sans-serif`,
};

export const colors = {
  // light, warm paper background (matches the bengkel slides)
  bg: "#FBF8F1",
  bgDeep: "#F2ECDF",
  text: "#0F1B3D", // main ink (deep navy)
  textSoft: "#475569", // secondary text
  onAccent: "#FFFFFF", // text/icons sitting on a coloured fill
  white: "#FFFFFF",
  surface: "#FFFFFF", // cards
  surfaceBorder: "rgba(15,27,61,0.10)",
  grid: "rgba(15,27,61,0.055)",
  highlight: "#FACC15",
  pen: "#EF4444",
  good: "#22C55E",
  paper: "#FFFFFF",
  ink: "#1E293B",
};

/** One accent colour per TRICKS letter. */
export const accent = {
  T: "#EF4444",
  R: "#F59E0B",
  I: "#22C55E",
  C: "#3B82F6",
  K: "#8B5CF6",
  S: "#EC4899",
} as const;
export type Letter = keyof typeof accent;

export const video = { width: 1080, height: 1920, fps: 30 };

/** TikTok safe zone: all text must stay inside this box. */
export const safe = {
  left: 120,
  right: 120,
  top: 250,
  bottom: 400,
  get width() {
    return video.width - this.left - this.right; // 840
  },
  get height() {
    return video.height - this.top - this.bottom; // 1270
  },
};

export const size = {
  minText: 56,
  body: 56,
  headline: 72,
  giantLetter: 460, // slam size (300–500)
  settledLetter: 300,
};

export const radius = 32;
export const shadow = "0 18px 44px rgba(15,27,61,0.13), 0 3px 10px rgba(15,27,61,0.07)";
/** Solid drop under giant letters. */
export const letterDrop = "0 14px 0 rgba(15,27,61,0.14)";

export const motion = {
  word: { damping: 14, stiffness: 190, mass: 0.7 },
  slam: { damping: 9, stiffness: 220, mass: 0.8 },
  calm: { damping: 30, stiffness: 60, mass: 1.2 },
  wordStagger: 4,
  markerFrames: 8,
  transitionFrames: 12,
};
