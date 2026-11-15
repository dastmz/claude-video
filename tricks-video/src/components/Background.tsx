import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

/** Absolute start frame of the current scene, so the background moves continuously across scenes. */
export const SceneOffset = createContext(0);
export const useGlobalFrame = () => useCurrentFrame() + useContext(SceneOffset);

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export const Background: React.FC<{ tint: string; speed?: number }> = ({ tint, speed = 1 }) => {
  const g = useGlobalFrame() * speed;
  const blobs = [
    { c: tint, x: 200 + Math.sin(g / 70) * 160, y: 420 + Math.cos(g / 90) * 140, r: 540, a: 0.20 },
    { c: "#3B82F6", x: 880 + Math.cos(g / 80) * 140, y: 1250 + Math.sin(g / 60) * 180, r: 600, a: 0.12 },
    { c: "#8B5CF6", x: 520 + Math.sin(g / 110) * 220, y: 1750 + Math.cos(g / 75) * 120, r: 480, a: 0.10 },
  ];
  const gridShift = (g * 0.6) % 90;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgDeep} 100%)`, overflow: "hidden" }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x - b.r,
            top: b.y - b.r,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${hexA(b.c, b.a)} 0%, ${hexA(b.c, 0)} 70%)`,
            filter: "blur(30px)",
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage:
            `linear-gradient(${colors.grid} 2px, transparent 2px), linear-gradient(90deg, ${colors.grid} 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `${gridShift}px ${gridShift * 0.5}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};
