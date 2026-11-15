import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

export type SceneName = "ruangTamu" | "kedaiMakan" | "masjid" | "kelas" | "navy";

type Props = { scene: SceneName; malam?: boolean };

const Star8: React.FC<{ cx: number; cy: number; r: number; fill?: string; stroke?: string; sw?: number; opacity?: number }> = ({ cx, cy, r, fill = "none", stroke = COLORS.emas, sw = 3, opacity = 1 }) => (
  <g opacity={opacity}>
    <rect x={cx - r * 0.7} y={cy - r * 0.7} width={r * 1.4} height={r * 1.4} fill={fill} stroke={stroke} strokeWidth={sw} />
    <rect x={cx - r * 0.7} y={cy - r * 0.7} width={r * 1.4} height={r * 1.4} fill={fill} stroke={stroke} strokeWidth={sw} transform={`rotate(45 ${cx} ${cy})`} />
  </g>
);

const RuangTamu: React.FC<{ malam: boolean }> = ({ malam }) => {
  const frame = useCurrentFrame();
  const wall = malam ? "#3B3A5A" : "#EBD9BE";
  const wall2 = malam ? "#34334F" : "#E2CDAE";
  const twinkle = (i: number) => 0.5 + 0.5 * Math.sin(frame / 12 + i * 1.7);
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <rect width={1080} height={1920} fill={wall} />
      {[...Array(12)].map((_, i) => (
        <rect key={i} x={i * 90} y={0} width={45} height={1500} fill={wall2} opacity={0.5} />
      ))}
      {/* tingkap */}
      <rect x={600} y={300} width={380} height={480} rx={20} fill="#5B3A22" />
      <rect x={620} y={320} width={340} height={440} fill={malam ? "#0E1A3A" : "#AED8F5"} />
      {malam ? (
        <>
          <circle cx={860} cy={420} r={46} fill="#FFF3C4" />
          <circle cx={880} cy={405} r={42} fill="#0E1A3A" />
          {[[680, 380], [740, 470], [700, 600], [900, 560], [800, 660], [920, 700]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill="#fff" opacity={twinkle(i)} />
          ))}
        </>
      ) : (
        <circle cx={860} cy={420} r={50} fill="#FFE27A" />
      )}
      <rect x={786} y={320} width={8} height={440} fill="#5B3A22" />
      <rect x={620} y={536} width={340} height={8} fill="#5B3A22" />
      <path d="M 590 290 Q 640 540 600 800 L 560 800 L 560 290 Z" fill="#B5485B" />
      <path d="M 990 290 Q 940 540 980 800 L 1020 800 L 1020 290 Z" fill="#B5485B" />
      {/* bingkai hiasan geometri */}
      <rect x={110} y={340} width={300} height={300} rx={14} fill="#5B3A22" />
      <rect x={128} y={358} width={264} height={264} fill={malam ? "#24304F" : "#1B2A4A"} />
      <Star8 cx={260} cy={490} r={88} />
      <Star8 cx={260} cy={490} r={46} fill={COLORS.emas} stroke={COLORS.emas} opacity={0.85} />
      {/* lampu */}
      {malam ? <circle cx={480} cy={900} r={260} fill="#FFD98A" opacity={0.12} /> : null}
      <rect x={474} y={760} width={12} height={600} fill="#4A3A2A" />
      <path d="M 420 700 L 540 700 L 510 780 L 450 780 Z" fill="#F6D9A0" />
      {/* lantai */}
      <rect x={0} y={1480} width={1080} height={440} fill={malam ? "#4A3324" : "#A8754D"} />
      {[...Array(6)].map((_, i) => (
        <rect key={i} x={0} y={1500 + i * 70} width={1080} height={4} fill="#000" opacity={0.12} />
      ))}
      {/* sofa */}
      <rect x={30} y={1080} width={1020} height={300} rx={60} fill={malam ? "#6B4F7A" : "#8E6BA8"} />
      <rect x={60} y={1260} width={960} height={240} rx={40} fill={malam ? "#7C5E8C" : "#A07DBB"} />
      <rect x={10} y={1180} width={110} height={330} rx={40} fill={malam ? "#5C4369" : "#7C5A96"} />
      <rect x={960} y={1180} width={110} height={330} rx={40} fill={malam ? "#5C4369" : "#7C5A96"} />
      {malam ? <rect width={1080} height={1920} fill="#0B1030" opacity={0.18} /> : null}
    </svg>
  );
};

