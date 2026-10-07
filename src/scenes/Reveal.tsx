import React from "react";
import { AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop, Bloom, bump, GradText, Logo, MaskWord, Motes } from "../components";
import { C, CLAMP, FONT, G, OUT, SERIF, SNAP, TRACK } from "../theme";

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const halo = interpolate(frame, [0, 20], [0.2, 1], { ...CLAMP, easing: OUT });
  // light sweep that glints across the logo right after it lands
  const sweep = interpolate(frame, [8, 26], [-60, 160], { ...CLAMP, easing: OUT });

  return (
    <AbsoluteFill name="Reveal" style={{ fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <Backdrop mode="light" phase={120} lift={6} />
      <Motes count={16} color={C.indigo400} seed="rv" speed={0.7} />

      {/* shockwave rings from the drop */}
      {[0, 5].map((d) => {
        const size = interpolate(frame, [d, d + 28], [60, 1800], { ...CLAMP, easing: OUT });
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: 540,
              top: 520,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `${interpolate(frame, [d, d + 28], [18, 1.5], CLAMP)}px solid ${d ? C.indigo400 : C.accent}`,
              boxSizing: "border-box",
              translate: "-50% -50%",
              opacity: interpolate(frame, [d, d + 28], [d ? 0.3 : 0.7, 0], CLAMP),
            }}
          />
        );
      })}

      <AbsoluteFill style={{ scale: bump(frame, 0, 0.03, 18) * interpolate(frame, [0, 45], [1, 1.04], CLAMP) }}>
        {/* halo behind the mark */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 520,
            width: 760,
            height: 760,
            translate: "-50% -50%",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(72,100,240,0.38) 0%, rgba(111,134,255,0.16) 40%, rgba(0,0,0,0) 70%)`,
            scale: halo,
            opacity: halo,
          }}
        />
        <Interactive.Div
          name="Logo"
          style={{
            position: "absolute",
            left: 540,
            top: 520,
            translate: "-50% -50%",
            scale: interpolate(frame, [0, 16], [0.4, 1], { ...CLAMP, easing: SNAP, output: "perceptual-scale" }),
            rotate: interpolate(frame, [0, 16], ["-18deg", "0deg"], { ...CLAMP, easing: SNAP }),
            filter: "drop-shadow(0 30px 50px rgba(49,77,208,0.35))",
          }}
        >
          <Logo size={300} />
          {/* glint, masked to the mark's own silhouette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `url(${staticFile("ai-accountant-a-star.svg")})`,
              maskImage: `url(${staticFile("ai-accountant-a-star.svg")})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 14}%, rgba(163,177,255,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 14}%)`,
            }}
          />
        </Interactive.Div>

        <Interactive.Div name="Headline" style={{ position: "absolute", left: 80, right: 80, top: 760, textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 500, color: C.grey, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            <MaskWord p={interpolate(frame, [5, 17], [0, 1], { ...CLAMP, easing: OUT })}>Meet your new</MaskWord>
          </div>
          <div style={{ fontSize: 118, fontWeight: 600, lineHeight: 1.04, marginTop: 8, whiteSpace: "nowrap" }}>
            <MaskWord p={interpolate(frame, [10, 22], [0, 1], { ...CLAMP, easing: OUT })}>
              <GradText gradient={G.lightText}>AI</GradText>
            </MaskWord>{" "}
            <MaskWord p={interpolate(frame, [13, 25], [0, 1], { ...CLAMP, easing: OUT })}>
              <GradText gradient={`linear-gradient(100deg, ${C.indigo900} 0%, ${C.accent} 70%, ${C.indigo400} 100%)`} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 138, letterSpacing: "-0.03em" }}>
                Accountant.
              </GradText>
            </MaskWord>
          </div>
        </Interactive.Div>
      </AbsoluteFill>

      <Bloom at={0} color={C.indigo400} strength={0.85} dur={14} x={50} y={39} />
    </AbsoluteFill>
  );
};
