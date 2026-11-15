import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, motion } from "../theme";
import { popStyle, penProg, prog } from "./anim";
import { Marked, MarkType } from "./Marks";

type Seg = { text: string; mark: MarkType; group: number };
type Word = { segs: Seg[] };

const OPEN: Record<string, MarkType> = { "[": "hl", "{": "ul", "|": "circle" };
const CLOSE: Record<string, MarkType> = { "]": "hl", "}": "ul" };

/** Parse inline markup: [hl] {underline} |circle| */
export const parseMarkup = (raw: string): Seg[] => {
  const src = raw.replace(/~/g, "\u00a0");
  const segs: Seg[] = [];
  let mark: MarkType = "none";
  let group = -1;
  let groups = 0;
  let buf = "";
  const flush = () => {
    if (buf) segs.push({ text: buf, mark, group: mark === "none" ? -1 : group });
    buf = "";
  };
  for (const ch of src) {
    if (mark === "none" && OPEN[ch]) {
      flush();
      mark = OPEN[ch];
      group = groups++;
    } else if ((mark !== "none" && CLOSE[ch] === mark) || (mark === "circle" && ch === "|")) {
      flush();
      mark = "none";
    } else buf += ch;
  }
  flush();
  return segs;
};

/** Plain text with ~ turned into non-breaking spaces. */
export const plain = (s: string) => s.replace(/~/g, "\u00a0");

export const stripMarkup = (src: string) => parseMarkup(src).map((s) => s.text).join("");

/** Split segments into words (on spaces) keeping marks. */
const toWords = (segs: Seg[]): Word[] => {
  const words: Word[] = [{ segs: [] }];
  for (const seg of segs) {
    const parts = seg.text.split(" ");
    parts.forEach((part, i) => {
      if (i > 0) words.push({ segs: [] });
      if (part) words[words.length - 1].segs.push({ ...seg, text: part });
    });
  }
  return words.filter((w) => w.segs.length > 0);
};

const markDur = (m: MarkType) => (m === "hl" ? motion.markerFrames : m === "ul" ? 16 : 14);

/**
 * Kinetic text: words enter one-by-one (spring scale + rise + blur),
 * then marks (highlight/underline/circle) draw after the words land.
 */
export const WordReveal: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
  gap?: number; // em
  darkText?: string;
  baseColor?: string;
  wordStyle?: (i: number) => React.CSSProperties;
  springCfg?: { damping: number; stiffness: number; mass: number };
}> = ({ text, start, stagger = motion.wordStagger, style, align = "left", gap = 0.26, darkText, baseColor, wordStyle, springCfg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = toWords(parseMarkup(text));

  // when does each mark group start? after the LAST word of that group has landed
  const groupWords: Record<number, number[]> = {};
  words.forEach((w, i) =>
    w.segs.forEach((s) => {
      if (s.group >= 0) (groupWords[s.group] ??= []).includes(i) || groupWords[s.group].push(i);
    }),
  );
  const LAND = 10;

  return (
    <div style={{ textAlign: align, ...style }}>
      {words.map((w, i) => {
        const at = start + i * stagger;
        return (
          <span
            key={i}
            style={{ display: "inline-block", marginRight: i < words.length - 1 ? `${gap}em` : 0, ...popStyle(frame, fps, at, springCfg), ...wordStyle?.(i) }}
          >
            {w.segs.map((s, j) => {
              if (s.mark === "none") return <React.Fragment key={j}>{s.text}</React.Fragment>;
              const gw = groupWords[s.group];
              const k = gw.indexOf(i);
              const gStart = start + gw[gw.length - 1] * stagger + LAND;
              const d = markDur(s.mark);
              const slice = d / gw.length;
              const p = s.mark === "hl" ? prog(frame, gStart + k * slice, slice) : penProg(frame, gStart + k * slice, slice);
              const continues = k < gw.length - 1 && j === w.segs.length - 1;
              return (
                <Marked key={j} mark={s.mark} p={p} seed={`${text}-${i}-${j}`} extendRight={continues ? `${gap}em` : "0em"} darkText={darkText} baseColor={baseColor}>
                  {s.text}
                </Marked>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Hand-writing / typewriter effect over several markup lines.
 * Marks draw once their span is fully written.
 * Returns the frame at which writing finishes via `endFrame()` helper below.
 */
export const typeEnd = (lines: string[], start: number, cps: number, linePause: number) => {
  let t = start;
  for (const l of lines) t += stripMarkup(l).length / cps + linePause;
  return t;
};

export const TypeLines: React.FC<{
  lines: string[];
  start: number;
  cps?: number; // chars per frame
  linePause?: number;
  lineStyle?: React.CSSProperties;
  caretColor?: string;
  darkText?: string;
  baseColor?: string;
}> = ({ lines, start, cps = 1.6, linePause = 6, lineStyle, caretColor = colors.white, darkText, baseColor }) => {
  const frame = useCurrentFrame();
  const starts: number[] = [];
  {
    let tt = start;
    for (const l of lines) {
      starts.push(tt);
      tt += stripMarkup(l).length / cps + linePause;
    }
  }
  let caretLine = -1;
  starts.forEach((st, i) => {
    if (frame >= st) caretLine = i;
  });
  return (
    <>
      {lines.map((line, li) => {
        const segs = parseMarkup(line);
        const lineStart = starts[li];
        const visible = Math.max(0, Math.floor((frame - lineStart) * cps));
        let used = 0;
        const showCaret = li === caretLine;
        return (
          <div key={li} style={{ ...lineStyle, minHeight: lineStyle?.lineHeight ? undefined : "1.2em" }}>
            {segs.map((s, j) => {
              const segStartChar = used;
              used += s.text.length;
              const n = Math.max(0, Math.min(s.text.length, visible - segStartChar));
              if (n <= 0) return null;
              const shown = s.text.slice(0, n);
              if (s.mark === "none") return <React.Fragment key={j}>{shown}</React.Fragment>;
              const doneAt = lineStart + (segStartChar + s.text.length) / cps + 2;
              const p = s.mark === "hl" ? prog(frame, doneAt, motion.markerFrames) : penProg(frame, doneAt, 14);
              return (
                <Marked key={j} mark={s.mark} p={p} seed={`${line}-${j}`} darkText={darkText} baseColor={baseColor}>
                  {shown}
                </Marked>
              );
            })}
            {showCaret && (
              <span style={{ display: "inline-block", width: "0.08em", height: "0.95em", marginLeft: "0.04em", background: caretColor, verticalAlign: "-0.12em", opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.15 }} />
            )}
          </div>
        );
      })}
    </>
  );
};
