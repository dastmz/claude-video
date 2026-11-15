import React from "react";
import { AbsoluteFill } from "remotion";
import { Ayah, BabyUmar, Faiz, Ibu, UstazahRasyidah } from "./shared/characters";
import { FONTS } from "./shared/fonts";
import { COLORS, Expression } from "./shared/theme";

const EXPR: Expression[] = ["senyum", "risau", "terkejut", "lega"];

/** Helaian watak (semakan): setiap watak × 4 ekspresi. */
export const CharacterSheet: React.FC = () => {
  const rows = [
    { name: "Ayah (Encik Hakim)", C: (e: Expression) => <Ayah height={330} expression={e} /> },
    { name: "Ibu (Puan Aisyah)", C: (e: Expression) => <Ibu height={330} expression={e} /> },
    { name: "Baby Umar", C: (e: Expression) => <BabyUmar height={200} expression={e} /> },
    { name: "Faiz", C: (e: Expression) => <Faiz height={330} expression={e} /> },
    { name: "Ustazah Rasyidah", C: (e: Expression) => <UstazahRasyidah height={330} expression={e} /> },
  ];
  return (
    <AbsoluteFill style={{ background: COLORS.krim, padding: 30, fontFamily: FONTS.tajuk }}>
      <div style={{ display: "flex", marginLeft: 200 }}>
        {EXPR.map((e) => (
          <div key={e} style={{ width: 215, textAlign: "center", fontWeight: 800, fontSize: 32, color: COLORS.navy }}>{e}</div>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.name} style={{ display: "flex", alignItems: "center", height: 355, borderBottom: "2px solid #ddd" }}>
          <div style={{ width: 200, fontWeight: 700, fontSize: 28, color: COLORS.navy }}>{r.name}</div>
          {EXPR.map((e) => (
            <div key={e} style={{ width: 215, display: "flex", justifyContent: "center", overflow: "hidden" }}>{r.C(e)}</div>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};
