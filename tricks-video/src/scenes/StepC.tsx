import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BookOpen, Crown, Ear, Flag, Gift, Heart, HeartCrack, Megaphone, Moon, ShieldAlert, ShieldCheck, Smile, Frown,
  Sparkles, Star, ThumbsDown, ThumbsUp, Users, Handshake, Brain,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { stepC } from "../content";
import { accent, colors, fonts, radius, safe, shadow, size } from "../theme";
import { penProg, popStyle } from "../components/anim";
import { SceneShell } from "../components/SceneShell";
import { SLAM_AT, StepHeader } from "../components/StepHeader";
import { plain, WordReveal } from "../components/RichText";
import { DrawIcon, Pop, SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const c = accent.C;
const BANNER_AT = 68;
export const CARDS_AT = 110;
export const CARD_LEN = 105;
const CARD_TOP = 452;
const CARD_BOTTOM = safe.top + safe.height; // 1520

/* ---------- shared card pieces ---------- */

const FormulaCard: React.FC<{ index: number; label: string; children: React.ReactNode }> = ({ index, label, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - (CARDS_AT + index * CARD_LEN);
  const enter = spring({ frame: local, fps, config: { damping: 18, stiffness: 170 } });
  const exit = index < 4 ? spring({ frame: local - CARD_LEN, fps, config: { damping: 18, stiffness: 170 } }) : 0;
  if (local < -2 || local > CARD_LEN + 16) return null;
  const x = (1 - enter) * 1100 - exit * 1100;
  return (
    <div
      style={{
        position: "absolute",
        left: safe.left,
        width: safe.width,
        top: CARD_TOP,
        height: CARD_BOTTOM - CARD_TOP,
        transform: `translateX(${x}px) rotate(${(1 - enter) * 6 - exit * 6}deg)`,
        borderRadius: radius,
        background: colors.surface,
        border: `3px solid ${c}55`,
        boxShadow: `${shadow}, 0 0 60px ${c}22`,
        padding: "34px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      <Sfx name="whoosh" at={CARDS_AT + index * CARD_LEN} volume={0.35} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...popStyle(frame, fps, CARDS_AT + index * CARD_LEN + 6) }}>
        <span style={{ background: c, color: colors.onAccent, fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, borderRadius: 999, padding: "8px 30px", lineHeight: 1.2 }}>{label}</span>
        <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, color: colors.textSoft }}>{index + 1}/5</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 10 }}>{children}</div>
    </div>
  );
};

const Formula: React.FC<{ at: number; text: string; fontSize: number; color?: string; style?: React.CSSProperties }> = ({ at, text, fontSize, color = c, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 220, mass: 0.8 } });
  return (
    <div
      style={{
        fontFamily: fonts.headline,
        fontWeight: 900,
        fontSize,
        lineHeight: 1.05,
        color,
        textAlign: "center",
        letterSpacing: "0.02em",
        opacity: frame >= at ? 1 : 0,
        transform: `scale(${2.2 - 1.2 * s})`,
        textShadow: `0 6px 0 rgba(15,27,61,0.12)`,
        ...style,
      }}
    >
      {text}
      <Sfx name="slam" at={at} volume={0.35} />
    </div>
  );
};

