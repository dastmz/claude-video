import React from "react";
import { getStaticFiles, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

/** Plays /public/sfx/<name>.mp3 at a frame. Renders nothing if the file is missing. */
const available = () => {
  try {
    return new Set(getStaticFiles().map((f) => f.name.replace(/^\/+/, "")));
  } catch {
    return new Set<string>();
  }
};
const files = available();
export const hasStatic = (path: string) => files.has(path);

export type SfxName = "whoosh" | "pop" | "slam" | "ding" | "type" | "scribble";

export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({ name, at, volume = 0.5 }) => {
  const path = `sfx/${name}.mp3`;
  if (!hasStatic(path)) return null;
  return (
    <Sequence from={Math.round(at)} durationInFrames={60} layout="none">
      <Audio src={staticFile(path)} volume={volume} />
    </Sequence>
  );
};
