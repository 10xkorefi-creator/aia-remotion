import React from "react";
import { Composition, Folder } from "remotion";
import { LaunchVideo } from "./LaunchVideo";
import { Chaos } from "./scenes/Chaos";
import { Demo } from "./scenes/Demo";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { Minutes } from "./scenes/Minutes";
import { Modules } from "./scenes/Modules";
import { Reveal } from "./scenes/Reveal";
import { WhatsApp } from "./scenes/WhatsApp";
import { H, W } from "./theme";

const base = { width: W, height: H, fps: 30 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AiALaunch" component={LaunchVideo} durationInFrames={450} {...base} />
    <Folder name="AiALaunch-Scenes">
      <Composition id="Hook" component={Hook} durationInFrames={60} {...base} />
      <Composition id="Chaos" component={Chaos} durationInFrames={60} {...base} />
      <Composition id="Reveal" component={Reveal} durationInFrames={45} {...base} />
      <Composition id="Demo" component={Demo} durationInFrames={120} {...base} />
      <Composition id="Modules" component={Modules} durationInFrames={45} {...base} />
      <Composition id="WhatsApp" component={WhatsApp} durationInFrames={45} {...base} />
      <Composition id="Minutes" component={Minutes} durationInFrames={30} {...base} />
      <Composition id="EndCard" component={EndCard} durationInFrames={45} {...base} />
    </Folder>
  </>
);
