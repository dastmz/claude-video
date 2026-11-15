import React from "react";

/** Letak elemen secara mutlak (px) — pembantu susun atur babak. */
export const Place: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, ...style }}>{children}</div>
);

/** Thumb (ibu jari) kartun untuk adegan menekan skrin. */
export const Thumb: React.FC<{ width?: number; skin?: string }> = ({ width = 260, skin = "#D69A6C" }) => (
  <svg viewBox="0 0 200 400" width={width} height={width * 2}>
    <path d="M 60 400 L 50 140 Q 50 40 110 30 Q 170 30 165 140 L 170 400 Z" fill={skin} stroke="#A8693F" strokeWidth={5} />
    <path d="M 80 60 Q 110 40 140 60 L 140 120 Q 110 132 80 120 Z" fill="#F3D2B8" stroke="#C99673" strokeWidth={4} />
    <path d="M 60 230 Q 100 245 160 228" stroke="#A8693F" strokeWidth={5} fill="none" />
    <rect x={20} y={300} width={180} height={120} rx={40} fill="#22356F" />
  </svg>
);
