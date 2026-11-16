import React from "react";
import { interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ayah, UstazahRasyidah } from "../../shared/characters";
import { EpisodeCard } from "../../shared/EpisodeCard";
import { FONTS } from "../../shared/fonts";
import { InfoCard } from "../../shared/InfoCard";
import { OnScreenTitle } from "../../shared/OnScreenTitle";
import { PhoneScreen } from "../../shared/PhoneScreen";
import { LoanAdScreen } from "../../shared/phone/screens";
import { Place, Thumb } from "../../shared/Place";
import { SceneBackdrop } from "../../shared/SceneBackdrop";
import { SceneBackground } from "../../shared/SceneBackground";
import { isTalking } from "../../shared/Subtitle";
import { COLORS, Expression, sec } from "../../shared/theme";
import { VerseCard } from "../../shared/VerseCard";
import { BABAK, CUES, DALIL } from "./script";

type B = keyof typeof BABAK;
/** frame relatif babak bagi saat mutlak s */
const r = (b: B, s: number) => sec(s - BABAK[b].start);
const useAbs = (b: B) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const abs = frame + sec(BABAK[b].start);
  return { frame, fps, abs, t: abs / fps };
};

/** Ayah (kiri) & Ustazah (kanan) di masjid. */
const DuaWatak: React.FC<{ b: B; ayah: Expression; ustazah?: Expression; ustazahArm?: number }> = ({ b, ayah, ustazah = "senyum", ustazahArm = 4 }) => {
  const { abs } = useAbs(b);
  return (
    <>
      <SceneBackground scene="masjid" />
      <Place x={250 - 366} y={600}>
        <Ayah height={1200} expression={ayah} talking={isTalking(CUES, "AYAH", abs)} />
      </Place>
      <Place x={800 - 366} y={590}>
        <UstazahRasyidah height={1200} expression={ustazah} talking={isTalking(CUES, "USTAZAH", abs)} armKanan={ustazahArm} hand="tunjuk" />
      </Place>
    </>
  );
};

// ---------------- Babak 1: imbas kembali ----------------
export const Babak1: React.FC = () => {
  const { frame, fps } = useAbs("b1");
  const s = spring({ frame, fps, config: { damping: 14 } });
  const W = 280;
  return (
    <>
      <SceneBackdrop clip="clips/ep2_b1.mp4">
        <SceneBackground scene="navy" />
      </SceneBackdrop>
      <Place x={500 - W / 2} y={300} style={{ transform: `scale(${0.9 + 0.1 * s}) rotate(-3deg)`, filter: "saturate(0.6)" }}>
        <PhoneScreen width={W} time="23:58">
          <LoanAdScreen headline="Pinjaman Segera – Lulus 5 Minit" button="Mohon Sekarang" w={W} />
        </PhoneScreen>
        <Place x={160} y={360} style={{ transform: "rotate(-28deg)" }}>
          <Thumb width={110} />
        </Place>
      </Place>
      <div style={{ position: "absolute", top: 236, left: 0, width: 1000, textAlign: "center" }}>
        <span style={{ fontFamily: FONTS.tajuk, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: COLORS.navy, background: COLORS.emas, padding: "6px 22px", borderRadius: 999, opacity: s }}>SEBELUM INI</span>
      </div>
      <OnScreenTitle text="APA KATA SYARAK?" from={r("b1", 4.4)} y={985} fontSize={70} />
    </>
  );
};

// ---------------- Babak 2: hukum akikah ----------------
export const Babak2: React.FC = () => {
  const { t } = useAbs("b2");
  return (
    <>
      <SceneBackdrop clip="clips/ep2_b2.mp4">
        <DuaWatak b="b2" ayah={t >= 22 ? "lega" : "risau"} />
      </SceneBackdrop>
      <InfoCard
        title="HUKUM AKIKAH"
        from={r("b2", 13.4)}
        lines={[
          { text: "Sunat muakkad", at: r("b2", 13.6), tone: "ok" },
          { text: "Bukan wajib", at: r("b2", 15.4), tone: "info" },
          { text: "Dituntut bagi wali yang mampu", at: r("b2", 17.8), tone: "info" },
          { text: "Tak mampu? Tidak berdosa", at: r("b2", 22.0), tone: "ok" },
        ]}
      />
    </>
  );
};

