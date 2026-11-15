import React from "react";
import { FONTS } from "./fonts";

type Props = {
  width?: number;
  /** jam di bar status */
  time?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  screenBg?: string;
};

/** Mockup telefon pintar; isi skrin diberi melalui children. Nisbah 9:19.5. */
export const PhoneScreen: React.FC<Props> = ({ width = 520, time = "21:30", children, style, screenBg = "#0F172A" }) => {
  const height = width * 2.05;
  const bezel = width * 0.04;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.14,
        background: "#0B0B0F",
        padding: bezel,
        boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 0 0 4px #2A2A33",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.11,
          overflow: "hidden",
          position: "relative",
          background: screenBg,
          fontFamily: FONTS.sariKata,
        }}
      >
        {/* bar status */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: width * 0.11,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${width * 0.08}px`,
            color: "#fff",
            fontWeight: 700,
            fontSize: width * 0.045,
            zIndex: 5,
          }}
        >
          <span>{time}</span>
          <span style={{ display: "flex", gap: width * 0.012, alignItems: "flex-end" }}>
            {[0.35, 0.55, 0.75, 1].map((h) => (
              <span key={h} style={{ width: width * 0.012, height: width * 0.04 * h, background: "#fff", borderRadius: 2 }} />
            ))}
            <span style={{ width: width * 0.07, height: width * 0.035, border: "2px solid #fff", borderRadius: 4, marginLeft: width * 0.015 }} />
          </span>
        </div>
        {/* takuk kamera */}
        <div
          style={{
            position: "absolute",
            top: width * 0.025,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.26,
            height: width * 0.065,
            borderRadius: 999,
            background: "#000",
            zIndex: 6,
          }}
        />
        {children}
      </div>
    </div>
  );
};
