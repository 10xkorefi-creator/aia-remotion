import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C, CLAMP, FONT, G, MONO, OUT, TRACK } from "./theme";

export const Logo: React.FC<{ size: number; inverse?: boolean; style?: React.CSSProperties }> = ({
  size,
  inverse,
  style,
}) => (
  <Img
    src={staticFile(inverse ? "ai-accountant-a-star-white.svg" : "ai-accountant-a-star.svg")}
    style={{ width: size, height: size, display: "block", ...style }}
  />
);

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

// Gentle camera push used on cuts: starts slightly large and eases to rest.
export const punch = (frame: number, amount = 0.04, dur = 16) =>
  interpolate(frame, [0, dur], [1 + amount, 1], { ...CLAMP, easing: OUT });

// Smooth scale pulse on an impact frame (replaces the old hard screen-shake).
export const bump = (frame: number, hit: number, amount = 0.025, dur = 14) =>
  interpolate(frame, [hit, hit + dur], [1 + amount, 1], { ...CLAMP, easing: OUT });

// 0 -> 1 progress with expo-out easing.
export const rise = (frame: number, at: number, dur = 12) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...CLAMP, easing: OUT });

// ---------------------------------------------------------------------------
// Atmosphere: drifting gradient mesh + film grain + vignette
// ---------------------------------------------------------------------------

type Mode = "dark" | "light" | "accent";

const Blob: React.FC<{ x: number; y: number; size: number; color: string; opacity: number }> = ({
  x,
  y,
  size,
  color,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      translate: "-50% -50%",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 66%)`,
      opacity,
    }}
  />
);

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.14 }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: GRAIN,
        backgroundPosition: `${random(`gx${step}`) * 360}px ${random(`gy${step}`) * 360}px`,
        mixBlendMode: "overlay",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const Backdrop: React.FC<{ mode: Mode; phase?: number; lift?: number }> = ({ mode, phase = 0, lift = 0 }) => {
  const frame = useCurrentFrame() + phase;
  const a = Math.sin(frame / 38);
  const b = Math.cos(frame / 47);
  const c = Math.sin(frame / 55 + 1.3);

  if (mode === "dark") {
    return (
      <AbsoluteFill style={{ background: `radial-gradient(130% 90% at 50% 115%, ${C.indigo800} 0%, ${C.indigo950} 48%, ${C.ink} 100%)`, overflow: "hidden" }}>
        <Blob x={18 + a * 6} y={88 - lift + b * 3} size={1250} color={C.accent} opacity={0.55} />
        <Blob x={88 + b * 5} y={16 + c * 4} size={900} color={C.indigo500} opacity={0.2} />
        <Blob x={50 + c * 8} y={50} size={1400} color={C.indigo900} opacity={0.5} />
        <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
        <Grain opacity={0.16} />
      </AbsoluteFill>
    );
  }

  if (mode === "accent") {
    return (
      <AbsoluteFill style={{ background: `linear-gradient(165deg, ${C.indigo500} 0%, ${C.accent} 42%, ${C.indigo800} 100%)`, overflow: "hidden" }}>
        <Blob x={15 + a * 8} y={10 + b * 5} size={1200} color={C.indigo300} opacity={0.65} />
        <Blob x={90 + b * 6} y={92 + c * 3} size={1300} color={C.indigo950} opacity={0.85} />
        <Blob x={60 + c * 8} y={45} size={800} color={C.indigo400} opacity={0.35} />
        <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(5,8,24,0.45) 100%)" }} />
        <Grain opacity={0.2} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${C.pearl} 55%, ${C.indigo100} 100%)`, overflow: "hidden" }}>
      <Blob x={8 + a * 6} y={96 - lift + b * 3} size={1300} color={C.indigo200} opacity={0.95} />
      <Blob x={96 + b * 5} y={4 + c * 3} size={1000} color={C.indigo100} opacity={1} />
      <Blob x={70 + c * 7} y={78} size={800} color={C.indigo300} opacity={0.35} />
      <Grain opacity={0.09} />
    </AbsoluteFill>
  );
};

// Soft light bloom that decays after an impact. Replaces hard white flashes.
export const Bloom: React.FC<{ at?: number; color?: string; strength?: number; dur?: number; x?: number; y?: number }> = ({
  at = 0,
  color = C.indigo400,
  strength = 0.7,
  dur = 16,
  x = 50,
  y = 50,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + dur], [strength, 0], { ...CLAMP, easing: OUT });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(70% 55% at ${x}% ${y}%, ${color} 0%, rgba(0,0,0,0) 75%)`,
        opacity: o,
        pointerEvents: "none",
      }}
    />
  );
};

// Floating motes: tiny drifting lights for depth.
export const Motes: React.FC<{ count?: number; color?: string; seed?: string; speed?: number }> = ({
  count = 22,
  color = C.indigo300,
  seed = "m",
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {new Array(count).fill(0).map((_, i) => {
        const size = 3 + random(`${seed}s${i}`) * 7;
        const x = random(`${seed}x${i}`) * 1080;
        const sp = (0.35 + random(`${seed}v${i}`) * 0.9) * speed;
        const y = (((random(`${seed}y${i}`) * 1500 - frame * sp * 2.2) % 1500) + 1500) % 1500 - 80;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (14 + random(`${seed}t${i}`) * 20) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 30 + i) * 12,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${size * 3}px ${size}px ${color}`,
              opacity: tw * (0.25 + random(`${seed}o${i}`) * 0.5),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Type + surfaces
// ---------------------------------------------------------------------------

