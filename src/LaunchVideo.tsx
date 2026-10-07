import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile } from "remotion";
import { Chaos } from "./scenes/Chaos";
import { Demo } from "./scenes/Demo";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { Minutes } from "./scenes/Minutes";
import { Modules } from "./scenes/Modules";
import { Reveal } from "./scenes/Reveal";
import { WhatsApp } from "./scenes/WhatsApp";
import { C } from "./theme";

// Hard cuts only: every cut lands on a beat of the 120 BPM soundtrack.
export const LaunchVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <Series>
      <Series.Sequence name="Hook" durationInFrames={60}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence name="Chaos" durationInFrames={60}>
        <Chaos />
      </Series.Sequence>
      <Series.Sequence name="Reveal" durationInFrames={45}>
        <Reveal />
      </Series.Sequence>
      <Series.Sequence name="Demo" durationInFrames={120}>
        <Demo />
      </Series.Sequence>
      <Series.Sequence name="Modules" durationInFrames={45}>
        <Modules />
      </Series.Sequence>
      <Series.Sequence name="WhatsApp" durationInFrames={45}>
        <WhatsApp />
      </Series.Sequence>
      <Series.Sequence name="Minutes" durationInFrames={30}>
        <Minutes />
      </Series.Sequence>
      <Series.Sequence name="EndCard" durationInFrames={45}>
        <EndCard />
      </Series.Sequence>
    </Series>
    <Audio src={staticFile("soundtrack.wav")} name="Soundtrack" />
  </AbsoluteFill>
);
