import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "./fonts";
import { COLORS, LAYOUT, SAFE, VIDEO } from "./theme";

export type Speaker = "AYAH" | "IBU" | "FAIZ" | "NARATOR" | "USTAZAH" | string;

export type Cue = {
  /** saat mula */
  start: number;
  /** saat tamat */
  end: number;
  speaker: Speaker;
  text: string;
};

export const SPEAKER_COLORS: Record<string, string> = {
  AYAH: "#8FB2FF",
  IBU: COLORS.tudungIbu,
  FAIZ: "#7EDC9C",
  NARATOR: COLORS.emas,
  USTAZAH: COLORS.tudungUstazah,
};

export const activeCue = (cues: Cue[], frame: number) => {
  const t = frame / VIDEO.fps;
  return cues.find((c) => t >= c.start && t < c.end) ?? null;
};

/** Adakah watak sedang bercakap pada frame (mutlak) ini? */
export const isTalking = (cues: Cue[], speaker: Speaker, frame: number) => {
  const c = activeCue(cues, frame);
  if (!c || c.speaker !== speaker) return false;
  // berhenti sekejap di hujung ayat supaya mulut tutup
  return frame / VIDEO.fps < c.end - 0.25;
};

/** Elak singkatan seperti "P-H-K-R" dipecah di hujung baris. */
const noBreakAcronyms = (text: string) =>
  text.split(/(\b[A-Z](?:-[A-Z])+\b)/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ whiteSpace: "nowrap" }}>
        {part}
      </span>
    ) : (
      part
    ),
  );

type Props = {
  cues: Cue[];
  showSpeaker?: boolean;
  fontSize?: number;
};

/**
 * Sari kata: putih, garis luar hitam 6 px, maks 2 baris, berpusat di y≈1250 dalam zon selamat.
 * Gunakan dalam komposisi pada aras teratas (frame mutlak).
 */
export const Subtitle: React.FC<Props> = ({ cues, showSpeaker = true, fontSize = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = activeCue(cues, frame);
  if (!cue) return null;
  const local = frame - Math.round(cue.start * fps);
  const pop = spring({ frame: local, fps, config: { damping: 14, stiffness: 180 }, durationInFrames: 12 });
  const outFrames = Math.round(cue.end * fps) - frame;
  const opacity = Math.min(interpolate(local, [0, 4], [0, 1], { extrapolateRight: "clamp" }), interpolate(outFrames, [0, 4], [0, 1], { extrapolateRight: "clamp" }));
  const lineH = fontSize * 1.22;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: LAYOUT.subtitleY - lineH, // blok 2 baris berpusat di 1250
          height: lineH * 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity,
          transform: `scale(${0.92 + 0.08 * pop})`,
        }}
      >
        {showSpeaker ? (
          <div
            style={{
              position: "absolute",
              top: -46,
              fontFamily: FONTS.tajuk,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 3,
              color: "#111",
              background: SPEAKER_COLORS[cue.speaker] ?? "#fff",
              padding: "4px 18px",
              borderRadius: 999,
              boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
            }}
          >
            {cue.speaker}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: FONTS.sariKata,
            fontWeight: 800,
            fontSize,
            lineHeight: `${lineH}px`,
            color: "#fff",
            textAlign: "center",
            WebkitTextStroke: "12px #000", // 12px dengan paint-order = 6 px di luar
            paintOrder: "stroke fill",
            maxHeight: lineH * 2,
            overflow: "hidden",
            textWrap: "balance",
          }}
        >
          {noBreakAcronyms(cue.text)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
