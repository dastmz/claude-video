import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { FONTS } from "../fonts";

const fill: React.CSSProperties = { position: "absolute", inset: 0 };

/** Skrin kunci dengan satu notifikasi yang meluncur masuk. */
export const NotificationScreen: React.FC<{ app?: string; message: string; from?: number; w?: number }> = ({
  app = "Mesej",
  message,
  from = 6,
  w = 520,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 13 } });
  return (
    <div style={{ ...fill, background: "linear-gradient(160deg,#2C3E73 0%,#1B2A4A 55%,#3B2D5C 100%)" }}>
      <div style={{ position: "absolute", top: w * 0.2, width: "100%", textAlign: "center", color: "#fff", fontFamily: FONTS.tajuk, fontWeight: 600, fontSize: w * 0.2 }}>
        21:30
      </div>
      <div
        style={{
          position: "absolute",
          left: w * 0.05,
          right: w * 0.05,
          top: w * 0.55,
          transform: `translateY(${(1 - s) * -w * 0.4}px)`,
          opacity: s,
          background: "rgba(255,255,255,0.95)",
          borderRadius: w * 0.06,
          padding: w * 0.045,
          boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: w * 0.025, marginBottom: w * 0.02 }}>
          <div style={{ width: w * 0.07, height: w * 0.07, borderRadius: w * 0.02, background: "#22C55E" }} />
          <span style={{ fontWeight: 700, fontSize: w * 0.04, color: "#555" }}>{app}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: w * 0.064, color: "#111", lineHeight: 1.25 }}>{message}</div>
      </div>
    </div>
  );
};

/** Skrin aplikasi bank yang menunjukkan baki. */
export const BankScreen: React.FC<{ label: string; w?: number; from?: number }> = ({ label, w = 520, from = 0 }) => {
  const frame = useCurrentFrame();
  const shake = frame - from > 12 && frame - from < 24 ? Math.sin(frame * 2.4) * 6 : 0;
  const op = interpolate(frame - from, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ ...fill, background: "#F3F5FA", opacity: op }}>
      <div style={{ height: w * 0.62, background: `linear-gradient(135deg, ${COLORS.bajuAyah}, #3B5BB5)`, borderBottomLeftRadius: w * 0.08, borderBottomRightRadius: w * 0.08 }} />
      <div
        style={{
          position: "absolute",
          left: w * 0.06,
          right: w * 0.06,
          top: w * 0.32,
          background: "#fff",
          borderRadius: w * 0.06,
          padding: `${w * 0.08}px ${w * 0.05}px`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          textAlign: "center",
          transform: `translateX(${shake}px)`,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: w * 0.105, color: COLORS.merahAmaran, fontFamily: FONTS.tajuk }}>{label}</div>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: w * 0.06, right: w * 0.06, top: w * (0.95 + i * 0.2), height: w * 0.13, background: "#fff", borderRadius: w * 0.03, display: "flex", alignItems: "center", padding: `0 ${w * 0.04}px`, gap: w * 0.04 }}>
          <div style={{ width: w * 0.08, height: w * 0.08, borderRadius: 999, background: "#DCE3F1" }} />
          <div style={{ flex: 1, height: w * 0.025, background: "#DCE3F1", borderRadius: 99 }} />
        </div>
      ))}
    </div>
  );
};

/** Butang besar "Mohon Sekarang". */
export const ApplyButton: React.FC<{ label: string; w: number; pulse?: number }> = ({ label, w, pulse = 0 }) => (
  <div
    style={{
      background: "linear-gradient(180deg,#FF6A3D,#E5484D)",
      color: "#fff",
      fontWeight: 900,
      fontSize: w * 0.075,
      fontFamily: FONTS.tajuk,
      textAlign: "center",
      borderRadius: 999,
      padding: `${w * 0.045}px 0`,
      boxShadow: `0 ${w * 0.02}px 0 #9E2B2F, 0 0 ${20 + pulse * 30}px rgba(255,90,60,${0.4 + pulse * 0.4})`,
    }}
  >
    {label}
  </div>
);

/** Iklan aplikasi pinjaman. */
export const LoanAdScreen: React.FC<{ headline: string; button?: string; w?: number }> = ({ headline, button, w = 520 }) => {
  const frame = useCurrentFrame();
  const pulse = (Math.sin(frame / 6) + 1) / 2;
  return (
    <div style={{ ...fill, background: "linear-gradient(170deg,#FFD25A 0%,#FF9F43 55%,#FF6A3D 100%)", padding: w * 0.07, paddingTop: w * 0.2, display: "flex", flexDirection: "column", gap: w * 0.06 }}>
      <svg viewBox="0 0 100 100" width={w * 0.34} style={{ alignSelf: "center" }}>
        <circle cx={50} cy={50} r={46} fill="#fff" />
        <path d="M 56 12 L 26 56 L 48 56 L 42 88 L 74 42 L 52 42 Z" fill="#FF6A3D" />
      </svg>
      <div style={{ fontFamily: FONTS.tajuk, fontWeight: 900, fontSize: w * 0.105, lineHeight: 1.12, color: "#1B1B1B", textAlign: "center" }}>{headline}</div>
      {button ? <ApplyButton label={button} w={w} pulse={pulse} /> : null}
      <div style={{ display: "flex", justifyContent: "center", gap: w * 0.03 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 24 24" width={w * 0.07}>
            <path d="M12 2l3 7 7 .6-5.3 4.6 1.6 7L12 17.6 5.7 21.2l1.6-7L2 9.6 9 9z" fill="#fff" />
          </svg>
        ))}
      </div>
    </div>
  );
};
