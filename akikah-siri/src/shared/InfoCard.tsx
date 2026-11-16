import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "./fonts";
import { COLORS, SAFE } from "./theme";

export type InfoLine = { text: string; /** frame relatif bila baris muncul */ at: number; tone?: "ok" | "no" | "info" };

type Props = {
  title: string;
  lines: InfoLine[];
  from?: number;
  until?: number;
  y?: number;
  accent?: string;
  fontSize?: number;
};

const TONE = { ok: "#22C55E", no: "#E5484D", info: COLORS.emas } as const;

/** Kad maklumat bertajuk dengan baris muncul satu demi satu (dalam zon selamat). */
export const InfoCard: React.FC<Props> = ({ title, lines, from = 0, until, y = 260, accent = COLORS.emas, fontSize = 46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 13 } });
  const out = until === undefined ? 1 : interpolate(frame, [until, until + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left + 10,
        width: SAFE.width - 20,
        top: y,
        padding: "26px 34px 30px",
        borderRadius: 30,
        background: "rgba(27,42,74,0.94)",
        border: `5px solid ${accent}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        transform: `scale(${s * out})`,
        transformOrigin: "50% 0%",
        opacity: out,
      }}
    >
      <div style={{ display: "inline-block", fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: COLORS.navy, background: accent, padding: "4px 20px", borderRadius: 999, marginBottom: 12 }}>
        {title}
      </div>
      {lines.map((l) => {
        const o = interpolate(frame, [l.at, l.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const c = TONE[l.tone ?? "info"];
        return (
          <div key={l.text} style={{ display: "flex", alignItems: "center", gap: 18, margin: "12px 0", opacity: o, transform: `translateX(${(1 - o) * -50}px)` }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: c, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 26 }}>
              {l.tone === "ok" ? "✓" : l.tone === "no" ? "✕" : "•"}
            </div>
            <div style={{ fontFamily: FONTS.sariKata, fontWeight: 700, fontSize, color: COLORS.krim, lineHeight: 1.2 }}>{l.text}</div>
          </div>
        );
      })}
    </div>
  );
};
