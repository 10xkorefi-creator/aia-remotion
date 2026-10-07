import React from "react";
import { AbsoluteFill, Interactive, interpolate, random, useCurrentFrame } from "remotion";
import { Backdrop, BillCard, Bloom, Check, Cursor, glassLight, GradText, MaskWord, punch } from "../components";
import { C, CLAMP, FONT, G, IN_OUT, MONO, OUT, SERIF, SNAP, TRACK } from "../theme";

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
    <AbsoluteFill name="Demo" style={{ fontFamily: FONT, letterSpacing: TRACK, overflow: "hidden" }}>
      <Backdrop mode="light" phase={200} />
      <AbsoluteFill
        style={{
          scale: `${punch(frame, 0.04) * interpolate(frame, [95, 120], [1, 1.035], { ...CLAMP, easing: IN_OUT })}`,
        }}
      >
        {/* captions */}
        <Interactive.Div name="Captions" style={{ position: "absolute", left: 80, right: 80, top: 100, height: 200 }}>
          {CAPTIONS.map((c) => {
            if (frame < c.from - 1 || frame >= c.to + 5) return null;
            const pin = interpolate(frame, [c.from, c.from + 12], [0, 1], { ...CLAMP, easing: OUT });
            const pout = interpolate(frame, [c.to, c.to + 5], [0, 1], { ...CLAMP, easing: OUT });
            const last = c.text.lastIndexOf(" ");
            return (
              <div key={c.step} style={{ position: "absolute", inset: 0, opacity: 1 - pout, translate: `0 ${-pout * 60}px`, filter: `blur(${pout * 8}px)` }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: MONO,
                    fontSize: 24,
                    color: C.accent,
                    letterSpacing: "0.08em",
                    opacity: pin,
                    background: "rgba(49,77,208,0.08)",
                    border: "1.5px solid rgba(49,77,208,0.18)",
                    borderRadius: 999,
                    padding: "8px 18px",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: C.accent, boxShadow: "0 0 12px 3px rgba(49,77,208,0.6)" }} />
                  STEP {c.step}
                </div>
                <div style={{ fontSize: 100, fontWeight: 600, color: C.black, lineHeight: 1.08, marginTop: 10, whiteSpace: "nowrap" }}>
                  <MaskWord p={pin}>
                    {c.text.slice(0, last + 1)}
                    <GradText gradient={G.lightText} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 116, letterSpacing: "-0.03em" }}>
                      {c.text.slice(last + 1)}
                    </GradText>
                  </MaskWord>
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
            translate: interpolate(frame, [0, 16], ["-620px 60px", "0px 0px"], { ...CLAMP, easing: OUT }),
            rotate: interpolate(frame, [0, 16], ["-14deg", "-2deg"], { ...CLAMP, easing: SNAP }),
          }}
        >
          <BillCard
            seed={831}
            width={BILL.width}
            vendor="Sharma Traders"
            gstin="09AAACS4821F1Z5"
            total="₹48,260"
            highlight={frame >= 10 ? scan : -1}
            style={{ boxShadow: "0 40px 90px rgba(49,77,208,0.22), 0 14px 30px rgba(10,16,56,0.12), 0 0 0 1px rgba(10,16,56,0.06)" }}
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
                  background: `linear-gradient(90deg, rgba(49,77,208,0) 0%, ${C.indigo400} 20%, ${C.accent} 50%, ${C.indigo400} 80%, rgba(49,77,208,0) 100%)`,
                  boxShadow: `0 0 36px 10px rgba(72,100,240,0.55)`,
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
                  background: "linear-gradient(180deg, rgba(49,77,208,0) 55%, rgba(72,100,240,0.16) 100%)",
                  borderRadius: 16,
                  opacity: interpolate(frame, [36, 44], [1, 0], CLAMP),
                }}
              />
            </>
          ) : null}
        </Interactive.Div>

        {/* beams from bill fields to extracted rows */}
        <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
          <defs>
            <linearGradient id="beam" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor={C.indigo400} />
              <stop offset="1" stopColor={C.accent} />
            </linearGradient>
            <filter id="beamGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {BEAMS.map((b, i) => {
            const at = ROW_AT(b.row) - 2;
            const p = interpolate(frame, [at, at + 9], [0, 1], { ...CLAMP, easing: OUT });
            const fade = interpolate(frame, [at + 10, at + 22], [1, 0], CLAMP);
            const y2 = PANEL.top + 96 + b.row * ROW_H + ROW_H / 2;
            const x1 = BILL.left + BILL.width - 30;
            const x2 = PANEL.left + 10;
            const d = `M ${x1} ${b.y} C ${x1 + 60} ${b.y}, ${x2 - 60} ${y2}, ${x2} ${y2}`;
            const common = { d, fill: "none", strokeLinecap: "round" as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: frame >= at ? fade : 0 };
            return (
              <g key={i}>
                <path {...common} stroke={C.indigo400} strokeWidth={10} filter="url(#beamGlow)" />
                <path {...common} stroke="url(#beam)" strokeWidth={4} />
              </g>
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
            ...glassLight,
            borderRadius: 26,
            overflow: "hidden",
            opacity: interpolate(frame, [28, 38], [0, 1], CLAMP),
            translate: interpolate(frame, [28, 44], ["120px 0px", "0px 0px"], { ...CLAMP, easing: OUT }),
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
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.03em" }}>Purchase voucher</div>
            <div
              style={{
                fontSize: 21,
                fontWeight: 600,
                color: C.white,
                background: G.accent,
                borderRadius: 999,
                padding: "8px 16px",
                letterSpacing: "0.04em",
                boxShadow: "0 6px 18px rgba(49,77,208,0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              AI
            </div>
          </div>
          {ROWS.map((r, i) => {
            const at = ROW_AT(i);
            const p = interpolate(frame, [at, at + 9], [0, 1], { ...CLAMP, easing: OUT });
            const chars = Math.floor(interpolate(frame, [at, at + 8], [0, r.v.length], CLAMP));
            const live = frame >= at && frame < at + 10;
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
                  background: live ? "linear-gradient(90deg, rgba(49,77,208,0.10), rgba(49,77,208,0.02))" : "transparent",
                }}
              >
                <span style={{ fontSize: 24, color: C.grey, fontWeight: 500, letterSpacing: "-0.02em" }}>{r.k}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {r.ai ? (
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: C.accent,
                        background: "rgba(49,77,208,0.08)",
                        border: `1.5px solid rgba(49,77,208,0.35)`,
                        borderRadius: 999,
                        padding: "4px 11px",
                        letterSpacing: "0.06em",
                        opacity: interpolate(frame, [at + 6, at + 12], [0, 1], CLAMP),
                      }}
                    >
                      PREDICTED
                    </span>
                  ) : null}
                  <span style={{ fontFamily: r.k === "GSTIN" || r.k === "Invoice no." ? MONO : FONT, fontSize: r.k === "GSTIN" ? 22 : 25, fontWeight: r.k === "GSTIN" || r.k === "Invoice no." ? 500 : 600, letterSpacing: r.k === "GSTIN" || r.k === "Invoice no." ? 0 : "-0.03em" }}>
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
            borderRadius: 30,
            background: posted ? G.accent : `linear-gradient(180deg, #1B1F3A 0%, ${C.black} 100%)`,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontSize: 46,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            boxShadow: posted
              ? "0 24px 60px rgba(49,77,208,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 2px 0 rgba(255,255,255,0.3) inset"
              : "0 20px 50px rgba(10,16,56,0.35), 0 2px 0 rgba(255,255,255,0.12) inset",
            opacity: interpolate(frame, [62, 72], [0, 1], CLAMP),
            translate: interpolate(frame, [62, 76], ["0px 60px", "0px 0px"], { ...CLAMP, easing: OUT }),
            scale: interpolate(frame, [CLICK, CLICK + 3, CLICK + 12], [1, 0.95, 1], { ...CLAMP, easing: [OUT, SNAP] }),
          }}
        >
          {posted ? (
            <>
              <span style={{ scale: interpolate(frame, [CLICK + 2, CLICK + 12], [0.4, 1], { ...CLAMP, easing: SNAP }) }}>
                <Check size={54} progress={interpolate(frame, [CLICK + 2, CLICK + 12], [0, 1], CLAMP)} stroke={3.4} />
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
            {[0, 5].map((d) => (
              <div
                key={d}
                style={{
                  position: "absolute",
                  left: 80,
                  right: 80,
                  top: 1060,
                  height: 124,
                  borderRadius: 30,
                  border: `${d ? 2 : 4}px solid ${C.accent}`,
                  scale: interpolate(frame, [CLICK + 2 + d, CLICK + 24 + d], [1, 1.28], { ...CLAMP, easing: OUT }),
                  opacity: interpolate(frame, [CLICK + 2 + d, CLICK + 24 + d], [0.7, 0], CLAMP),
                }}
              />
            ))}
            {new Array(30).fill(0).map((_, i) => {
              const t = frame - (CLICK + 2);
              const ang = random(`ca${i}`) * Math.PI - Math.PI;
              const sp = 14 + random(`cs${i}`) * 22;
              const x = 540 + Math.cos(ang) * sp * t;
              const y = 1122 + Math.sin(ang) * sp * t + 0.9 * t * t;
              const size = 10 + random(`cz${i}`) * 14;
              const col = [C.accent, C.indigo400, C.indigo300, C.black][i % 4];
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: size,
                    height: size * (random(`cr${i}`) > 0.5 ? 1 : 0.45),
                    borderRadius: random(`cq${i}`) > 0.6 ? size : 3,
                    background: col,
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
            scale: interpolate(frame, [CLICK, CLICK + 2, CLICK + 7], [1, 0.82, 1], CLAMP),
            opacity: interpolate(frame, [66, 70, 94, 99], [0, 1, 1, 0], CLAMP),
          }}
        >
          <Cursor size={78} />
        </Interactive.Div>
      </AbsoluteFill>

      <Bloom at={CLICK + 2} color={C.indigo400} strength={0.45} dur={20} x={50} y={85} />
    </AbsoluteFill>
  );
};
