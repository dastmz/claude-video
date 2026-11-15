import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { hook } from "../content";
import { colors, fonts, radius, safe, shadow } from "../theme";
import { penProg, slamScale } from "../components/anim";
import { Marked } from "../components/Marks";
import { SceneShell } from "../components/SceneShell";
import { TypeLines, WordReveal } from "../components/RichText";
import { SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const SLAM = 2;
const TYPE_AT = 22;
const STAMP = 52;
const SUB_AT = 78;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = slamScale(frame, fps, SLAM);
  const stamp = spring({ frame: frame - STAMP, fps, config: { damping: 11, stiffness: 260 } });
  const stampShake = frame >= STAMP + 6 ? Math.sin(frame * 1.9) * 2.5 + (random(`st${frame}`) - 0.5) * 3 : 0;
  const flash = interpolate(frame, [STAMP + 2, STAMP + 5, STAMP + 16], [0, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [l1, l2] = [hook.slam.split(" ").slice(0, 2).join(" "), hook.slam.split(" ").slice(2).join(" ")];

  return (
    <SceneShell tint={colors.pen} slams={[SLAM, STAMP + 3]}>
      <Sfx name="slam" at={SLAM} volume={0.8} />
      <Sfx name="slam" at={STAMP + 2} volume={0.8} />
      <SafeBox top={safe.top + 30}>
        <div
          style={{
            transform: `scale(${slam.scale})`,
            opacity: slam.opacity,
            fontFamily: fonts.headline,
            fontWeight: 900,
            fontSize: 156,
            lineHeight: 0.98,
            textAlign: "center",
            color: colors.text,
            textShadow: "0 12px 0 rgba(15,27,61,0.12)",
          }}
        >
          <div>
            {l1.replace("2", "")}
            <span style={{ color: colors.pen }}>2</span>
          </div>
          <div>{l2}</div>
        </div>
        <div style={{ marginTop: 40, fontFamily: fonts.headline, fontWeight: 800, fontSize: 84, color: colors.textSoft, letterSpacing: "0.02em" }}>
          <TypeLines lines={[hook.typed]} start={TYPE_AT} cps={0.7} linePause={0} caretColor={colors.highlight} />
        </div>
      </SafeBox>

      {/* exam paper with a red-pen score */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", opacity: frame >= STAMP ? 1 : 0 }}>
        <div
          style={{
            width: 560,
            height: 400,
            borderRadius: radius,
            background: colors.paper,
            boxShadow: shadow,
            border: `3px solid ${colors.surfaceBorder}`,
            transform: `translate(${stampShake}px, ${stampShake * 0.6}px) rotate(${-6 + stampShake * 0.4}deg) scale(${2.2 - 1.2 * stamp})`,
            position: "relative",
            padding: "48px 44px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          {[300, 240, 280, 200, 260].map((w, i) => (
            <div key={i} style={{ width: w, height: 18, borderRadius: 999, background: "#CBD5E1" }} />
          ))}
          <div style={{ position: "absolute", right: 46, top: 60, fontFamily: fonts.headline, fontWeight: 900, fontSize: 190, lineHeight: 1, color: colors.pen, transform: "rotate(-8deg)" }}>
            <Marked mark="circle" p={penProg(frame, STAMP + 8, 14)} seed="score">
              {hook.score}
            </Marked>
          </div>
        </div>
      </div>

      <SafeBox top={1350}>
        <WordReveal text={hook.sub} start={SUB_AT} align="center" style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 68, color: colors.text }} />
      </SafeBox>

      <AbsoluteFill style={{ background: colors.pen, opacity: flash, pointerEvents: "none" }} />
    </SceneShell>
  );
};
