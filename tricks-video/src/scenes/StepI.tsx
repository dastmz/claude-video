import React from "react";
import { stepI } from "../content";
import { accent, colors, fonts, radius, shadow, size } from "../theme";
import { SceneShell } from "../components/SceneShell";
import { HEADER_BOTTOM, SLAM_AT, StepHeader } from "../components/StepHeader";
import { typeEnd, TypeLines, WordReveal } from "../components/RichText";
import { Pop, SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const SHEET_AT = 64;
const WRITE_AT = 74;
const CPS = 1.9;
const PAUSE = 5;
const LINE_H = 76;

export const StepI: React.FC = () => {
  const c = accent.I;
  const tipAt = Math.round(typeEnd(stepI.lines, WRITE_AT, CPS, PAUSE)) + 4;
  const rows = 5;
  return (
    <SceneShell tint={c} slams={[SLAM_AT + 2]}>
      <StepHeader letter={stepI.letter} color={c} headline={stepI.headline} />
      <SafeBox top={HEADER_BOTTOM}>
        <Pop at={SHEET_AT} style={{ width: "100%" }}>
          <Sfx name="pop" at={SHEET_AT} />
          <div
            style={{
              position: "relative",
              background: colors.paper,
              borderRadius: radius,
              boxShadow: shadow,
              padding: "34px 34px 30px 92px",
              height: rows * LINE_H + 64,
              boxSizing: "border-box",
              overflow: "hidden",
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent ${LINE_H - 3}px, #BFD3F2 ${LINE_H - 3}px, #BFD3F2 ${LINE_H}px)`,
              backgroundPosition: "0 30px",
            }}
          >
            <div style={{ position: "absolute", left: 64, top: 0, bottom: 0, width: 4, background: "#F87171" }} />
            <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: size.body, lineHeight: `${LINE_H}px`, color: colors.ink }}>
              <TypeLines lines={stepI.lines} start={WRITE_AT} cps={CPS} linePause={PAUSE} caretColor={c} darkText={colors.ink} baseColor={colors.ink} lineStyle={{ lineHeight: `${LINE_H}px` }} />
            </div>
          </div>
        </Pop>
      </SafeBox>
      <SafeBox top={1268}>
        <Pop at={tipAt} style={{ width: "100%" }}>
          <Sfx name="ding" at={tipAt} />
          <div style={{ background: `linear-gradient(90deg, ${c}, #15803D)`, borderRadius: 999, padding: "24px 44px", boxShadow: `0 20px 50px ${c}55` }}>
            <WordReveal text={stepI.tip} start={tipAt + 4} stagger={3} align="center" style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, lineHeight: 1.2, color: colors.white }} />
          </div>
        </Pop>
      </SafeBox>
    </SceneShell>
  );
};
