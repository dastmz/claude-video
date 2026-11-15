// Usage: node scripts/stills.mjs [--extra]
// Renders the midpoint of every scene (plus, with --extra, the fully-built state) to out/stills/.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const scenes = [
  ["01-hook", 0, 120], ["02-title", 120, 120], ["03-T", 240, 210], ["04-R", 450, 210],
  ["05-I", 660, 210], ["06-C", 870, 720], ["07-K", 1590, 180], ["08-S", 1770, 210],
  ["09-kbat", 1980, 180], ["10-outro", 2160, 180],
];
const extra = process.argv.includes("--extra");
const frames = [];
for (const [name, start, len] of scenes) {
  frames.push([`${name}-mid`, start + Math.floor(len / 2)]);
  if (extra) frames.push([`${name}-full`, start + len - 4]);
}
if (extra) {
  // each C formula card when fully built (cards start at C+110, 105 frames each)
  ["a-hikmah", "b-kesan", "c-punca", "d-cara", "e-pengajaran"].forEach((n, i) => frames.push([`06-C-card-${n}`, 870 + 110 + i * 105 + 98]));
  frames.push(["06-C-intro", 870 + 100]);
  frames.push(["06-C-card-f-ringkasan", 870 + 110 + 5 * 105 + 72]);
  frames.push(["00-transition", 240 + 6]);
}
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const LOCAL = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browserExecutable = fs.existsSync(LOCAL) ? LOCAL : null;
const composition = await selectComposition({ serveUrl, id: "TricksVideo", browserExecutable });
for (const [name, frame] of frames) {
  await renderStill({ serveUrl, composition, frame, output: path.join(outDir, `${name}.png`), scale: 0.5, browserExecutable });
  console.log("still", name, frame);
}
