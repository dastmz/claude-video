import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Ayah, Ibu, UstazahRasyidah } from "../../shared/characters";
import { OnScreenTitle } from "../../shared/OnScreenTitle";
import { Huruf, PHKRStepCard, PHKRTiles } from "../../shared/PHKR";
import { Place } from "../../shared/Place";
import { SceneBackdrop } from "../../shared/SceneBackdrop";
import { SceneBackground } from "../../shared/SceneBackground";
import { isTalking } from "../../shared/Subtitle";
import { sec } from "../../shared/theme";
import { VerseCard } from "../../shared/VerseCard";
import { BABAK, CUES, ISI, SOALAN } from "./script";

type B = keyof typeof BABAK;
const r = (b: B, s: number) => sec(s - BABAK[b].start);
const useAbs = (b: B) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const abs = frame + sec(BABAK[b].start);
  return { frame, abs, t: abs / fps };
};

/** Ustazah di kelas, menunjuk ke papan. */
const UstazahKelas: React.FC<{ b: B }> = ({ b }) => {
  const { abs, frame } = useAbs(b);
  const arm = interpolate(frame, [0, 8], [4, 150], { extrapolateRight: "clamp" });
  return (
    <>
      <SceneBackground scene="kelas" />
      <Place x={740 - 366} y={740}>
        <UstazahRasyidah height={1200} talking={isTalking(CUES, "USTAZAH", abs)} armKanan={arm} hand="tunjuk" />
      </Place>
    </>
  );
};

/** Babak satu langkah: jubin (aktif) + kad isi. */
const Langkah: React.FC<{ b: B; huruf: Huruf }> = ({ b, huruf }) => (
  <>
    <SceneBackdrop clip={`clips/ep3_${b}.mp4`}>
      <UstazahKelas b={b} />
    </SceneBackdrop>
    <PHKRTiles active={huruf} />
    <PHKRStepCard huruf={huruf} fontSize={38} from={sec(0.3)} lines={ISI[huruf].map((l) => ({ text: l.text, at: r(b, l.at) }))} />
  </>
);

export const Babak1: React.FC = () => (
  <>
    <SceneBackdrop clip="clips/ep3_b1.mp4">
      <SceneBackground scene="navy" />
    </SceneBackdrop>
    <VerseCard label="SOALAN KBAT" terjemahan={SOALAN} rujukan="(Situasi Encik Hakim, Episod 1)" from={sec(0.3)} y={330} />
    <PHKRTiles y={830} appearAt={[r("b1", 4.4), r("b1", 4.8), r("b1", 5.2), r("b1", 5.6)]} />
  </>
);

export const Babak2: React.FC = () => (
  <>
    <SceneBackdrop clip="clips/ep3_b2.mp4">
      <UstazahKelas b="b2" />
    </SceneBackdrop>
    <PHKRTiles y={420} size={200} appearAt={[r("b2", 9.2), r("b2", 10.0), r("b2", 10.8), r("b2", 11.6)]} />
    <OnScreenTitle text="JAWAPAN KBAT" from={0} y={300} fontSize={64} />
  </>
);

export const Babak3: React.FC = () => <Langkah b="b3" huruf="P" />;
export const Babak4: React.FC = () => <Langkah b="b4" huruf="H" />;
export const Babak5: React.FC = () => <Langkah b="b5" huruf="K" />;

export const Babak6: React.FC = () => {
  const { abs, t } = useAbs("b6");
  const lega = t >= 75.4;
  return (
    <>
      <SceneBackdrop clip="clips/ep3_b6.mp4">
        <SceneBackground scene="ruangTamu" />
        <Place x={790 - 366} y={740}>
          <Ayah height={1200} dukungBaby babyExpression="lega" expression={lega ? "lega" : "senyum"} talking={isTalking(CUES, "AYAH", abs)} />
        </Place>
        <Place x={260 - 366} y={730}>
          <Ibu height={1200} expression={lega ? "lega" : "senyum"} talking={isTalking(CUES, "IBU", abs)} />
        </Place>
      </SceneBackdrop>
      <PHKRTiles active="R" />
      <PHKRStepCard huruf="R" fontSize={38} from={sec(0.3)} lines={ISI.R.map((l) => ({ text: l.text, at: r("b6", l.at) }))} />
    </>
  );
};

export const Babak7: React.FC = () => (
  <>
    <SceneBackdrop clip="clips/ep3_b7.mp4">
      <SceneBackground scene="navy" />
    </SceneBackdrop>
    <PHKRTiles y={330} />
    <OnScreenTitle text={"JOM CUBA\nJAWAB!"} from={r("b7", 80.6)} y={800} fontSize={96} />
  </>
);
