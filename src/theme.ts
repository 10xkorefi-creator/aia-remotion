import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// AI Accountant brand tokens. #314DD0 stays the one true accent; the gradients below are
// lighter / deeper shades of that same hue so everything still reads as on-brand.
export const C = {
  white: "#FFFFFF",
  black: "#000000",
  grey: "#666666",
  accent: "#314DD0",
  hair: "rgba(10,15,46,0.08)",
  paper: "#FFFFFF",

  // accent ramp
  indigo950: "#050818",
  indigo900: "#0A1038",
  indigo800: "#111A5E",
  indigo700: "#1D2D9A",
  indigo500: "#4864F0",
  indigo400: "#6F86FF",
  indigo300: "#A3B1FF",
  indigo200: "#D3DAFF",
  indigo100: "#EEF1FF",

  // surfaces
  ink: "#03040C",
  pearl: "#F6F7FC",
};

export const G = {
  accent: `linear-gradient(135deg, ${C.indigo400} 0%, ${C.accent} 55%, ${C.indigo700} 100%)`,
  accentText: `linear-gradient(100deg, ${C.indigo200} 0%, ${C.indigo400} 45%, ${C.accent} 100%)`,
  lightText: `linear-gradient(100deg, #000000 0%, #0A1038 30%, ${C.accent} 100%)`,
  silverText: `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 40%, ${C.indigo300} 100%)`,
};

export const FONT = "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const SERIF = "'Instrument Serif', 'Times New Roman', serif";
export const MONO = "'Geist Mono', ui-monospace, monospace";
export const TRACK = "-0.045em";
export const TRACK_UI = "-0.02em";

for (const w of ["400", "500", "600", "700"]) {
  loadFont({ family: "Geist", url: staticFile(`geist-latin-${w}-normal.woff2`), weight: w });
}
loadFont({ family: "Geist Mono", url: staticFile("geist-mono-latin-500-normal.woff2"), weight: "500" });
loadFont({
  family: "Instrument Serif",
  url: staticFile("instrument-serif-latin-400-italic.woff2"),
  weight: "400",
  style: "italic",
});

// Motion language: buttery expo-out arrivals, soft springs, no hard shakes.
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const OUT_SOFT = Easing.bezier(0.22, 1, 0.36, 1);
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const SNAP = Easing.spring({ damping: 16, mass: 0.7 }); // gentle overshoot
export const SOFT = Easing.spring({ damping: 200 });

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 120 BPM @ 30fps
export const BEAT = 15;

// Scene lengths (frames). Sum = 450 = 15s. Cuts land on soundtrack hits, so don't change these.
export const SCENES = {
  hook: 60,
  chaos: 60,
  reveal: 45,
  demo: 120,
  modules: 45,
  whatsapp: 45,
  minutes: 30,
  end: 45,
};

// 4:5 portrait, the best-performing frame for video in the X feed.
export const W = 1080;
export const H = 1350;
