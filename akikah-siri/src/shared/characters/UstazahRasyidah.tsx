import React from "react";
import { COLORS } from "../theme";
import { Arm, CharacterProps, Face, shade, useIdle } from "./common";

const SKIN = "#DDA47C";
const TUDUNG = COLORS.tudungUstazah;
const BLAZER = COLORS.blazerUstazah;

/** Ustazah Rasyidah — wanita 30-an, tudung labuh biru muda, blazer kelabu (Episod 2 & 3). */
export const UstazahRasyidah: React.FC<CharacterProps & { hand?: "buka" | "tunjuk" }> = ({
  expression = "senyum",
  talking = false,
  height = 900,
  armKanan = 4,
  armKiri = 4,
  flip,
  style,
  hand = "buka",
}) => {
  const { bob, tilt } = useIdle(4, talking);
  return (
    <svg viewBox="0 0 500 820" height={height} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <g transform={`translate(0 ${bob})`}>
        {/* blazer */}
        <path d="M 115 440 Q 250 400 385 440 Q 438 460 446 540 L 456 840 L 44 840 L 54 540 Q 62 460 115 440 Z" fill={BLAZER} />
        <path d="M 150 600 L 200 840 M 350 600 L 300 840" stroke={shade(BLAZER, -25)} strokeWidth={6} />
        <Arm x={105} y={480} angle={armKanan} sleeve={BLAZER} skin={SKIN} hand={hand} />
        <Arm x={395} y={480} angle={-armKiri} sleeve={BLAZER} skin={SKIN} hand={hand} />
        <g transform={`translate(250 245) rotate(${tilt})`}>
          <ellipse cx={0} cy={0} rx={98} ry={114} fill={shade(TUDUNG, -24)} />
          <path d="M 0 -150 C -150 -150 -140 0 -135 70 C -130 140 -150 200 -150 250 L 150 250 C 150 200 130 140 135 70 C 140 0 150 -150 0 -150 Z" fill={TUDUNG} />
          <ellipse cx={0} cy={0} rx={94} ry={110} fill={shade(TUDUNG, -24)} />
          <Face expression={expression} talking={talking} seed={7} skin={SKIN} rx={82} ry={98} lashes lipColor="#9B3E4C" showEars={false} />
          <path d="M -86 -40 Q -78 -116 0 -118 Q 78 -116 86 -40 Q 68 -94 0 -96 Q -68 -94 -86 -40 Z" fill={TUDUNG} />
          {/* tudung labuh hingga ke pinggang */}
          <path d="M -96 70 Q 0 150 96 70 L 150 330 Q 0 380 -150 330 Z" fill={TUDUNG} />
          <path d="M -70 160 Q 0 210 70 160" stroke={shade(TUDUNG, -22)} strokeWidth={4} fill="none" />
          <path d="M -110 260 Q 0 310 110 260" stroke={shade(TUDUNG, -22)} strokeWidth={4} fill="none" />
        </g>
      </g>
    </svg>
  );
};
