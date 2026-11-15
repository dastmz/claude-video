import { getStaticFiles, staticFile } from "remotion";

/** Semak sama ada fail wujud dalam folder public/ (contoh: "audio/ep1.mp3"). */
export const hasPublicFile = (path: string): boolean => {
  const clean = path.replace(/^\/+/, "");
  return getStaticFiles().some((f) => f.name === clean);
};

/** Pulangkan URL staticFile jika fail wujud, atau null. */
export const optionalFile = (path: string): string | null =>
  hasPublicFile(path) ? staticFile(path) : null;

/** Cari fail pertama yang wujud daripada beberapa sambungan (mp3/wav/m4a ...). */
export const firstExisting = (base: string, exts: string[]): string | null => {
  for (const e of exts) {
    const url = optionalFile(`${base}.${e}`);
    if (url) return url;
  }
  return null;
};
