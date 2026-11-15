import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ayah, Ibu } from "../../../shared/characters";
import { PhoneScreen } from "../../../shared/PhoneScreen";
import { LoanAdScreen } from "../../../shared/phone/screens";
import { Place, Thumb } from "../../../shared/Place";
import { IconBilElektrik, IconLampin, IconSusuBayi, Table } from "../../../shared/props";
import { SceneBackdrop } from "../../../shared/SceneBackdrop";
import { SceneBackground } from "../../../shared/SceneBackground";
import { isTalking } from "../../../shared/Subtitle";
import { sec } from "../../../shared/theme";
import { BABAK, CUES } from "../script";

const CLOSEUP_AT = 68; // saat mutlak
const W = 600;

/** 55–68 s: Ibu susun ikon bil di meja. */
const Perbualan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const abs = frame + sec(BABAK.b4.start);
  const t = abs / fps;
  const icons = [
    { el: <IconBilElektrik size={170} />, at: 56.6, x: 120 },
    { el: <IconSusuBayi size={170} />, at: 58.4, x: 375 },
    { el: <IconLampin size={170} />, at: 60.2, x: 630 },
  ];
  return (
    <>
      <SceneBackdrop clip="clips/ep1_b4.mp4">
        <SceneBackground scene="ruangTamu" malam />
        <Place x={760 - 335} y={330}>
          <Ayah height={1100} songkok={false} expression={t > 61.8 ? "risau" : "senyum"} talking={isTalking(CUES, "AYAH", abs)} />
        </Place>
        <Place x={260 - 335} y={320}>
          <Ibu height={1100} expression="risau" talking={isTalking(CUES, "IBU", abs)} armKiri={interpolate(Math.sin(frame / 10), [-1, 1], [-30, -10])} />
        </Place>
        <Table y={1000} height={920} />
      </SceneBackdrop>
      {icons.map((ic) => {
        const s = spring({ frame: frame - sec(ic.at - BABAK.b4.start), fps, config: { damping: 9, stiffness: 150 } });
        return (
          <Place key={ic.x} x={ic.x} y={830} style={{ transform: `translateY(${(1 - s) * -500}px) rotate(${(1 - s) * -25}deg)`, opacity: s > 0.01 ? 1 : 0 }}>
            {ic.el}
          </Place>
        );
      })}
    </>
  );
};

/** 68–75 s: close-up "Mohon Sekarang", ibu jari ayah, freeze + zoom + degupan jantung. */
const CloseUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const thumbIn = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const freezeAt = sec(1.6);
  const frozen = frame >= freezeAt;
  const f = Math.min(frame, freezeAt);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.18]);
  // degupan dua kali (lub-dub) setiap 0.9 s
  const p = (frame % 27) / 27;
  const beat = Math.max(Math.exp(-((p - 0.05) ** 2) / 0.002), 0.7 * Math.exp(-((p - 0.22) ** 2) / 0.002));
  const flash = interpolate(frame, [freezeAt, freezeAt + 3, freezeAt + 10], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0B1124" }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(0.45)", transform: "scale(1.1)" }}>
        <SceneBackground scene="ruangTamu" malam />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom * (1 + (frozen ? beat * 0.012 : 0))})`, transformOrigin: "500px 1000px", filter: frozen ? "saturate(0.75) contrast(1.08)" : undefined }}>
        <Place x={500 - W / 2} y={250}>
          <PhoneScreen width={W} time="23:58">
            <LoanAdScreen headline="Pinjaman Segera – Lulus 5 Minit" button="Mohon Sekarang" w={W} />
          </PhoneScreen>
        </Place>
        <Place x={560} y={1010} style={{ transform: `translate(${(1 - thumbIn) * 400 + Math.sin(f / 7) * 6}px, ${(1 - thumbIn) * 700}px) rotate(-28deg)` }}>
          <Thumb width={230} />
        </Place>
      </AbsoluteFill>
      {/* vinyet merah berdegup */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(170,0,20,${frozen ? 0.25 + beat * 0.35 : 0.15}) 100%)` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

export const Babak4: React.FC = () => {
  const closeFrom = sec(CLOSEUP_AT - BABAK.b4.start);
  return (
    <>
      <Sequence durationInFrames={closeFrom} name="Perbualan bil">
        <Perbualan />
      </Sequence>
      <Sequence from={closeFrom} name="Close-up Mohon Sekarang">
        <CloseUp />
      </Sequence>
    </>
  );
};
