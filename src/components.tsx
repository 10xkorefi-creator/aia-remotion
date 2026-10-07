import React from "react";
import { Img, interpolate, random, staticFile } from "remotion";
import { C, CLAMP, FONT, MONO, OUT, TRACK } from "./theme";

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

// Camera punch-in used on hard cuts: starts slightly large and settles.
export const punch = (frame: number, amount = 0.06, dur = 9) =>
  interpolate(frame, [0, dur], [1 + amount, 1], { ...CLAMP, easing: OUT });

// Decaying screen shake, deterministic.
export const shake = (frame: number, hitFrame: number, strength = 14, decay = 8) => {
  const t = frame - hitFrame;
  if (t < 0 || t > decay * 3) return "0px 0px";
  const k = Math.exp(-t / decay) * strength;
  const x = (random(`sx${hitFrame}-${t}`) - 0.5) * 2 * k;
  const y = (random(`sy${hitFrame}-${t}`) - 0.5) * 2 * k;
  return `${x.toFixed(1)}px ${y.toFixed(1)}px`;
};

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
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))" }}>
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
      ? { outline: `${3 * s}px solid ${C.accent}`, outlineOffset: 4 * s, borderRadius: 4 * s, background: "rgba(49,77,208,0.07)" }
      : {};
  return (
    <div
      style={{
        width,
        height: width * 1.33,
        background: C.paper,
        borderRadius: 14 * s,
        boxShadow: `0 ${18 * s}px ${50 * s}px rgba(0,0,0,0.28), 0 0 0 ${1 * s}px rgba(0,0,0,0.06)`,
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
        <div style={{ fontSize: 15 * s, fontWeight: 700, color: C.grey, letterSpacing: "0.12em" }}>TAX INVOICE</div>
        <div style={{ fontFamily: MONO, fontSize: 13 * s, color: C.grey }}>#{1000 + Math.floor(random(`n${seed}`) * 8999)}</div>
      </div>
      <div style={{ fontSize: 32 * s, fontWeight: 700, lineHeight: 1.05, ...box(highlight >= 0.15) }}>{v}</div>
      <div style={{ fontFamily: MONO, fontSize: 14 * s, color: C.grey, ...box(highlight >= 0.3) }}>
        GSTIN {gstin ?? `09AAACS${1000 + Math.floor(random(`g${seed}`) * 8999)}F1Z5`}
      </div>
      <div style={{ height: 2 * s, background: C.black, opacity: 0.85, marginTop: 6 * s }} />
      {new Array(rows).fill(0).map((_, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12 * s }}>
          <div style={{ height: 12 * s, width: `${45 + random(`w${seed}${i}`) * 30}%`, background: "rgba(0,0,0,0.12)", borderRadius: 6 * s }} />
          <div style={{ height: 12 * s, width: "18%", background: "rgba(0,0,0,0.12)", borderRadius: 6 * s }} />
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 * s, color: C.grey, ...box(highlight >= 0.7) }}>
        <span>CGST 9% + SGST 9%</span>
        <span style={{ fontFamily: MONO }}>18%</span>
      </div>
      <div style={{ height: 2 * s, background: C.black, opacity: 0.85 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", ...box(highlight >= 0.9) }}>
        <span style={{ fontSize: 16 * s, fontWeight: 500 }}>Total</span>
        <span style={{ fontSize: 34 * s, fontWeight: 700 }}>{amt}</span>
      </div>
    </div>
  );
};

// Word that rises out of a mask. `p` 0..1
export const MaskWord: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  p,
  children,
  style,
}) => (
  <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.08em", ...style }}>
    <span style={{ display: "inline-block", translate: `0 ${(1 - p) * 110}%` }}>{children}</span>
  </span>
);
