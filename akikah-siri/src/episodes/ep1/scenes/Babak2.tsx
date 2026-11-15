import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ayah, Ibu } from "../../../shared/characters";
import { Place } from "../../../shared/Place";
import { Calendar } from "../../../shared/props";
import { SceneBackdrop } from "../../../shared/SceneBackdrop";
import { SceneBackground } from "../../../shared/SceneBackground";
import { isTalking } from "../../../shared/Subtitle";
import { sec } from "../../../shared/theme";
import { BABAK, CUES } from "../script";

export const Babak2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const abs = frame + sec(BABAK.b2.start);
  const t = abs / fps; // saat mutlak
  const calIn = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const circle = interpolate(t, [12.6, 14.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // lengan ibu naik menunjuk kalendar 10.5–19 s
  const arm = interpolate(t, [10.6, 11.4, 19, 19.8], [4, 160, 160, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <SceneBackdrop clip="clips/ep1_b2.mp4">
        <SceneBackground scene="ruangTamu" malam />
        <Place x={790 - 396} y={540}>
          <Ayah height={1300} dukungBaby expression={t > 22 ? "risau" : "senyum"} talking={isTalking(CUES, "AYAH", abs)} />
        </Place>
        <Place x={260 - 396} y={520}>
          <Ibu height={1300} expression="senyum" talking={isTalking(CUES, "IBU", abs)} armKiri={arm} hand="tunjuk" />
        </Place>
      </SceneBackdrop>
      <Place x={440} y={260} style={{ transform: `scale(${calIn}) rotate(3deg)`, transformOrigin: "50% 100%" }}>
        <Calendar width={470} circled={7} circleProgress={circle} />
      </Place>
    </>
  );
};
