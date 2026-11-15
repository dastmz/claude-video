import { accent, colors, motion } from "./theme";

/** Scene lengths in frames (30fps). Start times = spec (0,4,8,15,22,29,50,56,62,69s). */
export const scenes = [
  { id: "hook", frames: 120, wipe: colors.highlight },
  { id: "title", frames: 120, wipe: accent.T },
  { id: "T", frames: 210, wipe: accent.R },
  { id: "R", frames: 210, wipe: accent.I },
  { id: "I", frames: 210, wipe: accent.C },
  { id: "C", frames: 630, wipe: accent.C },
  { id: "kbat", frames: 180, wipe: accent.K },
  { id: "K", frames: 180, wipe: accent.S },
  { id: "S", frames: 210, wipe: colors.highlight },
  { id: "outro", frames: 180, wipe: null },
] as const;

export type SceneId = (typeof scenes)[number]["id"];

export const TOTAL_FRAMES = scenes.reduce((a, s) => a + s.frames, 0); // 2250 = 75s

/** Absolute start frame of each scene (where its content is fully visible after the wipe begins). */
export const sceneStart = (id: SceneId) => {
  let t = 0;
  for (const s of scenes) {
    if (s.id === id) return t;
    t += s.frames;
  }
  return 0;
};

/** Each scene (except the last) is extended by the transition length so overlaps keep spec timing. */
export const sequenceLength = (i: number) =>
  scenes[i].frames + (i < scenes.length - 1 ? motion.transitionFrames : 0);
