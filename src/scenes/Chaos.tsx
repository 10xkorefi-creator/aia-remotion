import React from "react";
import { AbsoluteFill, Interactive, interpolate, random, useCurrentFrame } from "remotion";
import { Backdrop, BillCard, bump, GradText } from "../components";
import { C, CLAMP, FONT, OUT, SERIF, TRACK } from "../theme";

const N_BILLS = 30;
const BILLS = new Array(N_BILLS).fill(0).map((_, i) => ({
  spawn: i * 1.75,
  x: -120 + random(`x${i}`) * 1000,
  land: 180 + random(`l${i}`) * 900,
  width: 300 + random(`wd${i}`) * 130,
  rot0: (random(`r0${i}`) - 0.5) * 120,
  rot1: (random(`r1${i}`) - 0.5) * 40,
  blur: i % 4 === 0 ? 5 : 0, // a few out-of-focus bills for depth
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

  if (frame >= BLACKOUT) {
    return <AbsoluteFill name="Blackout" style={{ backgroundColor: C.black }} />;
  }

  const lastWord = [...WORDS].reverse().find((w) => frame >= w.at)?.at ?? 0;

  return (
    <AbsoluteFill name="Chaos" style={{ overflow: "hidden" }}>
      <Backdrop mode="dark" phase={60} />

      <Interactive.Div
        name="BillRain"
        style={{
          position: "absolute",
          inset: 0,
          scale: interpolate(frame, [0, BLACKOUT], [1, 1.16], { ...CLAMP, easing: (t) => t * t }),
          // slow handheld sway that builds with the pile instead of a hard jitter
          translate: `${Math.sin(frame / 3) * intensity * 7}px ${Math.cos(frame / 2.3) * intensity * 7}px`,
        }}
      >
        {BILLS.map((b, i) => {
          const t = frame - b.spawn;
          if (t < 0) return null;
          const fallY = -700 + (0.5 * 3.2 * (t * 4) ** 2) / 4;
          const y = Math.min(b.land, fallY);
          const landed = fallY >= b.land;
          const rot = landed ? b.rot1 : b.rot0 + (b.rot1 - b.rot0) * Math.min(1, (y + 700) / (b.land + 700));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x,
                top: y,
                rotate: `${rot}deg`,
                filter: b.blur ? `blur(${b.blur}px) brightness(0.8)` : undefined,
              }}
            >
              <BillCard seed={i} width={b.width} />
            </div>
          );
        })}
      </Interactive.Div>

      {/* cinematic grade: darken the centre so type reads, tint the edges indigo as pressure builds */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(3,4,12,0.78) 0%, rgba(3,4,12,0.25) 62%, rgba(17,26,94,${0.25 + intensity * 0.35}) 100%)`,
          opacity: interpolate(frame, [0, 12], [0, 1], CLAMP),
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
          gap: 6,
          fontFamily: FONT,
          letterSpacing: TRACK,
          fontWeight: 600,
          fontSize: 164,
          scale: bump(frame, lastWord, 0.025, 14),
        }}
      >
        {WORDS.map((w) => {
          const p = interpolate(frame, [w.at, w.at + 12], [0, 1], { ...CLAMP, easing: OUT });
          const isDay = w.t === "Day.";
          return (
            <div
              key={w.t}
              style={{
                color: C.white,
                lineHeight: 1,
                padding: "0 20px",
                opacity: Math.min(1, p * 2.4),
                scale: `${1.18 - 0.18 * p}`,
                translate: `0 ${(1 - p) * 40}px`,
                filter: `blur(${(1 - p) * 12}px)`,
                textShadow: "0 8px 60px rgba(3,4,12,0.9), 0 2px 12px rgba(3,4,12,0.7)",
              }}
            >
              {isDay ? (
                <GradText gradient={`linear-gradient(100deg, #FFFFFF 0%, ${C.indigo200} 45%, ${C.indigo300} 100%)`} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 200, letterSpacing: "-0.03em", filter: "drop-shadow(0 8px 40px rgba(3,4,12,0.9))" }}>
                  {w.t}
                </GradText>
              ) : (
                w.t
              )}
            </div>
          );
        })}
      </Interactive.Div>

      {/* tension pulse on the last frames before blackout */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 55% at 50% 50%, ${C.indigo400} 0%, rgba(0,0,0,0) 75%)`,
          opacity: frame >= 46 ? 0.08 + 0.1 * Math.abs(Math.sin(frame * 1.1)) * intensity : 0,
        }}
      />
    </AbsoluteFill>
  );
};
