import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Bloom, bump, GradText, MaskWord, Motes } from "../components";
import { C, CLAMP, FONT, G, OUT, SERIF, SNAP, TRACK } from "../theme";

const STRIKE = 9;
const SLAM = 15;

export const Minutes: React.FC = () => {
  const frame = useCurrentFrame();
  const slam = frame >= SLAM;

  return (
    <AbsoluteFill name="Minutes" style={{ fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <Backdrop mode="dark" phase={500} lift={slam ? 10 : 0} />
      <Motes count={14} color={C.indigo300} seed="mi" speed={slam ? 2 : 0.8} />

      <Interactive.Div
        name="Lines"
        style={{ position: "absolute", left: 80, right: 80, top: 330, color: C.white, scale: bump(frame, SLAM, 0.03, 16), transformOrigin: "left center" }}
      >
        <div style={{ fontSize: 124, fontWeight: 600, lineHeight: 1.02 }}>
          <MaskWord p={interpolate(frame, [0, 10], [0, 1], { ...CLAMP, easing: OUT })}>Accounting</MaskWord>
        </div>
        <div style={{ fontSize: 70, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginTop: 8, letterSpacing: "-0.035em" }}>
          <MaskWord p={interpolate(frame, [2, 12], [0, 1], { ...CLAMP, easing: OUT })}>done for you in</MaskWord>
        </div>

        <div style={{ position: "relative", height: 280, marginTop: 30 }}>
          {/* hours. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              fontSize: 210,
              fontWeight: 600,
              color: C.white,
              lineHeight: 1,
              opacity: slam ? 0.28 : interpolate(frame, [4, 10], [0, 0.55], CLAMP),
              translate: slam ? interpolate(frame, [SLAM, SLAM + 12], ["0px 0px", "0px 260px"], { ...CLAMP, easing: OUT }) : "0px 0px",
              scale: slam ? `${interpolate(frame, [SLAM, SLAM + 12], [1, 0.55], { ...CLAMP, easing: OUT })}` : "1",
              transformOrigin: "left top",
              filter: slam ? `blur(${interpolate(frame, [SLAM, SLAM + 12], [0, 3], CLAMP)}px)` : undefined,
            }}
          >
            hours.
            <div
              style={{
                position: "absolute",
                left: -10,
                top: "52%",
                height: 16,
                width: `${interpolate(frame, [STRIKE, STRIKE + 6], [0, 108], { ...CLAMP, easing: OUT })}%`,
                background: G.accent,
                boxShadow: "0 0 30px 6px rgba(72,100,240,0.6)",
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
                lineHeight: 1,
                scale: `${interpolate(frame, [SLAM, SLAM + 10], [1.4, 1], { ...CLAMP, easing: SNAP })}`,
                transformOrigin: "left center",
                filter: `blur(${interpolate(frame, [SLAM, SLAM + 6], [14, 0], CLAMP)}px) drop-shadow(0 0 50px rgba(72,100,240,0.55))`,
              }}
            >
              <GradText gradient={G.accentText} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 270, letterSpacing: "-0.03em" }}>
                minutes.
              </GradText>
            </div>
          ) : null}
        </div>
      </Interactive.Div>

      <Bloom at={SLAM} color={C.indigo400} strength={0.6} dur={18} x={45} y={62} />
    </AbsoluteFill>
  );
};
