import React from "react";
import { AbsoluteFill } from "remotion";
import { FONTS } from "./fonts";
import { LAYOUT, SAFE } from "./theme";

export const WATERMARK_TEXT = "Ustazah Rasyidah@Penrissen";

/** Watermark putih 60% legap di y≈1480, dalam zon selamat, sepanjang video. */
export const Watermark: React.FC<{ text?: string }> = ({ text = WATERMARK_TEXT }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.width,
        top: LAYOUT.watermarkY - 22,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS.tajuk,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: 1,
        color: "rgba(255,255,255,0.6)",
        textShadow: "0 2px 6px rgba(0,0,0,0.35)",
      }}
    >
      {text}
    </div>
  </AbsoluteFill>
);
