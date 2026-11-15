import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "./fonts";
import { COLORS, SAFE } from "./theme";

type Props = {
  text: string;
  /** frame (relatif dalam Sequence) bila tajuk mula muncul */
  from?: number;
  /** frame bila tajuk mula hilang (pilihan) */
  until?: number;
  /** kedudukan tengah menegak */
  y?: number;
  fontSize?: number;
  color?: string;
  background?: string;
  rotate?: number;
};

/** Teks tajuk dengan animasi spring "pop". Sentiasa dalam zon selamat mendatar. */
export const OnScreenTitle: React.FC<Props> = ({
  text,
  from = 0,
  until,
  y = 380,
  fontSize = 96,
  color = COLORS.emas,
  background = "rgba(27,42,74,0.92)",
  rotate = -2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 9, stiffness: 160, mass: 0.8 } });
  let out = 1;
  if (until !== undefined) {
    out = interpolate(frame, [until, until + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.width,
        top: y,
        height: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          transform: `scale(${s * out}) rotate(${rotate}deg)`,
          fontFamily: FONTS.tajuk,
          fontWeight: 800,
          fontSize,
          lineHeight: 1.1,
          color,
          textAlign: "center",
          background,
          border: `5px solid ${COLORS.emas}`,
          borderRadius: 28,
          padding: "18px 34px",
          maxWidth: SAFE.width - 20,
          boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
          whiteSpace: "pre-line",
          textShadow: "0 4px 0 rgba(0,0,0,0.35)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
