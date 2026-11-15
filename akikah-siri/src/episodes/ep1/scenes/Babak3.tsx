import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ayah, Faiz } from "../../../shared/characters";
import { PhoneScreen } from "../../../shared/PhoneScreen";
import { LoanAdScreen } from "../../../shared/phone/screens";
import { Place } from "../../../shared/Place";
import { Table, TehTarik } from "../../../shared/props";
import { SceneBackdrop } from "../../../shared/SceneBackdrop";
import { SceneBackground } from "../../../shared/SceneBackground";
import { isTalking } from "../../../shared/Subtitle";
import { sec } from "../../../shared/theme";
import { BABAK, CUES } from "../script";

const W = 360;

export const Babak3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const abs = frame + sec(BABAK.b3.start);
  const t = abs / fps;
  const phoneIn = spring({ frame: frame - sec(0.4), fps, config: { damping: 12 } });
  const faizArm = interpolate(t, [30.3, 30.9, 46.5, 47.2], [4, 118, 118, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Faiz angkat bahu "tak ingat"
  const shrug = interpolate(t, [47.5, 48.2, 52, 52.8], [4, 55, 55, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ayahExpr = t >= 47.5 ? "terkejut" : t >= 40.8 ? "risau" : "senyum";
  return (
    <>
      <SceneBackdrop clip="clips/ep1_b3.mp4">
        <SceneBackground scene="kedaiMakan" />
        <Place x={210 - 366} y={600}>
          <Faiz height={1200} expression="senyum" talking={isTalking(CUES, "FAIZ", abs)} armKiri={Math.max(faizArm, shrug)} armKanan={shrug} hand={faizArm > 60 ? "tunjuk" : "buka"} />
        </Place>
        <Place x={830 - 366} y={610}>
          <Ayah height={1200} songkok={false} expression={ayahExpr} talking={isTalking(CUES, "AYAH", abs)} />
        </Place>
        <Table y={1380} />
        <Place x={130} y={1250}>
          <TehTarik size={110} />
        </Place>
        <Place x={790} y={1250}>
          <TehTarik size={110} />
        </Place>
      </SceneBackdrop>
      <Place x={500 - W / 2} y={250} style={{ transform: `translateY(${(1 - phoneIn) * 900}px) rotate(${(1 - phoneIn) * 12 + 2}deg)` }}>
        <PhoneScreen width={W}>
          <LoanAdScreen headline="Pinjaman Segera – Lulus 5 Minit" button="Mohon Sekarang" w={W} />
        </PhoneScreen>
      </Place>
    </>
  );
};