// ---------------- Babak 3: hadis, bilangan & waktu ----------------
export const Babak3: React.FC = () => {
  const { abs, t } = useAbs("b3");
  const arm = interpolate(t, [28.4, 29.0, 49.8, 50.4], [4, 150, 150, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <SceneBackdrop clip="clips/ep2_b3.mp4">
        <SceneBackground scene="kelas" />
        <Place x={730 - 366} y={640}>
          <UstazahRasyidah height={1200} talking={isTalking(CUES, "USTAZAH", abs)} armKanan={arm} hand="tunjuk" />
        </Place>
      </SceneBackdrop>
      <VerseCard label="HADIS" {...DALIL.hadisAkikah} from={r("b3", 28.6)} until={r("b3", 37.2)} />
      <InfoCard
        title="BILANGAN & WAKTU"
        from={r("b3", 37.6)}
        fontSize={42}
        lines={[
          { text: "Lelaki: 2 ekor kambing (afdal)", at: r("b3", 37.8), tone: "info" },
          { text: "Perempuan: 1 ekor kambing", at: r("b3", 39.8), tone: "info" },
          { text: "Lelaki 1 ekor pun sah", at: r("b3", 42.0), tone: "ok" },
          { text: "1/7 lembu = 1 ekor kambing", at: r("b3", 44.8), tone: "ok" },
          { text: "Afdal hari ke-7, boleh kemudian", at: r("b3", 47.6), tone: "ok" },
        ]}
      />
    </>
  );
};

// ---------------- Babak 4: riba & hutang ----------------
export const Babak4: React.FC = () => {
  const { frame, fps, t } = useAbs("b4");
  const ayah: Expression = t >= 63.8 ? "risau" : t >= 55.2 ? "terkejut" : "risau";
  const W = 280;
  const phoneIn = spring({ frame: frame - r("b4", 51.4), fps, config: { damping: 13 } });
  const phoneOut = interpolate(t, [55.0, 55.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stamp = spring({ frame: frame - r("b4", 54.2), fps, config: { damping: 8, stiffness: 200 } });
  return (
    <>
      <SceneBackdrop clip="clips/ep2_b4.mp4">
        <DuaWatak b="b4" ayah={ayah} ustazah={t >= 55.2 && t < 63.6 ? "risau" : "senyum"} />
      </SceneBackdrop>
      {phoneOut > 0 ? (
        <Place x={500 - W / 2} y={260} style={{ transform: `scale(${phoneIn * phoneOut})` }}>
          <PhoneScreen width={W}>
            <LoanAdScreen headline="Pinjaman Segera – Lulus 5 Minit" button="Mohon Sekarang" w={W} />
          </PhoneScreen>
          <div style={{ position: "absolute", left: -30, top: 230, width: W + 60, textAlign: "center", transform: `scale(${2 - stamp}) rotate(-14deg)`, opacity: stamp }}>
            <span style={{ fontFamily: FONTS.tajuk, fontWeight: 900, fontSize: 80, color: COLORS.merahAmaran, border: `8px solid ${COLORS.merahAmaran}`, borderRadius: 18, padding: "0 22px", background: "rgba(255,255,255,0.85)" }}>FAEDAH?</span>
          </div>
        </Place>
      ) : null}
      <VerseCard label="AL-QURAN" {...DALIL.riba} from={r("b4", 55.2)} until={r("b4", 63.6)} />
      <VerseCard label="HADIS" {...DALIL.hutang} from={r("b4", 63.8)} />
    </>
  );
};

// ---------------- Babak 5: ikut kemampuan ----------------
export const Babak5: React.FC = () => {
  const { t } = useAbs("b5");
  return (
    <>
      <SceneBackdrop clip="clips/ep2_b5.mp4">
        <DuaWatak b="b5" ayah={t >= 75.2 ? "lega" : "senyum"} />
      </SceneBackdrop>
      <VerseCard label="AL-QURAN" {...DALIL.kemampuan} from={r("b5", 72.4)} />
    </>
  );
};

// ---------------- Babak 6: ringkasan + Episod 3 ----------------
export const Babak6: React.FC = () => (
  <>
    <SceneBackdrop clip="clips/ep2_b6.mp4">
      <SceneBackground scene="navy" />
    </SceneBackdrop>
    <InfoCard
      title="RINGKASAN"
      from={0}
      lines={[
        { text: "Akikah sunat, ikut kemampuan", at: r("b6", 81.6), tone: "ok" },
        { text: "Pinjaman berfaedah = riba", at: r("b6", 82.4), tone: "no" },
        { text: "Hutang wajib dibayar", at: r("b6", 83.2), tone: "info" },
      ]}
    />
    <OnScreenTitle text={"IKUT KEMAMPUAN,\nJAUHI RIBA!"} from={r("b6", 83.8)} y={880} fontSize={72} />
    <Sequence from={r("b6", 85)} name="EpisodeCard">
      <EpisodeCard episode={3} title="Jom Jawab KBAT!" />
    </Sequence>
  </>
);
