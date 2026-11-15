import React from "react";
import { AbsoluteFill, Html5Audio, Sequence } from "remotion";
import { firstExisting } from "../../shared/assets";
import { SafeZoneGuide } from "../../shared/SafeZoneGuide";
import { Subtitle } from "../../shared/Subtitle";
import { COLORS, sec } from "../../shared/theme";
import { Watermark } from "../../shared/Watermark";
import { Babak1 } from "./scenes/Babak1";
import { Babak2 } from "./scenes/Babak2";
import { Babak3 } from "./scenes/Babak3";
import { Babak4 } from "./scenes/Babak4";
import { Babak5 } from "./scenes/Babak5";
import { babakFrames, CUES } from "./script";

export type Ep1Props = {
  /** Papar lapisan zon selamat TikTok (untuk semakan draf sahaja). */
  showSafeZone: boolean;
};

const SCENES = [
  { key: "b1", name: "Babak 1 – Notifikasi & baki", C: Babak1 },
  { key: "b2", name: "Babak 2 – Kalendar hari ke-7", C: Babak2 },
  { key: "b3", name: "Babak 3 – Kedai makan, Faiz", C: Babak3 },
  { key: "b4", name: "Babak 4 – Bil & Mohon Sekarang", C: Babak4 },
  { key: "b5", name: "Babak 5 – Soalan KBAT", C: Babak5 },
] as const;

export const Ep1SayangAnak: React.FC<Ep1Props> = ({ showSafeZone }) => {
  const audio = firstExisting("audio/ep1", ["mp3"]);
  const heartbeat = firstExisting("audio/sfx/heartbeat", ["mp3", "wav"]);
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
      {heartbeat ? (
        <Sequence from={sec(69.6)} durationInFrames={sec(5.4)} name="SFX degupan jantung">
          <Html5Audio src={heartbeat} loop volume={0.9} />
        </Sequence>
      ) : null}
      {showSafeZone ? <SafeZoneGuide /> : null}
    </AbsoluteFill>
  );
};