const Item: React.FC<{ at: number; Icon: LucideIcon; text: string; iconColor?: string; fontSize?: number; box?: number }> = ({ at, Icon, text, iconColor = c, fontSize = size.body, box = 84 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <Pop at={at} style={{ width: box, height: box, borderRadius: 22, background: `${iconColor}22`, border: `2px solid ${iconColor}66`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <DrawIcon Icon={Icon} at={at + 2} color={iconColor} size={Math.round(box * 0.64)} />
    </Pop>
    <Sfx name="pop" at={at} volume={0.35} />
    <WordReveal text={text} start={at + 2} stagger={2} gap={0.24} style={{ fontFamily: fonts.body, fontWeight: 500, fontSize, lineHeight: 1.12, color: colors.text, flex: 1 }} />
  </div>
);

/* ---------- the five cards ---------- */

const Hikmah: React.FC = () => {
  const b = CARDS_AT;
  const icons = [Smile, Sparkles, Gift, Handshake, Star];
  return (
    <FormulaCard index={0} label={stepC.hikmah.label}>
      <Formula at={b + 12} text={stepC.hikmah.formula} fontSize={210} style={{ margin: "36px 0 40px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        {stepC.hikmah.items.map((t, i) => (
          <Item key={i} at={b + 28 + i * 9} Icon={icons[i]} text={t} />
        ))}
      </div>
    </FormulaCard>
  );
};

const Half: React.FC<{ at: number; good: boolean }> = ({ at, good }) => {
  const d = good ? stepC.kesan.good : stepC.kesan.bad;
  const col = good ? "#22C55E" : "#EF4444";
  const icons = good ? [Heart, Smile, ShieldCheck] : [HeartCrack, Frown, ShieldAlert];
  return (
    <Pop at={at} style={{ background: `${col}14`, border: `2px solid ${col}55`, borderRadius: 28, padding: "14px 24px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 8 }}>
        <DrawIcon Icon={good ? ThumbsUp : ThumbsDown} at={at + 2} color={col} size={64} />
        <Formula at={at + 4} text={d.formula} fontSize={80} color={col} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {d.items.map((t, i) => (
          <Item key={i} at={at + 12 + i * 8} Icon={icons[i]} text={t} iconColor={col} box={68} />
        ))}
      </div>
    </Pop>
  );
};

const Kesan: React.FC = () => {
  const b = CARDS_AT + CARD_LEN;
  return (
    <FormulaCard index={1} label={stepC.kesan.label}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
        <Half at={b + 12} good />
        <Half at={b + 46} good={false} />
      </div>
    </FormulaCard>
  );
};

const Punca: React.FC = () => {
  const frame = useCurrentFrame();
  const b = CARDS_AT + 2 * CARD_LEN;
  const trunk = penProg(frame, b + 22, 12);
  const canopy = penProg(frame, b + 26, 14);
  const icons = [Moon, BookOpen, Users];
  const cols = ["#22C55E", "#F59E0B", "#EC4899"];
  // roots: from trunk base (390,330) to three columns
  const roots = [
    "M390 300 C 380 380, 200 380, 130 470",
    "M390 300 C 395 380, 392 420, 388 470",
    "M390 300 C 400 380, 580 380, 650 470",
  ];
  return (
    <FormulaCard index={2} label={stepC.punca.label}>
      <Formula at={b + 12} text={stepC.punca.formula} fontSize={66} style={{ margin: "30px 0 4px", whiteSpace: "nowrap" }} />
      <div style={{ position: "relative", height: 480, marginTop: 6 }}>
        <svg viewBox="0 0 780 480" width="100%" height="480" style={{ overflow: "visible" }}>
          {/* canopy */}
          <path d="M390 60 C 300 40, 250 110, 285 150 C 230 190, 290 260, 350 235 C 380 270, 430 270, 450 235 C 520 255, 560 190, 505 150 C 540 100, 470 40, 390 60 Z" fill={`${colors.good}22`} stroke={colors.good} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - canopy} />
          {/* trunk */}
          <path d="M390 300 L 390 230 M390 260 L 350 225 M390 250 L 425 222" fill="none" stroke="#A16207" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - trunk} />
          {/* ground */}
          <path d="M60 300 L 720 300" stroke={`${colors.textSoft}55`} strokeWidth={4} strokeDasharray="14 12" style={{ opacity: trunk }} />
          {roots.map((d, i) => {
            const p = penProg(frame, b + 36 + i * 8, 14);
            return <path key={i} d={d} fill="none" stroke={cols[i]} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 10px ${cols[i]})` }} />;
          })}
        </svg>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: -20 }}>
        {stepC.punca.items.map((t, i) => {
          const at = b + 46 + i * 8;
          return (
            <div key={i} style={{ width: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Pop at={at} style={{ width: 84, height: 84, borderRadius: 999, background: `${cols[i]}22`, border: `3px solid ${cols[i]}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DrawIcon Icon={icons[i]} at={at + 2} color={cols[i]} size={50} />
              </Pop>
              <Sfx name="pop" at={at} volume={0.35} />
              <WordReveal text={t} start={at + 3} stagger={3} align="center" style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: size.body, lineHeight: 1.12, color: colors.text }} />
            </div>
          );
        })}
      </div>
    </FormulaCard>
  );
};

