import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "./fonts";
import { COLORS, SAFE } from "./theme";

type Props = {
  /** teks Arab (ayat/hadis) — pilihan */
  arab?: string;
  terjemahan: string;
  rujukan: string;
  label?: string;
  from?: number;
  until?: number;
  y?: number;
};

/** Kad dalil: teks Arab (Amiri), terjemahan Melayu & rujukan. */
export const VerseCard: React.FC<Props> = ({ arab, terjemahan, rujukan, label = "DALIL", from = 0, until, y = 250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 14 } });
  const out = until === undefined ? 1 : interpolate(frame, [until, until + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(frame - from, [10, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left + 10,
        width: SAFE.width - 20,
        top: y,
        padding: "24px 34px 30px",
        borderRadius: 30,
        background: COLORS.krim,
        border: `6px solid ${COLORS.emas}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        textAlign: "center",
        transform: `scale(${s * out})`,
        transformOrigin: "50% 0%",
        opacity: out,
      }}
    >
      <div style={{ display: "inline-block", fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: COLORS.krim, background: COLORS.navy, padding: "4px 20px", borderRadius: 999 }}>{label}</div>
      {arab ? (
        <div dir="rtl" style={{ fontFamily: FONTS.arab, fontWeight: 700, fontSize: 64, lineHeight: 1.7, color: COLORS.navy, marginTop: 10 }}>
          {arab}
        </div>
      ) : null}
      <div style={{ opacity: t2, fontFamily: FONTS.sariKata, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: "#2A2A2A", marginTop: arab ? 6 : 18 }}>“{terjemahan}”</div>
      <div style={{ opacity: t2, fontFamily: FONTS.tajuk, fontWeight: 700, fontSize: 30, color: "#9A6B12", marginTop: 12 }}>{rujukan}</div>
    </div>
  );
};
