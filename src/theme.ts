import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// AI Accountant brand tokens (exact hex, accent used sparingly)
export const C = {
  white: "#FFFFFF",
  black: "#000000",
  grey: "#666666",
  accent: "#314DD0",
  hair: "rgba(0,0,0,0.08)",
  paper: "#FFFFFF",
};

// Helvetica Neue is the brand face; Inter is the approved substitute when unavailable.
export const FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";
export const TRACK = "-0.04em";

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

for (const w of ["400", "500", "700"]) {
  loadFont({ family: "Inter", url: staticFile(`inter-latin-${w}-normal.woff2`), weight: w, unicodeRange: LATIN });
  loadFont({ family: "Inter", url: staticFile(`inter-latin-ext-${w}-normal.woff2`), weight: w, unicodeRange: LATIN_EXT });
}
loadFont({ family: "JetBrains Mono", url: staticFile("jetbrains-mono-latin-500-normal.woff2"), weight: "500" });

// Motion language
export const OUT = Easing.bezier(0.16, 1, 0.3, 1); // expo-out: snappy arrivals
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const SNAP = Easing.spring({ damping: 14, mass: 0.6 }); // slight overshoot
export const SOFT = Easing.spring({ damping: 200 });

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 120 BPM @ 30fps
export const BEAT = 15;

// Scene lengths (frames). Sum = 450 = 15s
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

export const W = 1080;
export const H = 1350;
