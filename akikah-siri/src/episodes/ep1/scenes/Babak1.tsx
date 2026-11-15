import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ayah } from "../../../shared/characters";
import { OnScreenTitle } from "../../../shared/OnScreenTitle";
import { PhoneScreen } from "../../../shared/PhoneScreen";
import { BankScreen, NotificationScreen } from "../../../shared/phone/screens";
import { Place } from "../../../shared/Place";
import { SceneBackdrop } from "../../../shared/SceneBackdrop";
import { SceneBackground } from "../../../shared/SceneBackground";
import { isTalking } from "../../../shared/Subtitle";
import { sec } from "../../../shared/theme";
import { BABAK, CUES } from "../script";

const W = 400;

export const Babak1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const abs = frame + sec(BABAK.b1.start);
  const inS = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [sec(6), sec(6.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bank = frame >= sec(3);
  return (
    <>
      <SceneBackdrop clip="clips/ep1_b1.mp4">
        <SceneBackground scene="ruangTamu" malam />
        <Place x={640 - 457} y={380}>
          <Ayah height={1500} dukungBaby expression={bank ? "risau" : "senyum"} talking={isTalking(CUES, "AYAH", abs)} />
        </Place>
      </SceneBackdrop>
      <Place
        x={70}
        y={260}
        style={{
          transform: `translateX(${(1 - inS) * -500 - out * 700}px) rotate(${-4 + out * -10}deg)`,
        }}
      >
        <PhoneScreen width={W}>
          {bank ? (
            <BankScreen label="Baki: RM320" w={W} from={sec(3)} />
          ) : (
            <NotificationScreen message="2 ekor kambing akikah: RM1,400" w={W} from={10} />
          )}
        </PhoneScreen>
      </Place>
      <OnScreenTitle text="RM1,400 vs RM320" from={sec(6.2)} y={400} fontSize={100} />
    </>
  );
};
