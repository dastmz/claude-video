import React from "react";
import { useCurrentFrame } from "remotion";
import type { Expression } from "../theme";

export type CharacterProps = {
  expression?: Expression;
  talking?: boolean;
  /** Tinggi paparan dalam px (lebar mengikut nisbah viewBox). */
  height?: number;
  /** Sudut lengan kanan watak (darjah, 0 = ke bawah, negatif = ke atas/luar). */
  armKanan?: number;
  /** Sudut lengan kiri watak (darjah, 0 = ke bawah). */
  armKiri?: number;
  /** Cermin mendatar (watak menghadap arah lain). */
  flip?: boolean;
  style?: React.CSSProperties;
};

export const INK = "#2B1B12";

/** Berkelip mata secara berkala. Pulangkan 1 = terbuka, 0 = tertutup. */
export const useBlink = (seed: number) => {
  const frame = useCurrentFrame();
  const period = 96 + (seed % 5) * 9;
  const t = (frame + seed * 37) % period;
  const seq = [1, 0.45, 0.08, 0.08, 0.45];
  return t < seq.length ? seq[t] : 1;
};

/** Bukaan mulut 0..1 bila bercakap. */
export const useMouthOpen = (talking: boolean, seed: number) => {
  const frame = useCurrentFrame();
  if (!talking) return 0;
  const f = frame + seed * 11;
  const v =
    0.5 +
    0.32 * Math.sin(f * 0.95) +
    0.18 * Math.sin(f * 2.1 + 1.3);
  return Math.max(0, Math.min(1, v));
};

/** Gerakan tubuh kecil (bernafas) & condong kepala semasa bercakap. */
export const useIdle = (seed: number, talking: boolean) => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame + seed * 13) / 22) * 3;
  const tilt = talking ? Math.sin((frame + seed * 5) / 9) * 2.2 : Math.sin((frame + seed * 7) / 40) * 0.8;
  return { bob, tilt };
};

type FaceProps = {
  expression: Expression;
  talking: boolean;
  seed: number;
  skin: string;
  rx?: number;
  ry?: number;
  browWidth?: number;
  lashes?: boolean;
  lipColor?: string;
  /** Elemen tambahan dilukis di atas muka (misai, janggut) dalam koordinat muka. */
  overlay?: React.ReactNode;
  showEars?: boolean;
  blush?: boolean;
};

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `rgb(${r},${g},${b})`;
};
export { shade };

