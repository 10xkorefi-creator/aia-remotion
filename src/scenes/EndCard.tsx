import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Bloom, bump, Logo, MaskWord, Motes } from "../components";
import { C, CLAMP, FONT, OUT, SERIF, SNAP, TRACK } from "../theme";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  // shimmer sweep across the CTA once it lands
  const shine = interpolate(frame, [20, 38], [-40, 140], { ...CLAMP, easing: OUT });

  return (
    <AbsoluteFill name="EndCard" style={{ fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <Backdrop mode="accent" phase={600} />
      <Motes count={20} color={C.indigo200} seed="ec" speed={0.8} />

      <AbsoluteFill style={{ scale: bump(frame, 0, 0.03, 20) * interpolate(frame, [0, 45], [1.0, 1.03], CLAMP) }}>
        {/* glow behind the mark */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 430,
            width: 800,
            height: 800,
            translate: "-50% -50%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(211,218,255,0.55) 0%, rgba(163,177,255,0.2) 42%, rgba(0,0,0,0) 70%)",
            opacity: interpolate(frame, [0, 16], [0, 1], CLAMP),
          }}
        />
        <Interactive.Div
          name="Logo"
          style={{
            position: "absolute",
            left: 540,
            top: 430,
            translate: "-50% -50%",
            scale: interpolate(frame, [0, 16], [0.3, 1], { ...CLAMP, easing: SNAP, output: "perceptual-scale" }),
            rotate: interpolate(frame, [0, 16], ["24deg", "0deg"], { ...CLAMP, easing: SNAP }),
            filter: "drop-shadow(0 24px 50px rgba(5,8,24,0.45))",
          }}
        >
          <Logo size={250} inverse />
        </Interactive.Div>

        <Interactive.Div name="Wordmark" style={{ position: "absolute", left: 80, right: 80, top: 640, textAlign: "center" }}>
          <div style={{ fontSize: 124, fontWeight: 600, lineHeight: 1.05, color: C.white }}>
            <MaskWord p={interpolate(frame, [4, 16], [0, 1], { ...CLAMP, easing: OUT })}>AI Accountant</MaskWord>
          </div>
          <div style={{ fontSize: 56, fontWeight: 400, color: "rgba(255,255,255,0.75)", marginTop: 18, letterSpacing: "-0.03em" }}>
            <MaskWord p={interpolate(frame, [9, 21], [0, 1], { ...CLAMP, easing: OUT })}>
              Built for{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 68, color: C.white, letterSpacing: "-0.02em" }}>TallyPrime</span>
            </MaskWord>
          </div>
        </Interactive.Div>

        <Interactive.Div name="URL" style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              fontSize: 56,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              color: C.black,
              background: "linear-gradient(180deg, #FFFFFF 0%, #E4E8FF 100%)",
              borderRadius: 999,
              padding: "22px 52px 26px",
              boxShadow: "0 28px 70px rgba(5,8,24,0.5), 0 0 60px rgba(163,177,255,0.45), inset 0 2px 0 #fff",
              scale: `${interpolate(frame, [13, 25], [0.6, 1], { ...CLAMP, easing: SNAP })}`,
              opacity: interpolate(frame, [13, 19], [0, 1], CLAMP),
            }}
          >
            aiaccountant.com
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(105deg, rgba(255,255,255,0) ${shine - 16}%, rgba(255,255,255,0.95) ${shine}%, rgba(255,255,255,0) ${shine + 16}%)`,
                mixBlendMode: "soft-light",
              }}
            />
          </div>
        </Interactive.Div>
      </AbsoluteFill>

      <Bloom at={0} color={C.indigo200} strength={0.7} dur={16} x={50} y={32} />
    </AbsoluteFill>
  );
};
