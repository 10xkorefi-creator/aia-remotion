import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Logo, MaskWord, shake } from "../components";
import { C, CLAMP, FONT, OUT, SNAP, TRACK } from "../theme";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="EndCard" style={{ backgroundColor: C.white, fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: shake(frame, 0, 14, 4), scale: interpolate(frame, [0, 45], [1.04, 1], { ...CLAMP, easing: OUT }) }}>
        <Interactive.Div
          name="Logo"
          style={{
            position: "absolute",
            left: 540,
            top: 430,
            translate: "-50% -50%",
            scale: interpolate(frame, [0, 12], [0.2, 1], { ...CLAMP, easing: SNAP, output: "perceptual-scale" }),
            rotate: interpolate(frame, [0, 12], ["30deg", "0deg"], { ...CLAMP, easing: SNAP }),
          }}
        >
          <Logo size={250} />
        </Interactive.Div>

        <Interactive.Div name="Wordmark" style={{ position: "absolute", left: 80, right: 80, top: 640, textAlign: "center" }}>
          <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.05, color: C.black }}>
            <MaskWord p={interpolate(frame, [4, 12], [0, 1], { ...CLAMP, easing: OUT })}>AI Accountant</MaskWord>
          </div>
          <div style={{ fontSize: 48, fontWeight: 500, color: C.grey, marginTop: 18 }}>
            <MaskWord p={interpolate(frame, [9, 17], [0, 1], { ...CLAMP, easing: OUT })}>Built for TallyPrime</MaskWord>
          </div>
        </Interactive.Div>

        <Interactive.Div
          name="URL"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1060,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: C.white,
              background: C.accent,
              borderRadius: 999,
              padding: "22px 48px 26px",
              scale: `${interpolate(frame, [13, 21], [0.6, 1], { ...CLAMP, easing: SNAP })}`,
              opacity: interpolate(frame, [13, 17], [0, 1], CLAMP),
            }}
          >
            aiaccountant.com
          </div>
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.accent, opacity: interpolate(frame, [0, 3], [0.6, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
