import React from "react";
import { COLORS } from "../theme";
import { Arm, CharacterProps, Face, shade, useIdle } from "./common";

const SKIN = "#E3AE85";
const TUDUNG = COLORS.tudungIbu;
const BAJU = COLORS.krim;

/** Puan Aisyah — wanita Melayu ~28 tahun, tudung merah jambu pastel, baju kurung krim. */
export const Ibu: React.FC<CharacterProps & { hand?: "buka" | "tunjuk" }> = ({
  expression = "senyum",
  talking = false,
  height = 900,
  armKanan = 4,
  armKiri = 4,
  flip,
  style,
  hand = "buka",
}) => {
  const { bob, tilt } = useIdle(2, talking);
  return (
    <svg viewBox="0 0 500 820" height={height} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <g transform={`translate(0 ${bob})`}>
        {/* baju kurung */}
        <path d="M 120 440 Q 250 400 380 440 Q 430 460 440 540 L 450 840 L 50 840 L 60 540 Q 70 460 120 440 Z" fill={BAJU} stroke={shade(BAJU, -25)} strokeWidth={4} />
        {/* lengan */}
        {armKanan <= 60 ? <Arm x={110} y={480} angle={armKanan} sleeve={shade(BAJU, -8)} skin={SKIN} hand={hand} /> : null}
        {armKiri <= 60 ? <Arm x={390} y={480} angle={-armKiri} sleeve={shade(BAJU, -8)} skin={SKIN} hand={hand} /> : null}
        <g transform={`translate(250 245) rotate(${tilt})`}>
          {/* tudung belakang */}
          <path d="M 0 -150 C -150 -150 -140 0 -135 70 C -130 140 -170 190 -175 280 L 175 280 C 170 190 130 140 135 70 C 140 0 150 -150 0 -150 Z" fill={TUDUNG} />
          <ellipse cx={0} cy={0} rx={96} ry={112} fill={shade(TUDUNG, -22)} />
          <Face expression={expression} talking={talking} seed={2} skin={SKIN} rx={84} ry={100} lashes lipColor="#A23E55" showEars={false} />
          {/* bingkai tudung di dahi */}
          <path d="M -88 -40 Q -80 -118 0 -120 Q 80 -118 88 -40 Q 70 -96 0 -98 Q -70 -96 -88 -40 Z" fill={TUDUNG} />
          {/* labuh depan */}
          <path d="M -100 70 Q 0 150 100 70 L 160 280 Q 0 320 -160 280 Z" fill={TUDUNG} />
          <path d="M -60 140 Q 0 190 60 140" stroke={shade(TUDUNG, -25)} strokeWidth={4} fill="none" />
          <path d="M -110 200 Q 0 250 110 200" stroke={shade(TUDUNG, -25)} strokeWidth={4} fill="none" />
          <circle cx={0} cy={112} r={9} fill={COLORS.emas} />
        </g>
        {/* lengan diangkat (menunjuk) dilukis di hadapan tudung */}
        {armKanan > 60 ? <Arm x={110} y={480} angle={armKanan} sleeve={shade(BAJU, -8)} skin={SKIN} hand={hand} /> : null}
        {armKiri > 60 ? <Arm x={390} y={480} angle={-armKiri} sleeve={shade(BAJU, -8)} skin={SKIN} hand={hand} /> : null}
      </g>
    </svg>
  );
};