// Gradient-filled text. Extra padding keeps italic serif ink from being clipped.
export const GradText: React.FC<{ gradient?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  gradient = G.accentText,
  children,
  style,
}) => (
  <span
    style={{
      display: "inline-block",
      background: gradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
      paddingRight: "0.08em",
      paddingBottom: "0.04em",
      ...style,
    }}
  >
    {children}
  </span>
);

export const glassDark: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
  border: "1.5px solid rgba(255,255,255,0.14)",
  backdropFilter: "blur(24px)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
};

export const glassLight: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.78) 100%)",
  border: "1.5px solid rgba(255,255,255,0.9)",
  backdropFilter: "blur(24px)",
  boxShadow: `0 2px 4px rgba(10,16,56,0.04), 0 24px 60px rgba(49,77,208,0.16), 0 50px 120px rgba(10,16,56,0.12), 0 0 0 1px ${C.hair}`,
};

// Word that rises out of a mask with a touch of blur. `p` 0..1
export const MaskWord: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  p,
  children,
  style,
}) => (
  <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", padding: "0.04em 0.1em 0.16em", margin: "-0.04em -0.1em -0.16em", ...style }}>
    <span style={{ display: "inline-block", translate: `0 ${(1 - p) * 112}%`, filter: `blur(${(1 - p) * 6}px)` }}>{children}</span>
  </span>
);

export const Check: React.FC<{ size: number; color?: string; progress?: number; stroke?: number }> = ({
  size,
  color = C.white,
  progress = 1,
  stroke = 3,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      d="M4.5 12.5l5 5 10-11"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);

export const Cursor: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", filter: "drop-shadow(0 8px 14px rgba(10,16,56,0.35))" }}>
    <path d="M5 3l14 8.2-6.1 1.3-3 5.7z" fill={C.black} stroke={C.white} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const VENDORS = [
  "Sharma Traders",
  "Mehta Steel Co.",
  "Gupta Pharma",
  "Balaji Packaging",
  "Kaveri Agro",
  "Shree Ram Logistics",
  "Patel Hardware",
  "Noor Textiles",
];

export const rupee = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// A paper purchase bill. `seed` varies the content.
export const BillCard: React.FC<{
  seed: number;
  width: number;
  vendor?: string;
  total?: string;
  gstin?: string;
  style?: React.CSSProperties;
  highlight?: number; // 0..1 scan progress for accent boxes
}> = ({ seed, width, vendor, total, gstin, style, highlight = -1 }) => {
  const s = width / 420; // design at 420px wide
  const v = vendor ?? VENDORS[Math.floor(random(`v${seed}`) * VENDORS.length)];
  const amt = total ?? rupee(8000 + random(`a${seed}`) * 92000);
  const rows = 4 + Math.floor(random(`r${seed}`) * 3);
  const box = (on: boolean): React.CSSProperties =>
    on
      ? { outline: `${3 * s}px solid ${C.accent}`, outlineOffset: 4 * s, borderRadius: 4 * s, background: "rgba(49,77,208,0.08)" }
      : {};
  return (
    <div
      style={{
        width,
        height: width * 1.33,
        background: "linear-gradient(170deg, #FFFFFF 0%, #F4F5FB 100%)",
        borderRadius: 16 * s,
        boxShadow: `0 ${22 * s}px ${60 * s}px rgba(0,0,0,0.32), 0 0 0 ${1 * s}px rgba(0,0,0,0.06), inset 0 ${1 * s}px 0 #fff`,
        padding: 30 * s,
        boxSizing: "border-box",
        fontFamily: FONT,
        letterSpacing: TRACK,
        color: C.black,
        display: "flex",
        flexDirection: "column",
        gap: 14 * s,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 15 * s, fontWeight: 600, color: C.grey, letterSpacing: "0.12em" }}>TAX INVOICE</div>
        <div style={{ fontFamily: MONO, fontSize: 13 * s, color: C.grey, letterSpacing: 0 }}>#{1000 + Math.floor(random(`n${seed}`) * 8999)}</div>
      </div>
      <div style={{ fontSize: 32 * s, fontWeight: 600, lineHeight: 1.05, ...box(highlight >= 0.15) }}>{v}</div>
      <div style={{ fontFamily: MONO, fontSize: 14 * s, color: C.grey, letterSpacing: 0, ...box(highlight >= 0.3) }}>
        GSTIN {gstin ?? `09AAACS${1000 + Math.floor(random(`g${seed}`) * 8999)}F1Z5`}
      </div>
      <div style={{ height: 2 * s, background: C.black, opacity: 0.85, marginTop: 6 * s }} />
      {new Array(rows).fill(0).map((_, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12 * s }}>
          <div style={{ height: 12 * s, width: `${45 + random(`w${seed}${i}`) * 30}%`, background: "rgba(0,0,0,0.11)", borderRadius: 6 * s }} />
          <div style={{ height: 12 * s, width: "18%", background: "rgba(0,0,0,0.11)", borderRadius: 6 * s }} />
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 * s, color: C.grey, ...box(highlight >= 0.7) }}>
        <span>CGST 9% + SGST 9%</span>
        <span style={{ fontFamily: MONO, letterSpacing: 0 }}>18%</span>
      </div>
      <div style={{ height: 2 * s, background: C.black, opacity: 0.85 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", ...box(highlight >= 0.9) }}>
        <span style={{ fontSize: 16 * s, fontWeight: 500 }}>Total</span>
        <span style={{ fontSize: 34 * s, fontWeight: 600 }}>{amt}</span>
      </div>
    </div>
  );
};
