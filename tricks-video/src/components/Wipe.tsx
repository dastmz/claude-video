import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type WipeProps = { color: string; dir: "left" | "right" };

/** Fast slide/wipe: a band of the next accent colour sweeps across, revealing the next scene. */
const WipeComp: React.FC<TransitionPresentationComponentProps<WipeProps>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const p = presentationProgress;
  const ease = 1 - Math.pow(1 - p, 3);
  const band = 32; // % of width
  // band left edge moves from 100% → -band%
  const lead = 100 - ease * (100 + band); // position of band's left edge (in % from left)
  const sign = passedProps.dir === "left" ? 1 : -1;
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ transform: `translateX(${-sign * ease * 8}%)` }}>{children}</AbsoluteFill>;
  }
  const revealFrom = lead + band; // entering scene visible to the right of the band (for dir left)
  const clip =
    passedProps.dir === "left"
      ? `inset(0 0 0 ${Math.max(0, revealFrom)}%)`
      : `inset(0 ${Math.max(0, revealFrom)}% 0 0)`;
  const bandStyle: React.CSSProperties =
    passedProps.dir === "left"
      ? { left: `${lead}%`, width: `${band}%` }
      : { right: `${lead}%`, width: `${band}%` };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>
        <AbsoluteFill style={{ transform: `translateX(${sign * (1 - ease) * 10}%)` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, background: passedProps.color, boxShadow: `0 0 80px ${passedProps.color}`, transform: "skewX(-8deg) scaleX(1.2)", ...bandStyle }} />
    </AbsoluteFill>
  );
};

export const colorWipe = (props: WipeProps): TransitionPresentation<WipeProps> => ({ component: WipeComp, props });
