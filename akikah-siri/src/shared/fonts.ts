import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";

const poppins = loadPoppins("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});
const montserrat = loadMontserrat("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

const amiri = loadAmiri("normal", { weights: ["700"], subsets: ["arabic"] });

export const FONTS = {
  arab: amiri.fontFamily, // Amiri – ayat al-Quran
  tajuk: poppins.fontFamily, // Poppins Bold – tajuk
  sariKata: montserrat.fontFamily, // Montserrat – sari kata
};
