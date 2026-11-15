import React from "react";
import { interpolateColors } from "remotion";
import { colors } from "../theme";
import { approxEm, wobblyEllipse, wobblyLine } from "./anim";

export type MarkType = "none" | "hl" | "ul" | "circle";

/** Wraps text with a yellow marker / red underline / red circle, driven by progress 0..1. */
export const Marked: React.FC<{
  mark: MarkType;
  p: number;
  seed: string;
  extendRight?: string;
  darkText?: string;
  baseColor?: string;
  children: React.ReactNode;
}> = ({ mark, p, seed, extendRight = "0em", darkText = colors.bg, baseColor = colors.white, children }) => {
  if (mark === "none") return <>{children}</>;
  const textLen = typeof children === "string" ? approxEm(children) : 3;
  if (mark === "hl") {
    return (
      <span style={{ position: "relative", display: "inline-block", zIndex: 0 }}>
        <span
          style={{
            position: "absolute",
            left: "-0.05em",
            right: `calc(-0.05em - ${extendRight})`,
            top: "0.08em",
            bottom: "0.02em",
            background: colors.highlight,
            borderRadius: "0.18em",
            transform: `scaleX(${p}) skewX(-6deg)`,
            transformOrigin: "left center",
            zIndex: -1,
          }}
        />
        <span style={{ color: p > 0 ? interpolateColors(p, [0, 0.6], [baseColor, darkText]) : undefined }}>
          {children}
        </span>
      </span>
    );
  }
  if (mark === "ul") {
    const uw = Math.round(((textLen + 0.1) / 0.42) * 20);
    return (
      <span style={{ position: "relative", display: "inline-block" }}>
        {children}
        <svg
          viewBox={`0 0 ${uw} 20`}
          preserveAspectRatio="none"
          style={{ position: "absolute", left: "-0.05em", right: `calc(-0.05em - ${extendRight})`, width: `calc(100% + 0.1em + ${extendRight})`, bottom: "-0.32em", height: "0.42em", overflow: "visible" }}
        >
          <path
            d={wobblyLine(seed, uw, 20)}
            pathLength={1}
            fill="none"
            stroke={colors.pen}
            strokeWidth={5.4}
            strokeLinecap="round"
            strokeDasharray="1 1"
            strokeDashoffset={1 - p}
          />
        </svg>
      </span>
    );
  }
  // circle
  const cw = Math.round(((textLen + 0.64) / 1.8) * 100);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <svg
        viewBox={`0 0 ${cw} 100`}
        preserveAspectRatio="none"
        style={{ position: "absolute", left: "-0.32em", top: "-0.3em", width: "calc(100% + 0.64em)", height: "calc(100% + 0.6em)", overflow: "visible" }}
      >
        <path
          d={wobblyEllipse(seed, cw, 100)}
          pathLength={1}
          fill="none"
          stroke={colors.pen}
          strokeWidth={5.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
        />
      </svg>
    </span>
  );
};