/** Muka kartun berpusat pada (0,0). */
export const Face: React.FC<FaceProps> = ({
  expression,
  talking,
  seed,
  skin,
  rx = 92,
  ry = 108,
  browWidth = 7,
  lashes = false,
  lipColor = "#8A2F34",
  overlay,
  showEars = true,
  blush = true,
}) => {
  const blink = useBlink(seed);
  const open = useMouthOpen(talking, seed);

  // ---------- Kening ----------
  const brows: Record<Expression, string> = {
    senyum: "M -54 -50 Q -34 -62 -14 -53",
    risau: "M -54 -46 Q -36 -50 -16 -64",
    terkejut: "M -54 -66 Q -34 -82 -14 -68",
    lega: "M -54 -52 Q -34 -58 -14 -55",
  };
  const browL = brows[expression];

  // ---------- Mata ----------
  const eyeY = -18;
  const eyes = [-34, 34].map((ex) => {
    if (expression === "lega" && blink > 0.5) {
      // mata tertutup lega (lengkung ke bawah)
      return (
        <path
          key={ex}
          d={`M ${ex - 15} ${eyeY} Q ${ex} ${eyeY + 12} ${ex + 15} ${eyeY}`}
          stroke={INK}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    const big = expression === "terkejut";
    const erx = big ? 14 : 12;
    const ery = (big ? 18 : 15) * blink;
    return (
      <g key={ex}>
        {big ? (
          <ellipse cx={ex} cy={eyeY} rx={23} ry={25 * blink} fill="#fff" stroke={INK} strokeWidth={3} />
        ) : null}
        <ellipse cx={ex} cy={eyeY} rx={erx} ry={Math.max(1.5, ery)} fill={INK} />
        {blink > 0.6 ? <circle cx={ex + 4} cy={eyeY - 5} r={4} fill="#fff" /> : null}
        {lashes && blink > 0.6 ? (
          <path
            d={ex < 0 ? `M ${ex - 11} ${eyeY - 10} L ${ex - 20} ${eyeY - 17}` : `M ${ex + 11} ${eyeY - 10} L ${ex + 20} ${eyeY - 17}`}
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ) : null}
      </g>
    );
  });

  // ---------- Mulut ----------
  const mouthY = 50;
  let mouth: React.ReactNode;
  const filled = (w: number, cy: number, up: number, low: number) => (
    <path
      d={`M ${-w} ${cy} Q 0 ${up} ${w} ${cy} Q 0 ${low} ${-w} ${cy} Z`}
      fill={lipColor}
      stroke={shade(lipColor.startsWith("#") ? lipColor : "#8A2F34", -50)}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  );
  if (expression === "terkejut") {
    const r = talking ? 11 + 9 * open : 17;
    mouth = <ellipse cx={0} cy={mouthY + 4} rx={13} ry={r} fill={lipColor} stroke={INK} strokeWidth={3} />;
  } else if (expression === "risau") {
    mouth = talking
      ? filled(20, mouthY + 8, mouthY + 2, mouthY + 10 + 20 * open)
      : (
        <path
          d={`M -22 ${mouthY + 10} Q -10 ${mouthY - 2} 0 ${mouthY + 4} Q 10 ${mouthY - 2} 22 ${mouthY + 10}`}
          stroke={INK}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      );
  } else if (talking) {
    mouth = filled(28, mouthY - 4, mouthY - 6, mouthY + 6 + 26 * open);
  } else if (expression === "senyum") {
    mouth = filled(30, mouthY - 6, mouthY - 2, mouthY + 24);
  } else {
    mouth = (
      <path
        d={`M -26 ${mouthY - 2} Q 0 ${mouthY + 16} 26 ${mouthY - 2}`}
        stroke={INK}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  return (
    <g>
      {showEars ? (
        <>
          <ellipse cx={-rx + 4} cy={4} rx={18} ry={24} fill={shade(skin, -12)} />
          <ellipse cx={rx - 4} cy={4} rx={18} ry={24} fill={shade(skin, -12)} />
        </>
      ) : null}
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={skin} />
      {blush ? (
        <>
          <ellipse cx={-56} cy={22} rx={17} ry={10} fill="#F28C8C" opacity={0.35} />
          <ellipse cx={56} cy={22} rx={17} ry={10} fill="#F28C8C" opacity={0.35} />
        </>
      ) : null}
      <path d={browL} stroke={INK} strokeWidth={browWidth} fill="none" strokeLinecap="round" />
      <path d={browL} stroke={INK} strokeWidth={browWidth} fill="none" strokeLinecap="round" transform="scale(-1,1)" />
      {eyes}
      <path d="M -6 8 Q 2 24 10 12" stroke={shade(skin, -45)} strokeWidth={4} fill="none" strokeLinecap="round" />
      {overlay}
      {mouth}
      {expression === "risau" ? (
        <path d="M 70 -70 Q 80 -52 70 -46 Q 60 -52 70 -70 Z" fill="#8FD3FF" stroke="#4BA3D9" strokeWidth={2} />
      ) : null}
    </g>
  );
};

type ArmProps = {
  x: number;
  y: number;
  angle: number;
  length?: number;
  sleeve: string;
  skin: string;
  hand?: "buka" | "tunjuk";
  width?: number;
};

/** Lengan generik: berputar pada bahu (x,y). angle 0 = tergantung ke bawah. */
export const Arm: React.FC<ArmProps> = ({ x, y, angle, length = 250, sleeve, skin, hand = "buka", width = 62 }) => {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-width / 2} y={-10} width={width} height={length} rx={width / 2} fill={sleeve} />
      <rect x={-width / 2} y={length - 40} width={width} height={14} rx={7} fill={shade(sleeve.startsWith("#") ? sleeve : "#888888", -25)} opacity={0.6} />
      <circle cx={0} cy={length + 8} r={width * 0.42} fill={skin} />
      {hand === "tunjuk" ? (
        <rect x={-8} y={length + 12} width={16} height={46} rx={8} fill={skin} />
      ) : null}
    </g>
  );
};
