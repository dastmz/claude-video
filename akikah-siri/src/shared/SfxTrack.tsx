import React from "react";
import { Html5Audio, Sequence } from "remotion";
import { optionalFile } from "./assets";
import { sec } from "./theme";

export type SfxCue = {
  /** saat mutlak */
  at: number;
  /** nama fail dalam public/audio/sfx/ tanpa sambungan (.wav atau .mp3) */
  name: string;
  volume?: number;
  /** tempoh maksimum (saat); pilihan */
  duration?: number;
  loop?: boolean;
};

/** Mainkan senarai SFX; fail yang tiada diabaikan secara senyap. */
export const SfxTrack: React.FC<{ cues: SfxCue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => {
      const src = optionalFile(`audio/sfx/${c.name}.wav`) ?? optionalFile(`audio/sfx/${c.name}.mp3`);
      if (!src) return null;
      return (
        <Sequence key={i} from={sec(c.at)} durationInFrames={c.duration ? sec(c.duration) : undefined} name={`SFX ${c.name}`} layout="none">
          <Html5Audio src={src} volume={c.volume ?? 0.7} loop={c.loop} />
        </Sequence>
      );
    })}
  </>
);
