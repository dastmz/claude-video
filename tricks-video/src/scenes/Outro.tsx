import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { outro } from "../content";
import { accent, colors, fonts, Letter, radius, safe, size } from "../theme";
import { slamScale } from "../components/anim";
import { SceneShell } from "../components/SceneShell";
import { WordReveal } from "../components/RichText";
import { Pop, SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const TILES_AT = 6;
const QUOTE_AT = 48;
const BURST_AT = 80;
const CTA_AT = 104;
const CREDIT_AT = 124;

const palette: string[] = [...Object.values(accent), colors.highlight];

const Confetti: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 90) return null;
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0 }}>
      {new Array(70).fill(0).map((_, i) => {
        const a = random(`ca${i}`) * Math.PI * 2;
        const v = 14 + random(`cv${i}`) * 22;
        const x = Math.cos(a) * v * t * 0.9;
        const y = Math.sin(a) * v * t * 0.9 * 0.8 + 0.55 * t * t * 0.5;
        const rot = t * (random(`cr${i}`) - 0.5) * 40;
        const op = Math.max(0, 1 - t / 80);
        const w = 14 + random(`cw${i}`) * 14;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.5, background: palette[i % palette.length], borderRadius: i % 3 === 0 ? 999 : 4, transform: `rotate(${rot}deg)`, opacity: op }} />
        );
      })}
    </div>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const burst = slamScale(frame, fps, BURST_AT);
  const ctaBounce = frame > CTA_AT + 14 ? Math.abs(Math.sin((frame - CTA_AT) / 7)) * -16 : 0;

  return (
    <SceneShell tint={colors.highlight} slams={[BURST_AT + 2]}>
      <div style={{ position: "absolute", left: safe.left, width: safe.width, top: safe.top + 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", rowGap: 26, columnGap: 24 }}>
        {outro.recap.map((r, i) => {
          const at = TILES_AT + i * 4;
          const s = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 230, mass: 0.7 } });
          const col = accent[r.letter as Letter];
          const wave = frame > 60 ? Math.sin((frame - i * 6) / 9) * 5 : 0;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `translateY(${wave}px)` }}>
              <Sfx name="pop" at={at} volume={0.3} />
              <div style={{ width: 160, height: 160, borderRadius: radius, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.headline, fontWeight: 900, fontSize: 124, lineHeight: 1, color: colors.white, transform: `scale(${s})`, opacity: frame >= at ? 1 : 0, boxShadow: `0 14px 40px ${col}77` }}>
                <span style={{ transform: "translateY(0.05em)" }}>{r.letter}</span>
              </div>
              <Pop at={at + 8}>
                <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, color: colors.white }}>{r.label}</span>
              </Pop>
            </div>
          );
        })}
      </div>

      <SafeBox top={800}>
        <div style={{ textAlign: "center", fontFamily: fonts.headline, fontWeight: 900, fontSize: 80, lineHeight: 1.12, color: colors.white }}>
          <WordReveal
            text={outro.quoteBefore}
            start={QUOTE_AT}
            align="center"
            style={{ display: "inline" }}
            wordStyle={(i) => (i === 1 ? { color: colors.highlight } : {})}
          />
          <span style={{ position: "relative", display: "inline-block", marginLeft: "0.25em", transform: `scale(${burst.scale})`, opacity: burst.opacity }}>
            <span style={{ color: colors.highlight, fontSize: 140, lineHeight: 0.9, textShadow: `0 0 50px ${colors.highlight}` }}>{outro.quoteBurst}</span>
            <Confetti at={BURST_AT + 2} />
          </span>
          <Sfx name="slam" at={BURST_AT} volume={0.7} />
        </div>
      </SafeBox>

      <SafeBox top={1210}>
        <Pop at={CTA_AT} style={{ width: "100%", transform: `translateY(${ctaBounce}px)` }}>
          <Sfx name="pop" at={CTA_AT} />
          <div style={{ background: `linear-gradient(90deg, ${accent.S}, ${accent.K})`, borderRadius: 999, padding: "24px 40px", textAlign: "center", fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, lineHeight: 1.2, color: colors.white, boxShadow: `0 20px 50px ${accent.S}66`, border: "3px solid rgba(255,255,255,0.5)" }}>
            {outro.cta}
          </div>
        </Pop>
      </SafeBox>

      <SafeBox top={1430}>
        <Pop at={CREDIT_AT}>
          <span style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: size.minText, color: colors.secondary }}>{outro.credit}</span>
        </Pop>
      </SafeBox>
    </SceneShell>
  );
};
