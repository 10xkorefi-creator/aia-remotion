import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Check, shake } from "../components";
import { C, CLAMP, FONT, MONO, OUT, SNAP, TRACK } from "../theme";

const BEATS = [
  { word: "Bills.", label: "PURCHASE BILLS, EVEN HANDWRITTEN", at: 0, bg: C.black, fg: C.white },
  { word: "Bank.", label: "STATEMENTS TO ENTRIES", at: 8, bg: C.white, fg: C.black },
  { word: "GST.", label: "GST BREAKUPS, AUTO-MAPPED", at: 15, bg: C.accent, fg: C.white },
  { word: "Sales.", label: "INVOICES, IN BULK", at: 23, bg: C.black, fg: C.white },
];
const SUMMARY = 30;

export const Modules: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame >= SUMMARY) {
    const f = frame - SUMMARY;
    return (
      <AbsoluteFill
        name="ModulesSummary"
        style={{ backgroundColor: C.white, fontFamily: FONT, letterSpacing: TRACK, alignItems: "center", justifyContent: "center" }}
      >
        <Interactive.Div
          name="Chips"
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 920, marginBottom: 56 }}
        >
          {BEATS.map((b, i) => {
            const p = interpolate(f, [i * 1.2 - 1, i * 1.2 + 4], [0, 1], { ...CLAMP, easing: SNAP });
            return (
              <div
                key={b.word}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 44,
                  fontWeight: 700,
                  padding: "14px 28px 14px 22px",
                  borderRadius: 999,
                  background: C.black,
                  color: C.white,
                  scale: `${0.6 + 0.4 * p}`,
                  opacity: Math.min(1, p * 1.5),
                }}
              >
                <span style={{ width: 40, height: 40, borderRadius: 999, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={30} progress={interpolate(f, [i * 1.5 + 3, i * 1.5 + 9], [0, 1], CLAMP)} />
                </span>
                {b.word.replace(".", "")}
              </div>
            );
          })}
        </Interactive.Div>
        <Interactive.Div
          name="SyncedLine"
          style={{
            fontSize: 104,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.02,
            opacity: interpolate(f, [1, 5], [0, 1], CLAMP),
            translate: interpolate(f, [1, 8], ["0px 40px", "0px 0px"], { ...CLAMP, easing: OUT }),
          }}
        >
          All synced
          <br />
          to Tally.
        </Interactive.Div>
      </AbsoluteFill>
    );
  }

  const cur = [...BEATS].reverse().find((b) => frame >= b.at) ?? BEATS[0];
  const p = interpolate(frame, [cur.at, cur.at + 5], [0, 1], { ...CLAMP, easing: OUT });

  return (
    <AbsoluteFill name="Modules" style={{ backgroundColor: cur.bg, fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      {/* speed streaks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            top: 260 + i * 190,
            height: 6 + (i % 2) * 4,
            width: 1080,
            background: cur.fg,
            opacity: interpolate(frame - cur.at, [0, 4], [0.22, 0], CLAMP),
            translate: `${interpolate(frame - cur.at, [0, 5], [-600 + i * 80, 900], CLAMP)}px 0`,
          }}
        />
      ))}
      <Interactive.Div
        name="Word"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: cur.fg,
          translate: shake(frame, cur.at, 14, 3),
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 32, letterSpacing: "0.04em", opacity: 0.75 * p, marginBottom: 10 }}>{cur.label}</div>
        <div
          style={{
            fontSize: 250,
            fontWeight: 700,
            lineHeight: 0.95,
            scale: `${1.22 - 0.22 * p}`,
            translate: `${(1 - p) * -80}px 0`,
            transformOrigin: "left center",
          }}
        >
          {cur.word}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
