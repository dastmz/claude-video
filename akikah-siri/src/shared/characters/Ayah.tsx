import React from "react";
import { COLORS } from "../theme";
import { BabyUmarGroup } from "./BabyUmar";
import { Arm, CharacterProps, Face, INK, shade, useIdle } from "./common";

const SKIN = "#D69A6C";
const BAJU = COLORS.bajuAyah;

export type AyahProps = CharacterProps & {
  songkok?: boolean;
  /** Dukung Baby Umar. */
  dukungBaby?: boolean;
  babyExpression?: CharacterProps["expression"];
};

/** Encik Hakim — lelaki Melayu ~30 tahun, baju Melayu biru navy, songkok, misai nipis. */
export const Ayah: React.FC<AyahProps> = ({
  expression = "senyum",
  talking = false,
  height = 900,
  armKanan = 4,
  armKiri = 4,
  flip,
  style,
  songkok = true,
  dukungBaby = false,
  babyExpression = "senyum",
}) => {
  const { bob, tilt } = useIdle(1, talking);
  return (
    <svg viewBox="0 0 500 820" height={height} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <g transform={`translate(0 ${bob})`}>
        {/* badan */}
        <path d="M 120 430 Q 250 385 380 430 Q 432 452 442 530 L 452 840 L 48 840 L 58 530 Q 68 452 120 430 Z" fill={BAJU} />
        <path d="M 250 430 L 250 840" stroke={shade(BAJU, -18)} strokeWidth={4} />
        {/* leher & kolar cekak musang */}
        <rect x={218} y={320} width={64} height={90} rx={20} fill={shade(SKIN, -10)} />
        <path d="M 205 402 Q 250 430 295 402 L 292 440 Q 250 460 208 440 Z" fill={shade(BAJU, -22)} />
        {[470, 515, 560].map((cy) => (
          <circle key={cy} cx={250} cy={cy} r={8} fill={COLORS.emas} />
        ))}
        {/* lengan */}
        {dukungBaby ? (
          <>
            <Arm x={110} y={470} angle={-35} length={140} sleeve={BAJU} skin={SKIN} />
            <Arm x={390} y={470} angle={35} length={140} sleeve={BAJU} skin={SKIN} />
            <g transform="translate(262 585) scale(0.85)">
              <BabyUmarGroup expression={babyExpression} />
            </g>
            <ellipse cx={180} cy={612} rx={30} ry={24} fill={SKIN} />
            <ellipse cx={340} cy={585} rx={30} ry={24} fill={SKIN} />
            
          </>
        ) : (
          <>
            <Arm x={108} y={470} angle={armKanan} sleeve={BAJU} skin={SKIN} />
            <Arm x={392} y={470} angle={-armKiri} sleeve={BAJU} skin={SKIN} />
          </>
        )}
        {/* kepala */}
        <g transform={`translate(250 240) rotate(${tilt})`}>
          <Face
            expression={expression}
            talking={talking}
            seed={1}
            skin={SKIN}
            overlay={
              <path
                d="M -32 32 Q -16 22 0 29 Q 16 22 32 32 Q 16 31 0 35 Q -16 31 -32 32 Z"
                fill={INK}
              />
            }
          />
          {/* rambut tepi */}
          <path d="M -94 -10 Q -98 -80 -60 -96 L -60 -70 Q -82 -50 -86 0 Z" fill={INK} />
          <path d="M 94 -10 Q 98 -80 60 -96 L 60 -70 Q 82 -50 86 0 Z" fill={INK} />
          {songkok ? (
            <g>
              <path d="M -98 -52 L -92 -138 Q 0 -160 92 -138 L 98 -52 Q 0 -70 -98 -52 Z" fill="#141414" />
              <path d="M -97 -66 Q 0 -84 97 -66" stroke="#2E2E2E" strokeWidth={6} fill="none" />
              <path d="M -90 -132 Q 0 -150 90 -132" stroke="#3A3A3A" strokeWidth={4} fill="none" />
            </g>
          ) : (
            <path d="M -96 -20 Q -100 -120 0 -122 Q 100 -120 96 -20 Q 80 -88 0 -80 Q -80 -88 -96 -20 Z" fill={INK} />
          )}
        </g>
      </g>
    </svg>
  );
};
