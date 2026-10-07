import React from "react";
import { AbsoluteFill, Interactive, interpolate, random, useCurrentFrame } from "remotion";
import { BillCard, shake } from "../components";
import { C, CLAMP, FONT, OUT, TRACK } from "../theme";

const N_BILLS = 30;
const BILLS = new Array(N_BILLS).fill(0).map((_, i) => ({
  spawn: i * 1.75,
  x: -120 + random(`x${i}`) * 1000,
  land: 180 + random(`l${i}`) * 900,
  width: 300 + random(`wd${i}`) * 130,
  rot0: (random(`r0${i}`) - 0.5) * 120,
  rot1: (random(`r1${i}`) - 0.5) * 40,
}));

const WORDS = [
  { t: "Every.", at: 0 },
  { t: "Single.", at: 8 },
  { t: "Day.", at: 15 },
];

const BLACKOUT = 54; // matches the silent gap before the drop

export const Chaos: React.FC = () => {
  const frame = useCurrentFrame();
  const intensity = interpolate(frame, [20, BLACKOUT], [0, 1], CLAMP);
  const jitter = shake(frame, Math.floor(frame / 2) * 2, 4 + intensity * 22, 2);

  if (frame >= BLACKOUT) {
    return <AbsoluteFill name="Blackout" style={{ backgroundColor: C.black }} />;
  }

  return (
    <AbsoluteFill name="Chaos" style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <Interactive.Div
        name="BillRain"
        style={{
          position: "absolute",
          inset: 0,
          scale: interpolate(frame, [0, BLACKOUT], [1, 1.18], { ...CLAMP, easing: (t) => t * t }),
          translate: jitter,
        }}
      >
        {BILLS.map((b, i) => {
          const t = frame - b.spawn;
          if (t < 0) return null;
          const fallY = -700 + 0.5 * 3.2 * (t * 4) ** 2 / 4;
          const y = Math.min(b.land, fallY);
          const landed = fallY >= b.land;
          const rot = landed ? b.rot1 : b.rot0 + (b.rot1 - b.rot0) * Math.min(1, (y + 700) / (b.land + 700));
          return (
            <div key={i} style={{ position: "absolute", left: b.x, top: y, rotate: `${rot}deg` }}>
              <BillCard seed={i} width={b.width} />
            </div>
          );
        })}
      </Interactive.Div>

      {/* darkening so type stays readable as the pile grows */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 70%)",
          opacity: interpolate(frame, [0, 10], [0, 1], CLAMP),
        }}
      />

      <Interactive.Div
        name="EverySingleDay"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          fontFamily: FONT,
          letterSpacing: TRACK,
          fontWeight: 700,
          fontSize: 150,
          translate: shake(frame, [...WORDS].reverse().find((w) => frame >= w.at)?.at ?? 0, 12, 4),
        }}
      >
        {WORDS.map((w) => {
          const p = interpolate(frame, [w.at, w.at + 6], [0, 1], { ...CLAMP, easing: OUT });
          return (
            <div
              key={w.t}
              style={{
                background: C.black,
                color: C.white,
                padding: "6px 34px 14px",
                lineHeight: 1,
                opacity: frame >= w.at ? 1 : 0,
                scale: `${1.4 - 0.4 * p}`,
                rotate: `${(1 - p) * (w.at % 2 ? 6 : -6)}deg`,
              }}
            >
              {w.t}
            </div>
          );
        })}
      </Interactive.Div>

      {/* flicker to white on the last frames before blackout: tension */}
      <AbsoluteFill
        style={{
          backgroundColor: C.white,
          opacity: frame >= 48 && frame % 2 === 0 ? 0.08 + intensity * 0.12 : 0,
        }}
      />
    </AbsoluteFill>
  );
};
