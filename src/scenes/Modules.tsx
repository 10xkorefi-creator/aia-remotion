import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Bloom, bump, Check, GradText, Motes } from "../components";
import { C, CLAMP, FONT, G, MONO, OUT, SERIF, SNAP, TRACK } from "../theme";

type Mode = "dark" | "light" | "accent";

const BEATS: { word: string; label: string; at: number; mode: Mode; dark: boolean }[] = [
  { word: "Bills.", label: "PURCHASE BILLS, EVEN HANDWRITTEN", at: 0, mode: "dark", dark: true },
  { word: "Bank.", label: "STATEMENTS TO ENTRIES", at: 8, mode: "light", dark: false },
  { word: "GST.", label: "GST BREAKUPS, AUTO-MAPPED", at: 15, mode: "accent", dark: true },
  { word: "Sales.", label: "INVOICES, IN BULK", at: 23, mode: "dark", dark: true },
];
const SUMMARY = 30;

export const Modules: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame >= SUMMARY) {
    const f = frame - SUMMARY;
    return (
      <AbsoluteFill name="ModulesSummary" style={{ fontFamily: FONT, letterSpacing: TRACK, alignItems: "center", justifyContent: "center" }}>
        <Backdrop mode="light" phase={300} />
        <Interactive.Div
          name="Chips"
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 920, marginBottom: 56 }}
        >
          {BEATS.map((b, i) => {
            const p = interpolate(f, [i * 1.2 - 1, i * 1.2 + 7], [0, 1], { ...CLAMP, easing: SNAP });
            return (
              <div
                key={b.word}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 44,
                  fontWeight: 600,
                  padding: "14px 30px 14px 22px",
                  borderRadius: 999,
                  background: "linear-gradient(180deg, #1B1F3A 0%, #05060F 100%)",
                  color: C.white,
                  boxShadow: "0 16px 40px rgba(10,16,56,0.28), inset 0 1px 0 rgba(255,255,255,0.16)",
                  scale: `${0.6 + 0.4 * p}`,
                  opacity: Math.min(1, p * 1.5),
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: G.accent,
                    boxShadow: "0 0 18px rgba(72,100,240,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={30} progress={interpolate(f, [i * 1.5 + 3, i * 1.5 + 11], [0, 1], CLAMP)} />
                </span>
                {b.word.replace(".", "")}
              </div>
            );
          })}
        </Interactive.Div>
        <Interactive.Div
          name="SyncedLine"
          style={{
            fontSize: 112,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.02,
            opacity: interpolate(f, [1, 8], [0, 1], CLAMP),
            translate: interpolate(f, [1, 12], ["0px 44px", "0px 0px"], { ...CLAMP, easing: OUT }),
            filter: `blur(${interpolate(f, [1, 9], [10, 0], CLAMP)}px)`,
          }}
        >
          <GradText gradient={G.lightText}>All synced</GradText>
          <br />
          <GradText gradient={G.lightText}>to </GradText>
          <GradText gradient={`linear-gradient(100deg, ${C.accent} 0%, ${C.indigo400} 100%)`} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 134, letterSpacing: "-0.03em" }}>
            Tally.
          </GradText>
        </Interactive.Div>
        <Bloom at={0} color={C.indigo400} strength={0.35} dur={14} />
      </AbsoluteFill>
    );
  }

  const cur = [...BEATS].reverse().find((b) => frame >= b.at) ?? BEATS[0];
  const p = interpolate(frame, [cur.at, cur.at + 10], [0, 1], { ...CLAMP, easing: OUT });
  const fg = cur.dark ? C.white : C.black;

  return (
    <AbsoluteFill name="Modules" style={{ fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <Backdrop mode={cur.mode} phase={cur.at * 9} />
      {cur.dark ? <Motes count={10} color={C.indigo300} seed={`mo${cur.at}`} speed={1.4} /> : null}

      {/* soft light streaks sweep through on every beat */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            top: 260 + i * 190,
            height: 4 + (i % 2) * 6,
            width: 1300,
            borderRadius: 6,
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${cur.dark ? C.indigo300 : C.indigo400} 60%, rgba(255,255,255,0) 100%)`,
            opacity: interpolate(frame - cur.at, [0, 8], [0.5, 0], CLAMP),
            translate: `${interpolate(frame - cur.at, [0, 9], [-1300 + i * 60, 900], { ...CLAMP, easing: OUT })}px 0`,
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
          color: fg,
          scale: bump(frame, cur.at, 0.02, 12),
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: "0.08em",
            opacity: p,
            marginBottom: 18,
            padding: "10px 20px",
            borderRadius: 999,
            background: cur.dark ? "rgba(255,255,255,0.1)" : "rgba(49,77,208,0.08)",
            border: `1.5px solid ${cur.dark ? "rgba(255,255,255,0.2)" : "rgba(49,77,208,0.2)"}`,
            color: cur.dark ? C.white : C.accent,
          }}
        >
          {cur.label}
        </div>
        <div
          style={{
            fontSize: 262,
            fontWeight: 600,
            lineHeight: 0.98,
            scale: `${1.14 - 0.14 * p}`,
            translate: `${(1 - p) * -90}px 0`,
            filter: `blur(${(1 - p) * 16}px)`,
            transformOrigin: "left center",
            opacity: Math.min(1, 0.35 + p * 2),
          }}
        >
          {cur.dark ? (
            <GradText gradient={G.silverText}>{cur.word}</GradText>
          ) : (
            <GradText gradient={G.lightText}>{cur.word}</GradText>
          )}
        </div>
      </Interactive.Div>

      <Bloom at={cur.at} color={cur.mode === "accent" ? C.indigo200 : C.indigo400} strength={0.5} dur={12} x={30} y={50} />
    </AbsoluteFill>
  );
};
