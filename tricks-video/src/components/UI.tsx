import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { LucideIcon } from "lucide-react";
import { colors, fonts, radius, safe, shadow, size } from "../theme";
import { penProg, popStyle } from "./anim";

/** Absolutely positioned column inside the safe zone. */
export const SafeBox: React.FC<{ top: number; bottom?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, bottom, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: safe.left,
      width: safe.width,
      top,
      ...(bottom !== undefined ? { height: bottom - top } : {}),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ style?: React.CSSProperties; accentColor?: string; children: React.ReactNode }> = ({ style, accentColor, children }) => (
  <div
    style={{
      width: "100%",
      borderRadius: radius,
      background: "linear-gradient(180deg, #1B2B5C 0%, #15224B 100%)",
      border: `2px solid ${accentColor ? accentColor + "66" : colors.cardBorder}`,
      boxShadow: shadow,
      padding: 40,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ color: string; children: React.ReactNode; style?: React.CSSProperties; textColor?: string }> = ({ color, children, style, textColor = colors.white }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      background: color,
      color: textColor,
      borderRadius: 999,
      padding: "14px 36px",
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: size.body,
      lineHeight: 1.15,
      boxShadow: shadow,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Pop-in wrapper with standard spring motion. */
export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; rise?: number }> = ({ at, children, style, rise }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div style={{ ...popStyle(frame, fps, at, undefined, rise), ...style }}>{children}</div>;
};

/** lucide icon drawn on via stroke-dashoffset (inherited by every path in the icon). */
export const DrawIcon: React.FC<{ Icon: LucideIcon; at: number; color: string; size?: number; dur?: number; strokeWidth?: number }> = ({ Icon, at, color, size: s = 64, dur = 16, strokeWidth = 2.4 }) => {
  const frame = useCurrentFrame();
  const p = penProg(frame, at, dur);
  const L = 90;
  return (
    <Icon
      size={s}
      color={color}
      strokeWidth={strokeWidth}
      style={{ strokeDasharray: L, strokeDashoffset: L * (1 - p), flexShrink: 0, opacity: p > 0 ? 1 : 0 }}
    />
  );
};

/** Horizontal arrow that draws on (shaft, then head) and then pulses. */
export const Arrow: React.FC<{ at: number; color: string; width?: number; height?: number; dir?: "right" | "down" }> = ({ at, color, width = 110, height = 60, dir = "right" }) => {
  const frame = useCurrentFrame();
  const shaft = penProg(frame, at, 9);
  const head = penProg(frame, at + 7, 6);
  const pulse = frame > at + 14 ? 1 + 0.08 * Math.sin((frame - at - 14) / 4) : 1;
  const glow = frame > at + 14 ? 0.5 + 0.5 * Math.sin((frame - at - 14) / 4) : 0;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 60"
      style={{ transform: `scale(${pulse}) rotate(${dir === "down" ? 90 : 0}deg)`, flexShrink: 0, overflow: "visible", filter: `drop-shadow(0 0 ${8 + glow * 10}px ${color})` }}
    >
      <path d="M6 30 C 30 26, 60 34, 96 30" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - shaft} />
      <path d="M74 10 L 100 30 L 74 50" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - head} />
    </svg>
  );
};

export const fadeOut = (frame: number, at: number, dur = 10) =>
  interpolate(frame, [at, at + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
