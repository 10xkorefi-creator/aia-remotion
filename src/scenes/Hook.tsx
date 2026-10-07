import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { shake } from "../components";
import { C, CLAMP, FONT, MONO, OUT, TRACK } from "../theme";

// word slams land on the audio hits
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

  return (
    <AbsoluteFill name="Hook" style={{ backgroundColor: C.black, fontFamily: FONT, letterSpacing: TRACK }}>
      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          left: 90,
          top: 290,
          right: 90,
          color: C.white,
          fontWeight: 700,
          fontSize: 176,
          lineHeight: 0.98,
          translate: shake(frame, lastHit, 10, 4),
          scale: interpolate(frame, [lastHit, lastHit + 6], [1.035, 1], { ...CLAMP, easing: OUT }),
          transformOrigin: "left center",
        }}
      >
        {[0, 1, 2].map((line) => (
          <div key={line} style={{ display: "flex", gap: 36, alignItems: "baseline" }}>
            {WORDS.filter((w) => w.line === line).map((w) => {
              const p = interpolate(frame, [w.at, w.at + 5], [0, 1], { ...CLAMP, easing: OUT });
              return (
                <span
                  key={w.text}
                  style={{
                    display: "inline-block",
                    opacity: frame >= w.at ? 1 : 0,
                    scale: `${1.3 - 0.3 * p}`,
                    translate: `0 ${(1 - p) * 40}px`,
                    filter: `blur(${(1 - p) * 8}px)`,
                  }}
                >
                  {w.text}
                </span>
              );
            })}
            {line === 2 && frame >= 30 ? (
              <span
                style={{
                  display: "inline-block",
                  width: 22,
                  height: 160,
                  background: C.accent,
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
          bottom: 250,
          opacity: interpolate(frame, [28, 34], [0, 1], CLAMP),
          translate: interpolate(frame, [28, 36], ["0px 30px", "0px 0px"], { ...CLAMP, easing: OUT }),
        }}
      >
        <div style={{ color: C.grey, fontSize: 30, fontWeight: 500, marginBottom: 16, letterSpacing: "0.02em" }}>
          VOUCHER {Math.floor(interpolate(frame, [32, 60], [37, 412], CLAMP))} OF 412
        </div>
        <div
          style={{
            border: `2px solid rgba(255,255,255,0.18)`,
            borderRadius: 14,
            padding: "26px 28px",
            fontFamily: MONO,
            fontSize: 34,
            color: "rgba(255,255,255,0.85)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            letterSpacing: 0,
          }}
        >
          {TYPED.slice(Math.max(0, typedChars - 34), typedChars)}
          <span style={{ display: "inline-block", width: 16, height: 38, marginLeft: 4, verticalAlign: "middle", background: C.white, opacity: caretOn ? 1 : 0 }} />
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
