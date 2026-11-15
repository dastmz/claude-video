import React from "react";
import { interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EpisodeCard } from "../../../shared/EpisodeCard";
import { FONTS } from "../../../shared/fonts";
import { OnScreenTitle } from "../../../shared/OnScreenTitle";
import { SceneBackdrop } from "../../../shared/SceneBackdrop";
import { SceneBackground } from "../../../shared/SceneBackground";
import { COLORS, SAFE, sec } from "../../../shared/theme";
import { BABAK, SITUASI } from "../script";

const rel = (s: number) => sec(s - BABAK.b5.start);

export const Babak5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boxIn = spring({ frame, fps, config: { damping: 14 } });
  return (
    <>
      <SceneBackdrop clip="clips/ep1_b5.mp4">
        <SceneBackground scene="navy" />
      </SceneBackdrop>
      <div
        style={{
          position: "absolute",
          left: SAFE.left + 10,
          width: SAFE.width - 20,
          top: 260,
          padding: "30px 36px",
          borderRadius: 30,
          background: "rgba(246,235,221,0.08)",
          border: `3px solid rgba(232,176,75,0.6)`,
          transform: `scale(${boxIn})`,
          transformOrigin: "50% 0%",
        }}
      >
        <div style={{ fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: COLORS.emas, marginBottom: 14 }}>SITUASI</div>
        {SITUASI.map((line, i) => {
          const at = rel(75.6 + i * 0.9);
          const o = interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={line} style={{ display: "flex", alignItems: "center", gap: 20, opacity: o, transform: `translateX(${(1 - o) * -60}px)`, margin: "14px 0" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: COLORS.emas, transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ fontFamily: FONTS.sariKata, fontWeight: 700, fontSize: 41, color: COLORS.krim, lineHeight: 1.2 }}>{line}</div>
            </div>
          );
        })}
      </div>
      <OnScreenTitle text={"PINJAM? TANGGUH?\nATAU ADA CARA LAIN?"} from={rel(79.4)} y={940} fontSize={64} />
      <Sequence from={rel(85)} name="EpisodeCard">
        <EpisodeCard episode={2} title="Apa Kata Syarak?" />
      </Sequence>
    </>
  );
};
