import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Logo, MaskWord, punch } from "../components";
import { C, CLAMP, FONT, OUT, SNAP, TRACK } from "../theme";

const ASK = 4;
const TYPING = [12, 23];
const REPLY = 23;

export const WhatsApp: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="WhatsApp" style={{ backgroundColor: C.white, fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: `${punch(frame, 0.05)}` }}>
        <Interactive.Div name="Caption" style={{ position: "absolute", left: 80, right: 80, top: 110, fontSize: 100, fontWeight: 700, lineHeight: 1.04 }}>
          <div style={{ color: C.black }}>
            <MaskWord p={interpolate(frame, [0, 7], [0, 1], { ...CLAMP, easing: OUT })}>Ask your books.</MaskWord>
          </div>
          <div style={{ color: C.grey }}>
            <MaskWord p={interpolate(frame, [4, 11], [0, 1], { ...CLAMP, easing: OUT })}>On WhatsApp.</MaskWord>
          </div>
        </Interactive.Div>

        <Interactive.Div
          name="Chat"
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 400,
            bottom: 110,
            borderRadius: 36,
            boxShadow: "0 30px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            translate: interpolate(frame, [0, 10], ["0px 120px", "0px 0px"], { ...CLAMP, easing: OUT }),
            opacity: interpolate(frame, [0, 5], [0, 1], CLAMP),
          }}
        >
          <div style={{ height: 120, display: "flex", alignItems: "center", gap: 20, padding: "0 32px", borderBottom: `1px solid ${C.hair}` }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Logo size={48} inverse />
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 700 }}>AI Accountant</div>
              <div style={{ fontSize: 24, color: C.grey, fontWeight: 500 }}>
                {frame >= TYPING[0] && frame < TYPING[1] ? "typing…" : "online"}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: 26 }}>
            {/* user question */}
            <div
              style={{
                alignSelf: "flex-end",
                background: C.accent,
                color: C.white,
                fontSize: 46,
                fontWeight: 500,
                padding: "24px 32px",
                borderRadius: "34px 34px 8px 34px",
                opacity: frame >= ASK ? 1 : 0,
                scale: interpolate(frame, [ASK, ASK + 7], [0.5, 1], { ...CLAMP, easing: SNAP }),
                transformOrigin: "right bottom",
              }}
            >
              Who owes me money?
            </div>

            {/* typing dots */}
            {frame >= TYPING[0] && frame < TYPING[1] ? (
              <div
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  gap: 10,
                  padding: "28px 30px",
                  borderRadius: "34px 34px 34px 8px",
                  background: "rgba(0,0,0,0.05)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 99,
                      background: C.grey,
                      translate: `0 ${Math.sin((frame - TYPING[0]) * 0.9 - i * 1.1) * 6}px`,
                    }}
                  />
                ))}
              </div>
            ) : null}

            {/* reply */}
            {frame >= REPLY ? (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: 760,
                  background: "rgba(0,0,0,0.05)",
                  padding: "28px 32px",
                  borderRadius: "34px 34px 34px 8px",
                  scale: interpolate(frame, [REPLY, REPLY + 7], [0.5, 1], { ...CLAMP, easing: SNAP }),
                  transformOrigin: "left bottom",
                }}
              >
                <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.12 }}>
                  ₹4.2L pending from <span style={{ color: C.accent }}>12 customers.</span>
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: C.grey,
                    fontWeight: 500,
                    marginTop: 14,
                    opacity: interpolate(frame, [REPLY + 5, REPLY + 10], [0, 1], CLAMP),
                  }}
                >
                  Top: Mehta Traders, ₹1.1L, 45 days overdue
                </div>
              </div>
            ) : null}
          </div>
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
