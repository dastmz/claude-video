import React from "react";
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { colors, motion } from "./theme";
import { scenes, sceneStart, sequenceLength, SceneId, TOTAL_FRAMES } from "./timeline";
import { colorWipe } from "./components/Wipe";
import { SceneOffset } from "./components/Background";
import { hasStatic, Sfx } from "./components/Sfx";
import { Hook } from "./scenes/Hook";
import { Title } from "./scenes/Title";
import { StepT } from "./scenes/StepT";
import { StepR } from "./scenes/StepR";
import { StepI } from "./scenes/StepI";
import { StepC } from "./scenes/StepC";
import { Kbat } from "./scenes/Kbat";
import { StepK } from "./scenes/StepK";
import { StepS } from "./scenes/StepS";
import { Outro } from "./scenes/Outro";

const COMPONENTS: Record<SceneId, React.FC> = {
  hook: Hook,
  title: Title,
  T: StepT,
  R: StepR,
  I: StepI,
  C: StepC,
  kbat: Kbat,
  K: StepK,
  S: StepS,
  outro: Outro,
};

const Music: React.FC = () => {
  const { fps } = useVideoConfig();
  if (!hasStatic("music.mp3")) return null;
  return (
    <Audio
      src={staticFile("music.mp3")}
      loop
      volume={(f) =>
        0.6 *
        interpolate(f, [0, fps * 1.5, TOTAL_FRAMES - fps * 2, TOTAL_FRAMES], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

export const TricksVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <TransitionSeries>
        {scenes.flatMap((s, i) => {
          const Comp = COMPONENTS[s.id];
          const items = [
            <TransitionSeries.Sequence key={s.id} durationInFrames={sequenceLength(i)}>
              <SceneOffset.Provider value={sceneStart(s.id)}>
                <Comp />
              </SceneOffset.Provider>
            </TransitionSeries.Sequence>,
          ];
          if (s.wipe && i < scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`${s.id}-t`}
                presentation={colorWipe({ color: s.wipe, dir: i % 2 === 0 ? "left" : "right" })}
                timing={linearTiming({ durationInFrames: motion.transitionFrames })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {scenes.slice(1).map((s) => (
        <Sfx key={s.id} name="whoosh" at={sceneStart(s.id) - 2} volume={0.5} />
      ))}
      <Music />
    </AbsoluteFill>
  );
};
