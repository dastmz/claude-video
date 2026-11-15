import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kbat } from "../content";
import { accent, colors, fonts, safe, size } from "../theme";
import { penProg } from "../components/anim";
import { SceneShell } from "../components/SceneShell";
import { plain, WordReveal } from "../components/RichText";
import { Pop, SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const c = accent.C;
const HEAD_AT = 12;
const CHEV_AT = 42;
const CHEV_GAP = 11;
const BUB_AT = 104;

const W = 760;
const H = 104;
const chevPath = (first: boolean) => {
  const n = 40; // notch depth
  return first
    ? `M4 4 L ${W - 4} 4 L ${W - 4} ${H - n} L ${W / 2} ${H - 4} L 4 ${H - n} Z`
    : `M4 4 L ${W / 2} ${n} L ${W - 4} 4 L ${W - 4} ${H - n} L ${W / 2} ${H - 4} L 4 ${H - n} Z`;
};

export const Kbat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // after all drawn, a highlight travels down the chain
  const travel = frame > CHEV_AT + 60 ? ((frame - CHEV_AT - 60) / 8) % 7 : -1;
  return (
    <SceneShell tint={c}>
      <SafeBox top={safe.top}>
        <Pop at={4}>
          <Sfx name="pop" at={4} />
          <span style={{ background: colors.highlight, color: colors.text, fontFamily: fonts.headline, fontWeight: 900, fontSize: size.minText, padding: "4px 30px", borderRadius: 999, letterSpacing: "0.1em", display: "inline-block", transform: "rotate(-3deg)" }}>
            {kbat.badge}
          </span>
        </Pop>
        <WordReveal text={kbat.headline} start={HEAD_AT} align="center" style={{ marginTop: 16, fontFamily: fonts.headline, fontWeight: 800, fontSize: 76, lineHeight: 1.12, color: colors.text }} />
      </SafeBox>
      <div style={{ position: "absolute", left: safe.left + (safe.width - W) / 2, top: 548, width: W, display: "flex", flexDirection: "column", gap: 6 }}>
        {kbat.steps.map((label, i) => {
          const at = CHEV_AT + i * CHEV_GAP;
          const p = penProg(frame, at, 10);
          const fill = penProg(frame, at + 6, 8);
          const lit = Math.max(0, 1 - Math.abs(travel - i) / 1.2);
          return (
            <div key={i} style={{ position: "relative", height: H, marginTop: i === 0 ? 0 : -30 }}>
              <Sfx name="pop" at={at} volume={0.3} />
              <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible", filter: `drop-shadow(0 8px 14px rgba(15,27,61,0.15)) drop-shadow(0 0 ${lit * 22}px ${colors.highlight})` }}>
                <path d={chevPath(i === 0)} fill={c} fillOpacity={fill * (0.72 + 0.07 * i)} stroke={lit > 0.3 ? colors.highlight : c} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
              </svg>
              <div style={{ position: "absolute", inset: 0, paddingTop: i === 0 ? 0 : 26, paddingBottom: 24, display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box" }}>
                <span style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 60, color: colors.onAccent, lineHeight: 1, opacity: fill, transform: `scale(${0.6 + 0.4 * fill})` }}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: safe.left, top: 1130, width: safe.width, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "22px 20px" }}>
        {kbat.connectors.map((w, i) => {
          const at = BUB_AT + i * 6;
          const s = spring({ frame: frame - at, fps, config: { damping: 8, stiffness: 240, mass: 0.6 } });
          const bob = frame > at + 15 ? Math.sin((frame + i * 13) / 10) * 6 : 0;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: colors.surface,
                border: `3px solid ${colors.highlight}`,
                color: colors.text,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: size.body,
                padding: "8px 30px",
                borderRadius: 999,
                opacity: frame >= at ? 1 : 0,
                transform: `translateY(${bob}px) scale(${s})`,
                boxShadow: `0 10px 26px rgba(15,27,61,0.12)`,
              }}
            >
              {plain(w)}
              <Sfx name="pop" at={at} volume={0.35} />
            </span>
          );
        })}
      </div>
    </SceneShell>
  );
};