const KedaiMakan: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
    <rect width={1080} height={1920} fill="#F3E2B5" />
    {/* jubin bawah */}
    {[...Array(14)].map((_, r) =>
      [...Array(10)].map((__, c) => (
        <rect key={`${r}-${c}`} x={c * 110} y={860 + r * 80} width={108} height={78} fill={(r + c) % 2 ? "#2F8F6B" : "#F7F4EA"} />
      )),
    )}
    <rect x={0} y={850} width={1080} height={14} fill="#1E6B4F" />
    {/* papan menu */}
    <rect x={90} y={300} width={540} height={420} rx={18} fill="#2B2B2B" stroke="#7A5233" strokeWidth={16} />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={140} y={370 + i * 66} width={300} height={18} rx={9} fill="#F6EBDD" opacity={0.8} />
        <rect x={500} y={370 + i * 66} width={80} height={18} rx={9} fill={COLORS.emas} />
      </g>
    ))}
    {/* lampu gantung */}
    {[760, 940].map((x) => (
      <g key={x}>
        <rect x={x - 3} y={220} width={6} height={200} fill="#333" />
        <path d={`M ${x - 70} 470 Q ${x} 380 ${x + 70} 470 Z`} fill="#D9822B" />
        <circle cx={x} cy={500} r={90} fill="#FFE7A8" opacity={0.25} />
      </g>
    ))}
    {/* kipas dinding / jam */}
    <circle cx={850} cy={680} r={70} fill="#fff" stroke="#555" strokeWidth={8} />
    <path d="M 850 680 L 850 630 M 850 680 L 885 700" stroke="#333" strokeWidth={8} strokeLinecap="round" />
    <rect width={1080} height={1920} fill="#3A2A10" opacity={0.08} />
  </svg>
);

const Masjid: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
    <defs>
      <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1B2A4A" />
        <stop offset="1" stopColor="#E8A87C" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="#F4EDE1" />
    {[0, 1, 2].map((i) => {
      const x = 80 + i * 320;
      return (
        <g key={i}>
          <path d={`M ${x} 1200 L ${x} 560 Q ${x + 130} 300 ${x + 260} 560 L ${x + 260} 1200 Z`} fill="url(#langit)" />
          <path d={`M ${x} 1200 L ${x} 560 Q ${x + 130} 300 ${x + 260} 560 L ${x + 260} 1200`} fill="none" stroke={COLORS.emas} strokeWidth={12} />
        </g>
      );
    })}
    <path d="M 420 1100 Q 540 860 660 1100 Z" fill="#2E6B57" opacity={0.85} />
    <rect x={0} y={1200} width={1080} height={720} fill="#8C2F39" />
    {[...Array(7)].map((_, i) => (
      <rect key={i} x={i * 160} y={1200} width={6} height={720} fill={COLORS.emas} opacity={0.5} />
    ))}
  </svg>
);

const Kelas: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
    <rect width={1080} height={1920} fill="#DDEBE3" />
    <rect x={70} y={300} width={820} height={560} rx={16} fill="#fff" stroke="#9AA6B2" strokeWidth={18} />
    <rect x={70} y={860} width={820} height={24} fill="#9AA6B2" />
    <rect x={0} y={1400} width={1080} height={520} fill="#B48A60" />
    {[120, 600].map((x) => (
      <g key={x}>
        <rect x={x} y={1260} width={360} height={36} rx={8} fill="#C79A6B" />
        <rect x={x + 20} y={1296} width={20} height={200} fill="#6B5A4A" />
        <rect x={x + 320} y={1296} width={20} height={200} fill="#6B5A4A" />
      </g>
    ))}
  </svg>
);

export const NavyBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <defs>
        <radialGradient id="glow" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#2B4170" />
          <stop offset="1" stopColor={COLORS.navy} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#glow)" />
      <g transform={`translate(0 ${(frame * 0.4) % 240})`}>
        {[...Array(6)].map((_, c) =>
          [...Array(10)].map((__, r) => (
            <Star8 key={`${r}-${c}`} cx={90 + c * 180 + (r % 2) * 90} cy={-240 + r * 240} r={50} sw={2} opacity={0.12} />
          )),
        )}
      </g>
    </svg>
  );
};

/** Latar babak bersama. */
export const SceneBackground: React.FC<Props> = ({ scene, malam = false }) => (
  <AbsoluteFill>
    {scene === "ruangTamu" ? <RuangTamu malam={malam} /> : null}
    {scene === "kedaiMakan" ? <KedaiMakan /> : null}
    {scene === "masjid" ? <Masjid /> : null}
    {scene === "kelas" ? <Kelas /> : null}
    {scene === "navy" ? <NavyBackground /> : null}
  </AbsoluteFill>
);
