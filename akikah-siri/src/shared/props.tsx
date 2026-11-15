import React from "react";
import { COLORS } from "./theme";
import { FONTS } from "./fonts";

/** Kalendar dinding dengan satu hari dibulatkan. */
export const Calendar: React.FC<{ circled?: number; month?: string; circleProgress?: number; width?: number }> = ({
  circled = 7,
  month = "NOVEMBER",
  circleProgress = 1,
  width = 440,
}) => {
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  const cell = width / 7;
  return (
    <div style={{ width, background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.35)", fontFamily: FONTS.tajuk }}>
      <div style={{ background: COLORS.merahAmaran, color: "#fff", fontWeight: 800, fontSize: width * 0.075, textAlign: "center", padding: "10px 0" }}>{month}</div>
      <div style={{ display: "flex", paddingTop: 10 }}>
        {["Ah", "Is", "Se", "Ra", "Kh", "Ju", "Sa"].map((d) => (
          <div key={d} style={{ width: cell, textAlign: "center", fontWeight: 700, fontSize: cell * 0.3, color: "#888" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", padding: "4px 0 16px" }}>
        {days.map((d) => (
          <div key={d} style={{ width: cell, height: cell, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontWeight: 700, fontSize: cell * 0.42, color: d === circled ? COLORS.merahAmaran : "#333" }}>
            {d}
            {d === circled ? (
              <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: -6, width: cell + 12, height: cell + 12 }}>
                <circle cx={50} cy={50} r={42} fill="none" stroke={COLORS.merahAmaran} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - circleProgress} transform="rotate(-90 50 50)" />
              </svg>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

const IconTile: React.FC<{ color: string; size: number; children: React.ReactNode }> = ({ color, size, children }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>
    <svg viewBox="0 0 100 100" width={size * 0.72} height={size * 0.72}>
      {children}
    </svg>
  </div>
);

/** Ikon bil elektrik (kilat). */
export const IconBilElektrik: React.FC<{ size?: number }> = ({ size = 180 }) => (
  <IconTile color="#FACC15" size={size}>
    <rect x={18} y={8} width={64} height={84} rx={8} fill="#fff" />
    <path d="M 56 20 L 32 56 L 48 56 L 42 82 L 68 44 L 52 44 Z" fill="#F59E0B" />
  </IconTile>
);

/** Ikon tin susu bayi / botol susu. */
export const IconSusuBayi: React.FC<{ size?: number }> = ({ size = 180 }) => (
  <IconTile color="#93C5FD" size={size}>
    <rect x={38} y={6} width={24} height={14} rx={4} fill="#F4B6C2" />
    <path d="M 34 20 L 66 20 L 70 34 L 30 34 Z" fill="#F6EBDD" />
    <rect x={28} y={34} width={44} height={60} rx={12} fill="#fff" />
    <rect x={28} y={60} width={44} height={34} rx={10} fill="#F6EBDD" />
    {[46, 56, 66].map((y) => (
      <rect key={y} x={32} y={y} width={12} height={3} fill="#93C5FD" />
    ))}
  </IconTile>
);

/** Ikon lampin. */
export const IconLampin: React.FC<{ size?: number }> = ({ size = 180 }) => (
  <IconTile color="#C4B5FD" size={size}>
    <path d="M 10 24 L 90 24 L 90 40 Q 70 46 64 86 L 36 86 Q 30 46 10 40 Z" fill="#fff" />
    <rect x={10} y={24} width={80} height={12} fill="#F4B6C2" />
    <circle cx={50} cy={58} r={6} fill="#C4B5FD" />
  </IconTile>
);

/** Meja ringkas (lapisan hadapan). */
export const Table: React.FC<{ y: number; color?: string; height?: number }> = ({ y, color = "#8B5E3C", height = 500 }) => (
  <div style={{ position: "absolute", left: -40, right: -40, top: y, height, background: color, borderTop: "18px solid #A8774F", boxShadow: "0 -10px 30px rgba(0,0,0,0.25)" }} />
);

/** Gelas teh tarik. */
export const TehTarik: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg viewBox="0 0 60 80" width={size} height={size * 1.33}>
    <path d="M 6 10 L 54 10 L 48 76 L 12 76 Z" fill="rgba(255,255,255,0.5)" stroke="#fff" strokeWidth={2} />
    <path d="M 9 26 L 51 26 L 48 74 L 12 74 Z" fill="#C88A4F" />
    <path d="M 9 26 L 51 26 L 50 34 L 10 34 Z" fill="#F3E0C2" />
  </svg>
);
