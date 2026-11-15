import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { shakeOffset } from "./anim";

/** Every scene: animated background + camera shake on slam frames. */
export const SceneShell: React.FC<{ tint: string; slams?: number[]; bgSpeed?: number; children: React.ReactNode }> = ({ tint, slams = [], bgSpeed, children }) => {
  const frame = useCurrentFrame();
  const { x, y } = shakeOffset(frame, slams);
  return (
    <AbsoluteFill>
      <Background tint={tint} speed={bgSpeed} />
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
