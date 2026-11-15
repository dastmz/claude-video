import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, safe, size, video } from "../theme";
import { slamScale } from "./anim";
import { WordReveal } from "./RichText";
import { Sfx } from "./Sfx";

export const SLAM_AT = 8;
export const SETTLE_AT = 26;
export const HEADLINE_AT = 32;

/**
 * Giant letter slams into the centre (scale 3→1, overshoot), then settles at the top
 * of the safe zone (300px). The headline then enters word by word below it.
 * Total height used: safe.top → HEADER_BOTTOM.
 */
export const HEADER_BOTTOM = 790;

export const StepHeader: React.FC<{
  letter: string;
  color: string;
  headline: string;
  headlineSize?: number;
  exitAt?: number;
}> = ({ letter, color, headline, headlineSize = size.headline, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = slamScale(frame, fps, SLAM_AT);
  const settle = spring({ frame: frame - SETTLE_AT, fps, config: { damping: 16, stiffness: 140 } });
  const big = size.giantLetter;
  const small = size.settledLetter;
  // letter box is `big` tall, centred horizontally
  const centreY = interpolate(settle, [0, 1], [880, safe.top + small / 2]);
  const s = scale * interpolate(settle, [0, 1], [1, small / big]);
  const bob = Math.sin(frame / 18) * 6 * settle;
  const exit = exitAt !== undefined ? interpolate(frame, [exitAt, exitAt + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  return (
    <div style={{ opacity: exit }}>
      <Sfx name="slam" at={SLAM_AT} volume={0.7} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: video.width,
          top: centreY - big / 2 + bob,
          height: big,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${s})`,
          opacity,
          fontFamily: fonts.headline,
          fontWeight: 900,
          fontSize: big,
          lineHeight: 1,
          color,
          textShadow: `0 18px 0 rgba(0,0,0,0.28), 0 0 80px ${color}99`,
        }}
      >
        <span style={{ transform: "translateY(0.04em)" }}>{letter}</span>
      </div>
      <div style={{ position: "absolute", left: safe.left, width: safe.width, top: safe.top + small + 20 }}>
        <WordReveal
          text={headline}
          start={HEADLINE_AT}
          align="center"
          style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: headlineSize, lineHeight: 1.12, color: colors.white }}
        />
      </div>
    </div>
  );
};
