import { interpolate, spring, random } from "remotion";
import type { CSSProperties } from "react";
import { motion } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };

/** Standard "word/item enters" motion: scale 0.6→1, slide up, blur→sharp. */
export const popStyle = (
  frame: number,
  fps: number,
  at: number,
  cfg: SpringCfg = motion.word,
  rise = 36,
): CSSProperties => {
  const s = spring({ frame: frame - at, fps, config: cfg });
  const lin = interpolate(frame - at, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return {
    opacity: lin,
    transform: `translateY(${(1 - s) * rise}px) scale(${0.6 + 0.4 * s})`,
    filter: `blur(${(1 - lin) * 12}px)`,
  };
};

/** Big letters slam in: scale 3→1 with overshoot. */
export const slamScale = (frame: number, fps: number, at: number) => {
  const s = spring({ frame: frame - at, fps, config: motion.slam });
  return { scale: 3 - 2 * s, opacity: interpolate(frame - at, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
};

/** Linear 0→1 progress over [at, at+dur]. */
export const prog = (frame: number, at: number, dur: number) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Ease-out progress for pen strokes. */
export const penProg = (frame: number, at: number, dur: number) => {
  const p = prog(frame, at, dur);
  return 1 - Math.pow(1 - p, 2.2);
};

/** Camera shake: 4px, decaying over 6 frames, for each slam frame. */
export const shakeOffset = (frame: number, slams: number[], amp = 4, len = 6) => {
  let x = 0;
  let y = 0;
  for (const at of slams) {
    const d = frame - at;
    if (d >= 0 && d < len) {
      const a = amp * (1 - d / len);
      x += (random(`sx${at}-${d}`) - 0.5) * 2 * a;
      y += (random(`sy${at}-${d}`) - 0.5) * 2 * a;
    }
  }
  return { x, y };
};

/** Hand-drawn wobbly ellipse inside a w×h box (overlapping ~1.1 turns). */
export const wobblyEllipse = (seed: string, w = 100, h = 100) => {
  const pts: string[] = [];
  const turns = 1.12;
  const n = 56;
  const start = -2.2 + random(seed) * 0.5;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + t * Math.PI * 2 * turns;
    const r = 1 + (random(`${seed}-${i}`) - 0.5) * 0.05 + (t > 1 / turns ? 0.07 * t : 0);
    const x = w / 2 + w * 0.47 * r * Math.cos(a);
    const y = h / 2 + h * 0.44 * r * Math.sin(a) + t * h * 0.03;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(" ");
};

/** Hand-drawn wobbly underline inside a w×h box. */
export const wobblyLine = (seed: string, w = 100, h = 20) => {
  const pts: string[] = [];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = h * 0.1 + t * (w - h * 0.2);
    const y = h / 2 + Math.sin(t * Math.PI * 1.3 + random(seed) * 3) * h * 0.15 + (random(`${seed}-${i}`) - 0.5) * h * 0.1;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(" ");
};

/** Rough text width in em for Inter/Poppins (good enough to shape pen strokes). */
export const approxEm = (text: string) => text.length * 0.56;
