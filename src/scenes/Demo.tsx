import React from "react";
import { AbsoluteFill, Interactive, interpolate, random, useCurrentFrame } from "remotion";
import { BillCard, Check, Cursor, MaskWord, punch } from "../components";
import { C, CLAMP, FONT, IN_OUT, MONO, OUT, SNAP, TRACK } from "../theme";

const ROWS: { k: string; v: string; ai?: boolean }[] = [
  { k: "Vendor", v: "Sharma Traders" },
  { k: "GSTIN", v: "09AAACS4821F1Z5" },
  { k: "Invoice no.", v: "ST/26-27/0831" },
  { k: "Taxable value", v: "₹40,898" },
  { k: "CGST 9%", v: "₹3,681" },
  { k: "SGST 9%", v: "₹3,681" },
  { k: "Ledger", v: "Purchase @18%", ai: true },
];
const ROW_AT = (i: number) => 38 + i * 4; // ticks in the soundtrack
const ROW_H = 76;
const PANEL = { left: 528, top: 330, width: 472 };
const BILL = { left: 80, top: 352, width: 420 };
const CLICK = 87;

const CAPTIONS = [
  { step: "01", text: "Snap a bill.", from: 0, to: 34 },
  { step: "02", text: "AI reads it.", from: 34, to: 86 },
  { step: "03", text: "Posted to Tally.", from: 86, to: 999 },
];

