import React from "react";
import { AbsoluteFill, Html5Video } from "remotion";
import { optionalFile } from "./assets";

type Props = {
  /** laluan dalam public/, cth "clips/ep1_b1.mp4" */
  clip: string;
  /** ilustrasi (latar + watak) — dipaparkan jika klip tiada */
  children: React.ReactNode;
};

/**
 * Jika public/<clip> wujud, klip itu menjadi latar babak (menggantikan ilustrasi).
 * Klip dimainkan tanpa bunyi dan diulang jika lebih pendek daripada babak.
 */
export const SceneBackdrop: React.FC<Props> = ({ clip, children }) => {
  const src = optionalFile(clip);
  if (src) {
    return (
      <AbsoluteFill>
        <Html5Video src={src} muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};
