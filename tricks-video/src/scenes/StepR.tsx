import React from "react";
import { useCurrentFrame } from "remotion";
import { stepR } from "../content";
import { accent, colors, fonts, size } from "../theme";
import { penProg, wobblyEllipse } from "../components/anim";
import { SceneShell } from "../components/SceneShell";
import { HEADER_BOTTOM, SLAM_AT, StepHeader } from "../components/StepHeader";
import { Arrow, Card, Pop, SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const ROW_AT = [70, 118];

const PenCircle: React.FC<{ at: number; seed: string; children: React.ReactNode }> = ({ at, seed, children }) => {
  const frame = useCurrentFrame();
  const p = penProg(frame, at, 14);
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "10px 18px" }}>
      {children}
      <svg viewBox="0 0 380 110" preserveAspectRatio="none" style={{ position: "absolute", left: -10, top: -8, width: "calc(100% + 20px)", height: "calc(100% + 16px)", overflow: "visible" }}>
        <path d={wobblyEllipse(seed, 380, 110)} pathLength={1} fill="none" stroke={colors.pen} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      </svg>
    </span>
  );
};

export const StepR: React.FC = () => {
  const c = accent.R;
  return (
    <SceneShell tint={c} slams={[SLAM_AT + 2]}>
      <StepHeader letter={stepR.letter} color={c} headline={stepR.headline} />
      <SafeBox top={HEADER_BOTTOM + 20} style={{ gap: 44 }}>
        {stepR.rows.map((row, i) => {
          const at = ROW_AT[i];
          return (
            <Pop key={i} at={at} style={{ width: "100%" }}>
              <Sfx name="pop" at={at} />
              <Sfx name="pop" at={at + 32} volume={0.4} />
              <Card accentColor={c} style={{ display: "flex", alignItems: "center", gap: 18, padding: "44px 36px", minHeight: 230 }}>
                <PenCircle at={at + 10} seed={`r${i}`}>
                  <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, color: colors.text, whiteSpace: "nowrap" }}>{row.marks}</span>
                </PenCircle>
                <Arrow at={at + 22} color={c} width={100} />
                <Pop at={at + 32} style={{ flex: 1 }}>
                  <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: c }}>{row.result}</div>
                </Pop>
              </Card>
            </Pop>
          );
        })}
      </SafeBox>
    </SceneShell>
  );
};