const Cara: React.FC = () => {
  const b = CARDS_AT + 3 * CARD_LEN;
  const icons = [Ear, Megaphone, Handshake, BookOpen];
  return (
    <FormulaCard index={3} label={stepC.cara.label}>
      <div style={{ margin: "24px 0 22px" }}>
        <Formula at={b + 12} text={plain(stepC.cara.formula[0])} fontSize={84} style={{ whiteSpace: "nowrap" }} />
        <Formula at={b + 18} text={plain(stepC.cara.formula[1])} fontSize={84} style={{ whiteSpace: "nowrap" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {stepC.cara.items.map((t, i) => (
          <Item key={i} at={b + 32 + i * 10} Icon={icons[i]} text={t} />
        ))}
      </div>
    </FormulaCard>
  );
};

const Pengajaran: React.FC = () => {
  const b = CARDS_AT + 4 * CARD_LEN;
  const icons = [Crown, Brain, Flag];
  return (
    <FormulaCard index={4} label={stepC.pengajaran.label}>
      <Formula at={b + 12} text={stepC.pengajaran.formula} fontSize={200} style={{ margin: "18px 0 16px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {stepC.pengajaran.items.map((t, i) => (
          <Item key={i} at={b + 24 + i * 8} Icon={icons[i]} text={t} />
        ))}
      </div>
      <Pop at={b + 50} style={{ marginTop: 30, border: `3px dashed ${colors.highlight}AA`, borderRadius: 28, padding: "22px 26px", background: "rgba(250,204,21,0.06)" }}>
        <Sfx name="pop" at={b + 50} />
        <WordReveal text={stepC.pengajaran.template} start={b + 54} stagger={3} align="center" style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, lineHeight: 1.3, color: colors.text }} />
      </Pop>
    </FormulaCard>
  );
};

/* ---------- compact header shown during the cards ---------- */

const CompactHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - CARDS_AT + 4, fps, config: { damping: 16, stiffness: 150 } });
  return (
    <div style={{ position: "absolute", left: safe.left, width: safe.width, top: safe.top, height: 180, display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateY(${(1 - s) * -60}px)` }}>
      <div style={{ width: 150, height: 150, borderRadius: radius, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.headline, fontWeight: 900, fontSize: 120, color: colors.onAccent, boxShadow: `0 12px 30px ${c}66`, flexShrink: 0, lineHeight: 1 }}>
        <span style={{ transform: "translateY(0.05em)" }}>{stepC.letter}</span>
      </div>
      <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: size.minText, lineHeight: 1.04, color: colors.text }}>{stepC.headline}</div>
    </div>
  );
};

/* ---------- scene ---------- */

export const StepC: React.FC = () => {
  const frame = useCurrentFrame();
  const introOut = interpolate(frame, [CARDS_AT - 12, CARDS_AT - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bannerWiggle = frame > BANNER_AT + 30 ? Math.sin(frame / 5) * 1.2 : 0;
  return (
    <SceneShell tint={c} slams={[SLAM_AT + 2]}>
      {frame < CARDS_AT && (
        <div style={{ opacity: introOut, position: "absolute", inset: 0 }}>
          <StepHeader letter={stepC.letter} color={c} headline={stepC.headline} headlineSize={68} />
          <SafeBox top={1010}>
            <Pop at={BANNER_AT} style={{ width: "100%", transform: `rotate(${-2 + bannerWiggle}deg)` }}>
              <Sfx name="slam" at={BANNER_AT} volume={0.5} />
              <div style={{ background: c, borderRadius: radius, padding: "30px 36px", boxShadow: `0 24px 60px ${c}66`, border: `4px solid ${colors.white}` }}>
                <WordReveal text={stepC.banner} start={BANNER_AT + 4} stagger={3} align="center" darkText={colors.text} baseColor={colors.onAccent} style={{ fontFamily: fonts.headline, fontWeight: 900, fontSize: 66, lineHeight: 1.18, color: colors.onAccent }} />
              </div>
            </Pop>
          </SafeBox>
        </div>
      )}
      {frame >= CARDS_AT - 6 && <CompactHeader />}
      <Hikmah />
      <Kesan />
      <Punca />
      <Cara />
      <Pengajaran />
    </SceneShell>
  );
};

