import React from "react";
import { useCurrentFrame } from "remotion";
import { Lightbulb } from "lucide-react";
import { stepT } from "../content";
import { accent, colors, fonts, size } from "../theme";
import { prog } from "../components/anim";
import { SceneShell } from "../components/SceneShell";
import { HEADER_BOTTOM, SLAM_AT, StepHeader } from "../components/StepHeader";
import { WordReveal } from "../components/RichText";
import { Card, DrawIcon, Pop, SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const CARD_AT = 68;
const Q_AT = 74;
const MARKS_AT = 112;
const TIP_AT = 140;

export const StepT: React.FC = () => {
  const frame = useCurrentFrame();
  const c = accent.T;
  const mk = prog(frame, MARKS_AT + 8, 8);
  return (
    <SceneShell tint={c} slams={[SLAM_AT + 2]}>
      <StepHeader letter={stepT.letter} color={c} headline={stepT.headline} />
      <SafeBox top={HEADER_BOTTOM + 10}>
        <Pop at={CARD_AT} style={{ width: "100%" }}>
          <Sfx name="pop" at={CARD_AT} />
          <Card accentColor={c}>
            <WordReveal text={stepT.question} start={Q_AT} stagger={3} style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 60, lineHeight: 1.35, color: colors.text }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
              <Pop at={MARKS_AT}>
                <span style={{ position: "relative", display: "inline-block", fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, color: mk > 0.5 ? colors.text : colors.textSoft, padding: "4px 14px", zIndex: 0 }}>
                  <span style={{ position: "absolute", inset: 0, background: colors.highlight, borderRadius: 12, transform: `scaleX(${mk})`, transformOrigin: "left", zIndex: -1 }} />
                  {stepT.marks}
                </span>
              </Pop>
            </div>
          </Card>
        </Pop>
      </SafeBox>
      <SafeBox top={1255}>
        <Pop at={TIP_AT} style={{ width: "100%" }}>
          <Sfx name="pop" at={TIP_AT} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: `linear-gradient(90deg, ${c}, #B91C1C)`,
              borderRadius: 999,
              padding: "26px 40px",
              boxShadow: `0 20px 50px ${c}55`,
              transform: frame > TIP_AT + 40 ? `scale(${1 + 0.02 * Math.sin((frame - TIP_AT) / 6)})` : undefined,
            }}
          >
            <DrawIcon Icon={Lightbulb} at={TIP_AT + 4} color={colors.highlight} size={72} />
            <WordReveal text={stepT.tip} start={TIP_AT + 6} stagger={3} darkText={colors.text} baseColor={colors.onAccent} style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body, lineHeight: 1.2, color: colors.onAccent }} />
          </div>
        </Pop>
      </SafeBox>
    </SceneShell>
  );
};
