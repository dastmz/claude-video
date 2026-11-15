import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { title } from "../content";
import { accent, colors, fonts, Letter, safe } from "../theme";
import { SceneShell } from "../components/SceneShell";
import { WordReveal } from "../components/RichText";
import { SafeBox } from "../components/UI";
import { Sfx } from "../components/Sfx";

const SMALL_AT = 6;
const LETTERS_AT = 18;
const SUB_AT = 50;

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = title.word.split("");
  const rows = [letters.slice(0, 3), letters.slice(3)];

  return (
    <SceneShell tint={colors.highlight} slams={[LETTERS_AT + 15]}>
      <SafeBox top={safe.top + 40}>
        <WordReveal
          text={title.small}
          start={SMALL_AT}
          align="center"
          style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 64, letterSpacing: "0.14em", color: colors.secondary }}
        />
        <div style={{ marginTop: 10 }}>
          {rows.map((row, r) => (
            <div key={r} style={{ display: "flex", justifyContent: "center", gap: 6, height: 300 }}>
              {row.map((ch, c) => {
                const i = r * 3 + c;
                const at = LETTERS_AT + i * 3;
                const s = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 240, mass: 0.7 } });
                const wave = frame > at + 20 ? Math.sin((frame - at) / 9) * 10 : 0;
                const col = accent[ch as Letter];
                return (
                  <span
                    key={c}
                    style={{
                      display: "inline-block",
                      fontFamily: fonts.headline,
                      fontWeight: 900,
                      fontSize: 320,
                      lineHeight: 1,
                      color: col,
                      opacity: frame >= at ? 1 : 0,
                      transform: `translateY(${wave}px) scale(${s}) rotate(${(1 - s) * (i % 2 ? 14 : -14)}deg)`,
                      textShadow: `0 16px 0 rgba(0,0,0,0.3), 0 0 60px ${col}88`,
                    }}
                  >
                    {ch}
                    <Sfx name="pop" at={at} volume={0.4} />
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </SafeBox>
      <SafeBox top={1120}>
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "2px solid rgba(255,255,255,0.14)",
            borderRadius: 32,
            padding: "28px 40px",
            width: "100%",
            boxSizing: "border-box",
            opacity: frame >= SUB_AT - 4 ? 1 : 0,
          }}
        >
          <WordReveal
            text={title.subtitle}
            start={SUB_AT}
            stagger={3}
            align="center"
            style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 60, lineHeight: 1.22, color: colors.white }}
          />
        </div>
      </SafeBox>
    </SceneShell>
  );
};
