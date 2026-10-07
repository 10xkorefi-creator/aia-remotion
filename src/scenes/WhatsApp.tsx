import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, glassLight, GradText, Logo, MaskWord, punch } from "../components";
import { C, CLAMP, FONT, G, OUT, SERIF, SNAP, TRACK } from "../theme";

const ASK = 4;
const TYPING = [12, 23];
const REPLY = 23;

export const WhatsApp: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="WhatsApp" style={{ fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <Backdrop mode="light" phase={400} />
      <AbsoluteFill style={{ scale: `${punch(frame, 0.04)}` }}>
        <Interactive.Div name="Caption" style={{ position: "absolute", left: 80, right: 80, top: 110, fontSize: 104, fontWeight: 600, lineHeight: 1.04 }}>
          <div style={{ color: C.black }}>
            <MaskWord p={interpolate(frame, [0, 11], [0, 1], { ...CLAMP, easing: OUT })}>Ask your books.</MaskWord>
          </div>
          <div style={{ color: C.grey, whiteSpace: "nowrap" }}>
            <MaskWord p={interpolate(frame, [4, 15], [0, 1], { ...CLAMP, easing: OUT })}>
              <span style={{ fontWeight: 500 }}>On </span>
              <GradText gradient={G.lightText} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 124, letterSpacing: "-0.03em" }}>
                WhatsApp.
              </GradText>
            </MaskWord>
          </div>
        </Interactive.Div>

        <Interactive.Div
          name="Chat"
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 410,
            bottom: 110,
            ...glassLight,
            borderRadius: 40,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            translate: interpolate(frame, [0, 14], ["0px 120px", "0px 0px"], { ...CLAMP, easing: OUT }),
            opacity: interpolate(frame, [0, 7], [0, 1], CLAMP),
          }}
        >
          <div style={{ height: 124, display: "flex", alignItems: "center", gap: 20, padding: "0 32px", borderBottom: `1px solid ${C.hair}` }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 999,
                background: `linear-gradient(160deg, ${C.indigo800} 0%, ${C.black} 100%)`,
                boxShadow: "0 8px 20px rgba(10,16,56,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo size={48} inverse />
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.03em" }}>AI Accountant</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, color: C.grey, fontWeight: 500, letterSpacing: "-0.01em" }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: "#22C55E", boxShadow: "0 0 10px 2px rgba(34,197,94,0.5)" }} />
                {frame >= TYPING[0] && frame < TYPING[1] ? "typing…" : "online"}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: 26 }}>
            {/* user question */}
            <div
              style={{
                alignSelf: "flex-end",
                background: G.accent,
                color: C.white,
                fontSize: 46,
                fontWeight: 500,
                padding: "24px 34px 26px",
                borderRadius: "36px 36px 8px 36px",
                boxShadow: "0 20px 40px rgba(49,77,208,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                opacity: frame >= ASK ? 1 : 0,
                scale: interpolate(frame, [ASK, ASK + 10], [0.5, 1], { ...CLAMP, easing: SNAP }),
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
                  borderRadius: "36px 36px 36px 8px",
                  background: "rgba(10,16,56,0.05)",
                  scale: interpolate(frame, [TYPING[0], TYPING[0] + 6], [0.6, 1], { ...CLAMP, easing: SNAP }),
                  transformOrigin: "left bottom",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 99,
                      background: C.accent,
                      opacity: 0.45 + 0.4 * Math.sin((frame - TYPING[0]) * 0.9 - i * 1.1),
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
                  maxWidth: 780,
                  background: "linear-gradient(180deg, #FFFFFF 0%, #F1F3FC 100%)",
                  boxShadow: `0 18px 44px rgba(10,16,56,0.14), 0 0 0 1px ${C.hair}`,
                  padding: "28px 34px",
                  borderRadius: "36px 36px 36px 8px",
                  scale: interpolate(frame, [REPLY, REPLY + 10], [0.5, 1], { ...CLAMP, easing: SNAP }),
                  transformOrigin: "left bottom",
                }}
              >
                <div style={{ fontSize: 50, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.035em" }}>
                  ₹4.2L pending from <GradText gradient={`linear-gradient(100deg, ${C.accent}, ${C.indigo400})`}>12 customers.</GradText>
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: C.grey,
                    fontWeight: 500,
                    marginTop: 14,
                    letterSpacing: "-0.02em",
                    opacity: interpolate(frame, [REPLY + 5, REPLY + 12], [0, 1], CLAMP),
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
