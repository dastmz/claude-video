import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, X } from "lucide-react";
import { stepK } from "../content";
import { accent, colors, radius, safe, shadow } from "../theme";
import { penProg } from "../components/anim";
import { SceneShell } from "../components/SceneShell";
import { HEADER_BOTTOM, SLAM_AT, StepHeader } from "../components/StepHeader";
import { DrawIcon, Pop } from "../components/UI";
import { Sfx } from "../components/Sfx";

const c = accent.K;
const LEFT_AT = 58;
const RIGHT_AT = 66;
const SCRIBBLE_AT = 64;
const X_AT = 92;
const ALIGN_AT = 98;
const TICK_AT = 124;
const CARD_W = 400;
const CARD_H = 600;

const scribble = (seed: string, y: number) => {
  let d = `M24 ${y}`;
  for (let i = 1; i <= 12; i++) {
    const x = 24 + i * 26 + (random(`${seed}x${i}`) - 0.5) * 14;
    const yy = y + (random(`${seed}y${i}`) - 0.5) * 30;
    d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  return d;
};

export const StepK: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jitter = (k: string) => (random(`${k}${Math.floor(frame / 2)}`) - 0.5) * 6;
  const top = HEADER_BOTTOM - 110;
  return (
    <SceneShell tint={c} slams={[SLAM_AT + 2]}>
      <StepHeader letter={stepK.letter} color={c} headline={stepK.headline} />
      {/* messy */}
      <Pop at={LEFT_AT} style={{ position: "absolute", left: safe.left, top, width: CARD_W, height: CARD_H }}>
        <Sfx name="pop" at={LEFT_AT} />
        <Sfx name="scribble" at={SCRIBBLE_AT} volume={0.7} />
        <Sfx name="scribble" at={SCRIBBLE_AT + 14} volume={0.6} />
        <div style={{ width: "100%", height: "100%", borderRadius: radius, background: "#F1F5F9", boxShadow: shadow, transform: `rotate(${-5 + jitter("r") * 0.5}deg) translate(${jitter("a")}px, ${jitter("b")}px)`, position: "relative", overflow: "hidden", border: `4px solid ${colors.pen}` }}>
          <svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`}>
            {[80, 150, 205, 290, 340, 420, 470].map((y, i) => {
              const p = penProg(frame, SCRIBBLE_AT + i * 3, 10);
              return <path key={i} d={scribble(`s${i}`, y)} fill="none" stroke="#475569" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform={`rotate(${(random(`rot${i}`) - 0.5) * 10} 200 ${y})`} />;
            })}
            <path d="M60 240 C 140 200, 220 300, 330 250" fill="none" stroke="#94A3B8" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - penProg(frame, SCRIBBLE_AT + 22, 8)} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spring({ frame: frame - X_AT, fps, config: { damping: 9, stiffness: 220 } })})` }}>
            <div style={{ width: 200, height: 200, borderRadius: 999, background: `${colors.pen}EE`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${colors.pen}` }}>
              <DrawIcon Icon={X} at={X_AT} color={colors.onAccent} size={150} strokeWidth={3.4} />
            </div>
          </div>
        </div>
      </Pop>
      <Sfx name="slam" at={X_AT} volume={0.5} />
      {/* neat */}
      <Pop at={RIGHT_AT} style={{ position: "absolute", left: safe.left + safe.width - CARD_W, top, width: CARD_W, height: CARD_H }}>
        <Sfx name="pop" at={RIGHT_AT} />
        <div style={{ width: "100%", height: "100%", borderRadius: radius, background: colors.paper, boxShadow: shadow, position: "relative", overflow: "hidden", border: `4px solid ${colors.good}`, padding: "56px 34px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 34 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const s = spring({ frame: frame - ALIGN_AT - i * 2, fps, config: { damping: 15, stiffness: 160 } });
            const ox = (random(`nx${i}`) - 0.5) * 120 * (1 - s);
            const rot = (random(`nr${i}`) - 0.5) * 24 * (1 - s);
            const isHead = i % 3 === 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, transform: `translateX(${ox}px) rotate(${rot}deg)`, marginLeft: isHead ? 0 : 44 }}>
                <div style={{ width: isHead ? 30 : 18, height: isHead ? 30 : 18, borderRadius: 999, background: isHead ? c : "#94A3B8", flexShrink: 0 }} />
                <div style={{ height: isHead ? 26 : 18, borderRadius: 999, background: isHead ? colors.ink : "#94A3B8", width: isHead ? 230 : [180, 150, 0, 190, 140][i - 1] ?? 160 }} />
              </div>
            );
          })}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 24, transform: `scale(${spring({ frame: frame - TICK_AT, fps, config: { damping: 9, stiffness: 220 } })})`, transformOrigin: "85% 85%" }}>
            <div style={{ width: 170, height: 170, borderRadius: 999, background: colors.good, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${colors.good}` }}>
              <DrawIcon Icon={Check} at={TICK_AT} color={colors.onAccent} size={120} strokeWidth={3.6} />
            </div>
          </div>
        </div>
      </Pop>
      <Sfx name="ding" at={TICK_AT} />
    </SceneShell>
  );
};
