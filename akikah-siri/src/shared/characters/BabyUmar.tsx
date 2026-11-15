import React from "react";
import { COLORS } from "../theme";
import { CharacterProps, INK, useBlink, useMouthOpen } from "./common";

const SKIN = "#F1C7A3";

/** Kumpulan SVG Baby Umar (berpusat 0,0, ~300x220) — boleh diletak dalam pelukan watak lain. */
export const BabyUmarGroup: React.FC<Pick<CharacterProps, "expression" | "talking">> = ({
  expression = "senyum",
  talking = false,
}) => {
  const blink = useBlink(3);
  const open = useMouthOpen(talking, 4);
  const sleepy = expression === "lega";
  return (
    <g>
      {/* bedung */}
      <ellipse cx={20} cy={18} rx={135} ry={72} fill={COLORS.krim} stroke="#D9C2A4" strokeWidth={5} transform="rotate(-12 20 18)" />
      <path d="M -40 -20 Q 40 30 140 -10" stroke="#E3CDB0" strokeWidth={5} fill="none" />
      <path d="M -20 40 Q 60 60 130 30" stroke="#E3CDB0" strokeWidth={5} fill="none" />
      {/* hud bedung belakang kepala */}
      <circle cx={-78} cy={-16} r={66} fill={COLORS.krim} stroke="#D9C2A4" strokeWidth={5} />
      {/* muka */}
      <circle cx={-74} cy={-10} r={48} fill={SKIN} />
      <ellipse cx={-100} cy={4} rx={9} ry={6} fill="#F28C8C" opacity={0.45} />
      <ellipse cx={-48} cy={4} rx={9} ry={6} fill="#F28C8C" opacity={0.45} />
      {[-92, -56].map((ex) =>
        sleepy || blink < 0.5 ? (
          <path key={ex} d={`M ${ex - 7} -14 Q ${ex} -8 ${ex + 7} -14`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : (
          <g key={ex}>
            <ellipse cx={ex} cy={-14} rx={6} ry={expression === "terkejut" ? 9 : 7} fill={INK} />
            <circle cx={ex + 2} cy={-17} r={2} fill="#fff" />
          </g>
        ),
      )}
      {expression === "risau" ? (
        <path d="M -84 18 Q -74 10 -64 18" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : expression === "terkejut" || talking ? (
        <ellipse cx={-74} cy={16} rx={6} ry={4 + 5 * (talking ? open : 1)} fill="#8A2F34" />
      ) : (
        <path d="M -84 12 Q -74 22 -64 12" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
      {/* tepi bedung di dahi */}
      <path d="M -126 -30 Q -74 -70 -24 -30" stroke={COLORS.krim} strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const BabyUmar: React.FC<CharacterProps> = ({ height = 260, flip, style, ...rest }) => (
  <svg viewBox="-160 -110 320 220" height={height} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
    <BabyUmarGroup {...rest} />
  </svg>
);
