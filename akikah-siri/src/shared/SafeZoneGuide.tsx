import React from "react";
import { AbsoluteFill } from "remotion";
import { LAYOUT, SAFE, VIDEO } from "./theme";

/** Lapisan semakan (draf sahaja): kawasan merah = zon UI TikTok. */
export const SafeZoneGuide: React.FC = () => {
  const red = "rgba(255,0,0,0.28)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: VIDEO.width, height: SAFE.top, background: red }} />
      <div style={{ position: "absolute", left: 0, top: SAFE.bottom, width: VIDEO.width, height: VIDEO.height - SAFE.bottom, background: red }} />
      <div style={{ position: "absolute", left: SAFE.right, top: SAFE.top, width: VIDEO.width - SAFE.right, height: SAFE.bottom - SAFE.top, background: red }} />
      <div style={{ position: "absolute", left: 0, top: LAYOUT.subtitleY, width: VIDEO.width, height: 2, background: "cyan" }} />
      <div style={{ position: "absolute", left: 0, top: LAYOUT.watermarkY, width: VIDEO.width, height: 2, background: "yellow" }} />
    </AbsoluteFill>
  );
};
