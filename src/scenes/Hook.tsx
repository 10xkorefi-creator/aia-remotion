import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, bump, GradText } from "../components";
import { C, CLAMP, FONT, G, MONO, OUT, SERIF, TRACK } from "../theme";

// word arrivals land on the audio hits
const WORDS: { text: string; at: number; line: number }[] = [
  { text: "Still", at: 0, line: 0 },
  { text: "typing", at: 7, line: 0 },
  { text: "bills", at: 15, line: 1 },
  { text: "into", at: 22, line: 1 },
  { text: "Tally?", at: 30, line: 2 },
];

const TYPED = "Sharma Traders  ₹12,480  CGST 9%  SGST 9%  Purchase A/c  Narr: bill 831…";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const lastHit = [...WORDS].reverse().find((w) => frame >= w.at)?.at ?? 0;
  const typedChars = Math.floor(interpolate(frame, [32, 60], [0, TYPED.length], { ...CLAMP, easing: (t) => t * t }));
  const caretOn = Math.floor(frame / 4) % 2 === 0;
  const voucher = Math.floor(interpolate(frame, [32, 60], [37, 412], CLAMP));
  const progress = interpolate(frame, [32, 60], [0.09, 1], { ...CLAMP, easing: (t) => t * t });

  return (
    <AbsoluteFill name="Hook" style={{ fontFamily: FONT, letterSpacing: TRACK }}>
      <Backdrop mode="dark" phase={0} />

      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          left: 90,
          top: 290,
          right: 90,
          color: C.white,
          fontWeight: 600,
          fontSize: 176,
          lineHeight: 0.98,
          scale: bump(frame, lastHit, 0.02, 14),
          transformOrigin: "left center",
        }}
      >
        {[0, 1, 2].map((line) => (
          <div key={line} style={{ display: "flex", gap: 36, alignItems: "baseline" }}>
            {WORDS.filter((w) => w.line === line).map((w) => {
              const p = interpolate(frame, [w.at, w.at + 12], [0, 1], { ...CLAMP, easing: OUT });
              const isTally = w.text === "Tally?";
              return (
                <span
                  key={w.text}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, p * 2.2),
                    scale: `${1.12 - 0.12 * p}`,
                    translate: `0 ${(1 - p) * 56}px`,
                    filter: `blur(${(1 - p) * 14}px)`,
                  }}
                >
                  {isTally ? (
                    <GradText style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 208, letterSpacing: "-0.03em" }}>
                      {w.text}
                    </GradText>
                  ) : (
                    w.text
                  )}
                </span>
              );
            })}
            {line === 2 && frame >= 30 ? (
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 150,
                  borderRadius: 6,
                  background: G.accent,
                  boxShadow: `0 0 40px 6px rgba(72,100,240,0.7)`,
                  opacity: caretOn ? 1 : 0,
                  alignSelf: "center",
                }}
              />
            ) : null}
          </div>
        ))}
      </Interactive.Div>

      <Interactive.Div
        name="TypingField"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 230,
          opacity: interpolate(frame, [28, 38], [0, 1], CLAMP),
          translate: interpolate(frame, [28, 42], ["0px 40px", "0px 0px"], { ...CLAMP, easing: OUT }),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: MONO, color: C.indigo300, fontSize: 26, fontWeight: 500, letterSpacing: "0.08em" }}>
            VOUCHER {voucher} OF 412
          </div>
          <div style={{ fontFamily: MONO, color: "rgba(255,255,255,0.45)", fontSize: 26, letterSpacing: "0.04em" }}>
            {Math.round(progress * 100)}%
          </div>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 26, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, borderRadius: 3, background: G.accent, boxShadow: "0 0 24px rgba(72,100,240,0.9)" }} />
        </div>
        <div
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
            border: "1.5px solid rgba(255,255,255,0.14)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.14)",
            borderRadius: 22,
            padding: "28px 30px",
            fontFamily: MONO,
            fontSize: 32,
            color: "rgba(255,255,255,0.88)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            letterSpacing: 0,
          }}
        >
          {TYPED.slice(Math.max(0, typedChars - 36), typedChars)}
          <span style={{ display: "inline-block", width: 14, height: 36, marginLeft: 4, verticalAlign: "middle", borderRadius: 3, background: C.indigo300, opacity: caretOn ? 1 : 0 }} />
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
