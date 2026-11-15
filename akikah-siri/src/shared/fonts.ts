import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const poppins = loadPoppins("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});
const montserrat = loadMontserrat("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

export const FONTS = {
  tajuk: poppins.fontFamily, // Poppins Bold – tajuk
  sariKata: montserrat.fontFamily, // Montserrat – sari kata
};
