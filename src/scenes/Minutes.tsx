import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { MaskWord, shake } from "../components";
import { C, CLAMP, FONT, OUT, SNAP, TRACK } from "../theme";

const STRIKE = 9;
const SLAM = 15;

export const Minutes: React.FC = () => {
  const frame = useCurrentFrame();
  const slam = frame >= SLAM;

  return (
    <AbsoluteFill name="Minutes" style={{ backgroundColor: C.black, fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <Interactive.Div
        name="Lines"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 330,
          color: C.white,
          translate: shake(frame, SLAM, 20, 4),
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.02 }}>
          <MaskWord p={interpolate(frame, [0, 6], [0, 1], { ...CLAMP, easing: OUT })}>Accounting</MaskWord>
        </div>
        <div style={{ fontSize: 70, fontWeight: 500, color: C.grey, marginTop: 8 }}>
          <MaskWord p={interpolate(frame, [2, 8], [0, 1], { ...CLAMP, easing: OUT })}>done for you in</MaskWord>
        </div>

        <div style={{ position: "relative", height: 260, marginTop: 30 }}>
          {/* hours. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              fontSize: 210,
              fontWeight: 700,
              color: C.grey,
              lineHeight: 1,
              opacity: slam ? 0.45 : interpolate(frame, [4, 8], [0, 1], CLAMP),
              translate: slam
                ? interpolate(frame, [SLAM, SLAM + 8], ["0px 0px", "0px 250px"], { ...CLAMP, easing: OUT })
                : "0px 0px",
              scale: slam ? `${interpolate(frame, [SLAM, SLAM + 8], [1, 0.55], { ...CLAMP, easing: OUT })}` : "1",
              transformOrigin: "left top",
            }}
          >
            hours.
            <div
              style={{
                position: "absolute",
                left: -10,
                top: "52%",
                height: 18,
                width: `${interpolate(frame, [STRIKE, STRIKE + 4], [0, 108], { ...CLAMP, easing: OUT })}%`,
                background: C.accent,
                borderRadius: 9,
                rotate: "-4deg",
              }}
            />
          </div>

          {/* minutes. */}
          {slam ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                fontSize: 210,
                fontWeight: 700,
                lineHeight: 1,
                color: C.white,
                scale: `${interpolate(frame, [SLAM, SLAM + 6], [1.6, 1], { ...CLAMP, easing: SNAP })}`,
                transformOrigin: "left center",
                filter: `blur(${interpolate(frame, [SLAM, SLAM + 3], [10, 0], CLAMP)}px)`,
              }}
            >
              minutes.
            </div>
          ) : null}
        </div>
      </Interactive.Div>

      <AbsoluteFill style={{ backgroundColor: C.white, opacity: interpolate(frame, [SLAM, SLAM + 3], [0.35, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
