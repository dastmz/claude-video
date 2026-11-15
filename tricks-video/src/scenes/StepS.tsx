import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Check } from "lucide-react";
import { stepS } from "../content";
import { accent, colors, fonts, motion, radius, safe, shadow, size } from "../theme";
import { SceneShell } from "../components/SceneShell";
import { HEADER_BOTTOM, SLAM_AT, StepHeader } from "../components/StepHeader";
import { DrawIcon } from "../components/UI";
import { plain } from "../components/RichText";
import { Sfx } from "../components/Sfx";

const c = accent.S;
const ROW_AT = [66, 100, 134];

export const StepS: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breathe = 0.5 + 0.5 * Math.sin(frame / 22);
  return (
    <SceneShell tint={c} slams={[SLAM_AT + 2]} bgSpeed={0.45}>
      {/* soft glow */}
      <div style={{ position: "absolute", left: 540 - 520, top: 1120 - 520, width: 1040, height: 1040, borderRadius: "50%", background: `radial-gradient(circle, ${c}${Math.round(30 + breathe * 30).toString(16)} 0%, transparent 65%)`, filter: "blur(20px)" }} />
      <StepHeader letter={stepS.letter} color={c} headline={stepS.headline} />
      <div style={{ position: "absolute", left: safe.left, width: safe.width, top: HEADER_BOTTOM + 20, display: "flex", flexDirection: "column", gap: 34 }}>
        {stepS.checklist.map((t, i) => {
          const at = ROW_AT[i];
          const s = spring({ frame: frame - at, fps, config: motion.calm });
          const tick = spring({ frame: frame - at - 18, fps, config: { damping: 20, stiffness: 120 } });
          const last = i === stepS.checklist.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "30px 34px",
                borderRadius: radius,
                background: last ? `linear-gradient(90deg, ${c}30, ${colors.surface})` : colors.surface,
                border: `3px solid ${last ? c : colors.surfaceBorder}`,
                boxShadow: last ? `0 0 ${30 + breathe * 40}px ${c}55` : shadow,
                opacity: s,
                transform: `translateY(${(1 - s) * 50}px)`,
                filter: `blur(${(1 - s) * 8}px)`,
              }}
            >
              <Sfx name="ding" at={at + 18} volume={0.35} />
              <div style={{ width: 92, height: 92, borderRadius: 26, flexShrink: 0, border: `4px solid ${c}`, background: tick > 0.05 ? c : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.85 + 0.15 * tick})`, boxShadow: tick > 0.5 ? `0 0 30px ${c}` : undefined }}>
                <DrawIcon Icon={Check} at={at + 18} dur={22} color={colors.onAccent} size={66} strokeWidth={3.4} />
              </div>
              <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body + 4, lineHeight: 1.15, color: colors.text }}>{plain(t)}</div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};
