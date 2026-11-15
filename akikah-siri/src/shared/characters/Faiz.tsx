import React from "react";
import { COLORS } from "../theme";
import { Arm, CharacterProps, Face, INK, shade, useIdle } from "./common";

const SKIN = "#C2824F";
const POLO = COLORS.poloFaiz;

/** Faiz — rakan ayah, lelaki 30-an, kemeja-T berkolar hijau gelap. */
export const Faiz: React.FC<CharacterProps & { hand?: "buka" | "tunjuk" }> = ({
  expression = "senyum",
  talking = false,
  height = 900,
  armKanan = 4,
  armKiri = 4,
  flip,
  style,
  hand = "buka",
}) => {
  const { bob, tilt } = useIdle(3, talking);
  return (
    <svg viewBox="0 0 500 820" height={height} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <g transform={`translate(0 ${bob})`}>
        <path d="M 110 430 Q 250 390 390 430 Q 445 452 452 530 L 460 840 L 40 840 L 48 530 Q 55 452 110 430 Z" fill={POLO} />
        <rect x={220} y={320} width={60} height={90} rx={20} fill={shade(SKIN, -10)} />
        {/* kolar & plaket */}
        <path d="M 200 405 L 250 450 L 232 470 L 185 425 Z" fill={shade(POLO, -20)} />
        <path d="M 300 405 L 250 450 L 268 470 L 315 425 Z" fill={shade(POLO, -20)} />
        <rect x={240} y={450} width={20} height={80} fill={shade(POLO, 12)} />
        <circle cx={250} cy={472} r={5} fill="#E8E8E8" />
        <circle cx={250} cy={505} r={5} fill="#E8E8E8" />
        <Arm x={100} y={470} angle={armKanan} sleeve={POLO} skin={SKIN} hand={hand} length={240} width={66} />
        <Arm x={400} y={470} angle={-armKiri} sleeve={POLO} skin={SKIN} hand={hand} length={240} width={66} />
        <g transform={`translate(250 240) rotate(${tilt})`}>
          <Face
            expression={expression}
            talking={talking}
            seed={5}
            skin={SKIN}
            rx={96}
            ry={104}
            browWidth={10}
            blush={false}
            overlay={<path d="M -24 82 Q 0 100 24 82 Q 0 92 -24 82 Z" fill={INK} opacity={0.85} />}
          />
          {/* rambut pendek berjambul */}
          <path d="M -98 -10 Q -112 -110 -20 -128 Q 40 -150 80 -118 Q 112 -92 98 -10 Q 88 -70 40 -80 Q 10 -64 -40 -84 Q -84 -72 -98 -10 Z" fill={INK} />
          <path d="M -20 -128 Q 30 -170 70 -124" fill={INK} />
        </g>
      </g>
    </svg>
  );
};
