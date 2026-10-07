import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Logo, MaskWord, shake } from "../components";
import { C, CLAMP, FONT, OUT, SNAP, TRACK } from "../theme";

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Reveal" style={{ backgroundColor: C.white, fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      {/* shockwave rings from the drop */}
      {[0, 5].map((d) => (
        <div
          key={d}
          style={{
            position: "absolute",
            left: 540,
            top: 520,
            width: interpolate(frame, [d, d + 22], [40, 1700], { ...CLAMP, easing: OUT }),
            height: interpolate(frame, [d, d + 22], [40, 1700], { ...CLAMP, easing: OUT }),
            borderRadius: "50%",
            border: `${interpolate(frame, [d, d + 22], [22, 2], CLAMP)}px solid ${C.accent}`,
            boxSizing: "border-box",
            translate: "-50% -50%",
            opacity: interpolate(frame, [d, d + 22], [d ? 0.35 : 0.9, 0], CLAMP),
          }}
        />
      ))}

      <AbsoluteFill
        style={{
          translate: shake(frame, 0, 18, 5),
          scale: interpolate(frame, [0, 45], [1, 1.06], CLAMP),
        }}
      >
        <Interactive.Div
          name="Logo"
          style={{
            position: "absolute",
            left: 540,
            top: 520,
            translate: "-50% -50%",
            scale: interpolate(frame, [0, 14], [0.3, 1], { ...CLAMP, easing: SNAP, output: "perceptual-scale" }),
            rotate: interpolate(frame, [0, 14], ["-25deg", "0deg"], { ...CLAMP, easing: SNAP }),
          }}
        >
          <Logo size={300} />
        </Interactive.Div>

        <Interactive.Div
          name="Headline"
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 760,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 500, color: C.grey, lineHeight: 1.1 }}>
            <MaskWord p={interpolate(frame, [5, 13], [0, 1], { ...CLAMP, easing: OUT })}>Meet your new</MaskWord>
          </div>
          <div style={{ fontSize: 112, fontWeight: 700, color: C.black, lineHeight: 1.04, marginTop: 6, whiteSpace: "nowrap" }}>
            <MaskWord p={interpolate(frame, [10, 18], [0, 1], { ...CLAMP, easing: OUT })}>AI</MaskWord>{" "}
            <MaskWord p={interpolate(frame, [13, 21], [0, 1], { ...CLAMP, easing: OUT })}>Accountant.</MaskWord>
          </div>
        </Interactive.Div>
      </AbsoluteFill>

      {/* white flash on the drop frame */}
      <AbsoluteFill style={{ backgroundColor: C.accent, opacity: interpolate(frame, [0, 3], [0.9, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
