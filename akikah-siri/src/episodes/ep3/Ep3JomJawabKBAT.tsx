import React from "react";
import { AbsoluteFill, Html5Audio, Sequence } from "remotion";
import { optionalFile } from "../../shared/assets";
import { SafeZoneGuide } from "../../shared/SafeZoneGuide";
import { SfxTrack } from "../../shared/SfxTrack";
import { Subtitle } from "../../shared/Subtitle";
import { COLORS } from "../../shared/theme";
import { Watermark } from "../../shared/Watermark";
import { Babak1, Babak2, Babak3, Babak4, Babak5, Babak6, Babak7 } from "./scenes";
import { babakFrames, CUES, SFX } from "./script";

export type Ep3Props = { showSafeZone: boolean; voiceFile: string };

const SCENES = [
  { key: "b1", name: "Babak 1 – Soalan KBAT", C: Babak1 },
  { key: "b2", name: "Babak 2 – Pengenalan P-H-K-R", C: Babak2 },
  { key: "b3", name: "Babak 3 – P Pendirian", C: Babak3 },
  { key: "b4", name: "Babak 4 – H Hujah", C: Babak4 },
  { key: "b5", name: "Babak 5 – K Kaitan dalil", C: Babak5 },
  { key: "b6", name: "Babak 6 – R Rumusan", C: Babak6 },
  { key: "b7", name: "Babak 7 – Penutup", C: Babak7 },
] as const;

export const Ep3JomJawabKBAT: React.FC<Ep3Props> = ({ showSafeZone, voiceFile }) => {
  const audio = optionalFile(voiceFile);
  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      {SCENES.map(({ key, name, C }) => {
        const { from, duration } = babakFrames(key);
        return (
          <Sequence key={key} from={from} durationInFrames={duration} name={name}>
            <C />
          </Sequence>
        );
      })}
      <Subtitle cues={CUES} />
      <Watermark />
      {audio ? <Html5Audio src={audio} /> : null}
      <SfxTrack cues={SFX} />
      {showSafeZone ? <SafeZoneGuide /> : null}
    </AbsoluteFill>
  );
};
