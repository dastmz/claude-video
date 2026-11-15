import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "./fonts";
import { NavyBackground } from "./SceneBackground";
import { COLORS, SAFE } from "./theme";

type Props = { episode: number; title: string; label?: string };

/** Kad "Episod X: tajuk". Letak dalam <Sequence>; animasi bermula pada frame 0. */
export const EpisodeCard: React.FC<Props> = ({ episode, title, label = "SETERUSNYA" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bg = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const s = spring({ frame: frame - 4, fps, config: { damping: 11, stiffness: 140 } });
  const s2 = spring({ frame: frame - 14, fps, config: { damping: 12 } });
  const shimmer = interpolate(frame % 60, [0, 60], [-200, 1200]);
  return (
    <AbsoluteFill style={{ opacity: bg }}>
      <NavyBackground />
      <div
        style={{
          position: "absolute",
          left: SAFE.left + 20,
          width: SAFE.width - 40,
          top: 560,
          height: 560,
          borderRadius: 40,
          border: `8px solid ${COLORS.emas}`,
          background: "rgba(16,26,48,0.85)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          transform: `scale(${s})`,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: shimmer, width: 120, background: "linear-gradient(90deg,transparent,rgba(232,176,75,0.18),transparent)", transform: "skewX(-20deg)" }} />
        <div style={{ fontFamily: FONTS.tajuk, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: COLORS.navy, background: COLORS.emas, padding: "6px 26px", borderRadius: 999 }}>
          {label}
        </div>
        <div style={{ fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 104, color: COLORS.emas, lineHeight: 1 }}>
          Episod {episode}:
        </div>
        <div style={{ fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 82, color: COLORS.krim, textAlign: "center", lineHeight: 1.1, transform: `translateY(${(1 - s2) * 40}px)`, opacity: s2, padding: "0 30px" }}>
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