// beams: bill field y -> panel row index
const BEAMS = [
  { y: 452, row: 0 },
  { y: 498, row: 1 },
  { y: 862, row: 3 },
];

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [10, 36], [0, 1], { ...CLAMP, easing: IN_OUT });
  const posted = frame >= CLICK + 2;

  return (
    <AbsoluteFill name="Demo" style={{ backgroundColor: C.white, fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: `${punch(frame, 0.05) * interpolate(frame, [95, 120], [1, 1.04], { ...CLAMP, easing: IN_OUT })}`,
        }}
      >
        {/* captions */}
        <Interactive.Div name="Captions" style={{ position: "absolute", left: 80, right: 80, top: 100, height: 200 }}>
          {CAPTIONS.map((c) => {
            if (frame < c.from - 1 || frame >= c.to + 6) return null;
            const pin = interpolate(frame, [c.from, c.from + 8], [0, 1], { ...CLAMP, easing: OUT });
            const pout = interpolate(frame, [c.to, c.to + 6], [0, 1], { ...CLAMP, easing: OUT });
            return (
              <div key={c.step} style={{ position: "absolute", inset: 0, opacity: 1 - pout, translate: `0 ${-pout * 40}px` }}>
                <div style={{ fontFamily: MONO, fontSize: 30, color: C.grey, letterSpacing: "0.04em", opacity: pin }}>
                  STEP {c.step}
                </div>
                <div style={{ fontSize: 96, fontWeight: 700, color: C.black, lineHeight: 1.1, marginTop: 4 }}>
                  <MaskWord p={pin}>{c.text}</MaskWord>
                </div>
              </div>
            );
          })}
        </Interactive.Div>

        {/* the bill */}
        <Interactive.Div
          name="Bill"
          style={{
            position: "absolute",
            left: BILL.left,
            top: BILL.top,
            translate: interpolate(frame, [0, 12], ["-620px 60px", "0px 0px"], { ...CLAMP, easing: OUT }),
            rotate: interpolate(frame, [0, 12], ["-14deg", "-2deg"], { ...CLAMP, easing: SNAP }),
          }}
        >
          <BillCard
            seed={831}
            width={BILL.width}
            vendor="Sharma Traders"
            gstin="09AAACS4821F1Z5"
            total="₹48,260"
            highlight={frame >= 10 ? scan : -1}
            style={{ boxShadow: "0 30px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)" }}
          />
          {/* scan beam */}
          {frame >= 10 && frame <= 40 ? (
            <>
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  right: -20,
                  top: scan * BILL.width * 1.33 - 3,
                  height: 6,
                  background: C.accent,
                  boxShadow: `0 0 30px 8px rgba(49,77,208,0.55)`,
                  borderRadius: 3,
                  opacity: interpolate(frame, [36, 40], [1, 0], CLAMP),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: scan * BILL.width * 1.33,
                  background: "linear-gradient(180deg, rgba(49,77,208,0) 60%, rgba(49,77,208,0.10) 100%)",
                  borderRadius: 14,
                  opacity: interpolate(frame, [36, 44], [1, 0], CLAMP),
                }}
              />
            </>
          ) : null}
        </Interactive.Div>

        {/* beams from bill fields to extracted rows */}
        <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {BEAMS.map((b, i) => {
            const at = ROW_AT(b.row) - 2;
            const p = interpolate(frame, [at, at + 6], [0, 1], { ...CLAMP, easing: OUT });
            const fade = interpolate(frame, [at + 10, at + 20], [1, 0], CLAMP);
            const y2 = PANEL.top + 96 + b.row * ROW_H + ROW_H / 2;
            const x1 = BILL.left + BILL.width - 30;
            const x2 = PANEL.left + 10;
            return (
              <path
                key={i}
                d={`M ${x1} ${b.y} C ${x1 + 60} ${b.y}, ${x2 - 60} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={C.accent}
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
                opacity={frame >= at ? fade : 0}
              />
            );
          })}
        </svg>

        {/* extracted voucher panel */}
        <Interactive.Div
          name="VoucherPanel"
          style={{
            position: "absolute",
            left: PANEL.left,
            top: PANEL.top,
            width: PANEL.width,
            background: C.white,
            borderRadius: 22,
            boxShadow: "0 30px 80px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.08)",
            overflow: "hidden",
            opacity: interpolate(frame, [28, 36], [0, 1], CLAMP),
            translate: interpolate(frame, [28, 40], ["120px 0px", "0px 0px"], { ...CLAMP, easing: OUT }),
          }}
        >
          <div
            style={{
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              borderBottom: `1px solid ${C.hair}`,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 700 }}>Purchase voucher</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: C.white,
                background: C.accent,
                borderRadius: 999,
                padding: "8px 16px",
                letterSpacing: "0.02em",
              }}
            >
              AI
            </div>
          </div>
          {ROWS.map((r, i) => {
            const at = ROW_AT(i);
            const p = interpolate(frame, [at, at + 6], [0, 1], { ...CLAMP, easing: OUT });
            const chars = Math.floor(interpolate(frame, [at, at + 8], [0, r.v.length], CLAMP));
            return (
              <div
                key={r.k}
                style={{
                  height: ROW_H,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 28px",
                  borderBottom: i < ROWS.length - 1 ? `1px solid ${C.hair}` : "none",
                  opacity: p,
                  translate: `${(1 - p) * 30}px 0`,
                  background: frame >= at && frame < at + 8 ? "rgba(49,77,208,0.06)" : "transparent",
                }}
              >
                <span style={{ fontSize: 24, color: C.grey, fontWeight: 500 }}>{r.k}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {r.ai ? (
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: C.accent,
                        border: `2px solid ${C.accent}`,
                        borderRadius: 999,
                        padding: "3px 10px",
                        letterSpacing: "0.02em",
                        opacity: interpolate(frame, [at + 6, at + 10], [0, 1], CLAMP),
                      }}
                    >
                      PREDICTED
                    </span>
                  ) : null}
                  <span style={{ fontFamily: r.k === "GSTIN" || r.k === "Invoice no." ? MONO : FONT, fontSize: 25, fontWeight: 700, letterSpacing: r.k === "GSTIN" ? 0 : TRACK }}>
                    {r.v.slice(0, chars)}
                  </span>
                </span>
              </div>
            );
          })}
        </Interactive.Div>

        {/* Post to Tally button */}
        <Interactive.Div
          name="PostButton"
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1060,
            height: 124,
            borderRadius: 26,
            background: posted ? C.accent : C.black,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontSize: 46,
            fontWeight: 700,
            opacity: interpolate(frame, [62, 70], [0, 1], CLAMP),
            translate: interpolate(frame, [62, 72], ["0px 60px", "0px 0px"], { ...CLAMP, easing: OUT }),
            scale: interpolate(frame, [CLICK, CLICK + 2, CLICK + 9], [1, 0.94, 1], { ...CLAMP, easing: [OUT, SNAP] }),
          }}
        >
          {posted ? (
            <>
              <span style={{ scale: interpolate(frame, [CLICK + 2, CLICK + 9], [0.4, 1], { ...CLAMP, easing: SNAP }) }}>
                <Check size={54} progress={interpolate(frame, [CLICK + 2, CLICK + 10], [0, 1], CLAMP)} stroke={3.4} />
              </span>
              Posted to Tally
            </>
          ) : (
            "Post to Tally"
          )}
        </Interactive.Div>

        {/* ring pulse + confetti burst from the button */}
        {posted ? (
          <>
            <div
              style={{
                position: "absolute",
                left: 80,
                right: 80,
                top: 1060,
                height: 124,
                borderRadius: 26,
                border: `4px solid ${C.accent}`,
                scale: interpolate(frame, [CLICK + 2, CLICK + 20], [1, 1.25], { ...CLAMP, easing: OUT }),
                opacity: interpolate(frame, [CLICK + 2, CLICK + 20], [0.8, 0], CLAMP),
              }}
            />
            {new Array(26).fill(0).map((_, i) => {
              const t = frame - (CLICK + 2);
              const ang = random(`ca${i}`) * Math.PI - Math.PI;
              const sp = 14 + random(`cs${i}`) * 22;
              const x = 540 + Math.cos(ang) * sp * t;
              const y = 1122 + Math.sin(ang) * sp * t + 0.9 * t * t;
              const size = 10 + random(`cz${i}`) * 14;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: size,
                    height: size * (random(`cr${i}`) > 0.5 ? 1 : 0.45),
                    background: i % 3 === 0 ? C.black : C.accent,
                    rotate: `${t * (random(`cw${i}`) * 30 - 15)}deg`,
                    opacity: interpolate(t, [18, 30], [1, 0], CLAMP),
                  }}
                />
              );
            })}
          </>
        ) : null}

        {/* cursor */}
        <Interactive.Div
          name="Cursor"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            translate: interpolate(frame, [66, 86], ["1040px 1380px", "905px 1128px"], { ...CLAMP, easing: IN_OUT }),
            scale: interpolate(frame, [CLICK, CLICK + 2, CLICK + 6], [1, 0.82, 1], CLAMP),
            opacity: interpolate(frame, [66, 70, 94, 99], [0, 1, 1, 0], CLAMP),
          }}
        >
          <Cursor size={78} />
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
