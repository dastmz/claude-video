import type { SfxCue } from "../../shared/SfxTrack";

/** Garis masa kesan bunyi Episod 1 (saat mutlak). */
export const SFX: SfxCue[] = [
  // Babak 1
  { at: 0.0, name: "whoosh", volume: 0.4 },
  { at: 0.35, name: "ding", volume: 0.6 },
  { at: 3.0, name: "whoosh", volume: 0.3 },
  { at: 3.3, name: "buzz", volume: 0.45 },
  { at: 6.0, name: "whoosh", volume: 0.4 },
  { at: 6.2, name: "pop", volume: 0.6 },
  // Babak 2
  { at: 10.0, name: "whoosh", volume: 0.35 },
  { at: 10.3, name: "pop", volume: 0.4 },
  { at: 12.6, name: "pen", volume: 0.5 },
  // Babak 3
  { at: 30.0, name: "whoosh", volume: 0.35 },
  { at: 30.4, name: "ding", volume: 0.45 },
  { at: 47.5, name: "pop", volume: 0.35 },
  // Babak 4
  { at: 55.0, name: "whoosh", volume: 0.35 },
  { at: 56.6, name: "thud", volume: 0.6 },
  { at: 58.4, name: "thud", volume: 0.6 },
  { at: 60.2, name: "thud", volume: 0.6 },
  { at: 68.0, name: "whoosh", volume: 0.45 },
  { at: 69.6, name: "impak", volume: 0.6 },
  { at: 69.6, name: "heartbeat", volume: 0.9, duration: 5.4, loop: true },
  // Babak 5
  { at: 75.0, name: "whoosh", volume: 0.35 },
  { at: 75.6, name: "tik", volume: 0.5 },
  { at: 76.5, name: "tik", volume: 0.5 },
  { at: 77.4, name: "tik", volume: 0.5 },
  { at: 78.3, name: "tik", volume: 0.5 },
  { at: 79.4, name: "pop", volume: 0.6 },
  { at: 85.0, name: "chime", volume: 0.55 },
];
