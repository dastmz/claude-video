import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "./fonts";
import { COLORS, SAFE } from "./theme";

/** Langkah jawapan KBAT P-H-K-R. Tukar `nama` di sini jika istilah berbeza. */
export const PHKR = [
  { huruf: "P", nama: "Pendirian", warna: COLORS.P },
  { huruf: "H", nama: "Hujah", warna: COLORS.H },
  { huruf: "K", nama: "Kaitan dalil", warna: COLORS.K },
  { huruf: "R", nama: "Rumusan", warna: COLORS.R },
] as const;
export type Huruf = (typeof PHKR)[number]["huruf"];

/**
 * Baris 4 jubin P-H-K-R. `appearAt[i]` = frame jubin muncul; `active` = jubin diserlahkan
 * (yang lain dimalapkan). Tanpa `active`, semua terang.
 */
export const PHKRTiles: React.FC<{ y?: number; appearAt?: number[]; active?: Huruf | null; size?: number }> = ({
  y = 240,
  appearAt = [0, 0, 0, 0],
  active = null,
  size = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gap = (SAFE.width - 4 * size) / 3;
  return (
    <>
      {PHKR.map((p, i) => {
        const s = spring({ frame: frame - appearAt[i], fps, config: { damping: 10, stiffness: 170 } });
        const on = active === null || active === p.huruf;
        return (
          <div
            key={p.huruf}
            style={{
              position: "absolute",
              left: SAFE.left + i * (size + gap),
              top: y,
              width: size,
              height: size * 0.72,
              borderRadius: 26,
              background: p.warna,
              opacity: s * (on ? 1 : 0.35),
              transform: `scale(${s * (active === p.huruf ? 1.08 : 1)})`,
              boxShadow: on ? `0 12px 28px rgba(0,0,0,0.45), 0 0 0 5px ${active === p.huruf ? "#fff" : "transparent"}` : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <div style={{ fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: size * 0.42, lineHeight: 1 }}>{p.huruf}</div>
            <div style={{ fontFamily: FONTS.tajuk, fontWeight: 700, fontSize: size * 0.12, marginTop: 4, whiteSpace: "nowrap" }}>{p.nama}</div>
          </div>
        );
      })}
    </>
  );
};

/** Kad isi satu langkah P/H/K/R, berwarna mengikut huruf. */
export const PHKRStepCard: React.FC<{
  huruf: Huruf;
  lines: { text: string; at: number }[];
  from?: number;
  y?: number;
  fontSize?: number;
}> = ({ huruf, lines, from = 0, y = 430, fontSize = 44 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PHKR.find((x) => x.huruf === huruf)!;
  if (frame < from) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 13 } });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left + 10,
        width: SAFE.width - 20,
        top: y,
        borderRadius: 30,
        overflow: "hidden",
        background: "rgba(255,255,255,0.97)",
        border: `6px solid ${p.warna}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        transform: `scale(${s})`,
        transformOrigin: "50% 0%",
      }}
    >
      <div style={{ background: p.warna, color: "#fff", fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 44, padding: "10px 28px", display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ background: "#fff", color: p.warna, borderRadius: 14, width: 62, height: 62, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{p.huruf}</span>
        {p.nama.toUpperCase()}
      </div>
      <div style={{ padding: "14px 30px 22px" }}>
        {lines.map((l) => {
          const o = interpolate(frame, [l.at, l.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={l.text} style={{ display: "flex", gap: 16, alignItems: "flex-start", margin: "10px 0", opacity: o, transform: `translateX(${(1 - o) * -40}px)` }}>
              <div style={{ width: 18, height: 18, marginTop: fontSize * 0.36, borderRadius: 4, background: p.warna, transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ fontFamily: FONTS.sariKata, fontWeight: 700, fontSize, color: "#1E1E1E", lineHeight: 1.25 }}>{l.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
