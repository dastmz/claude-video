import React from "react";
import { Composition } from "remotion";
import { TricksVideo } from "./TricksVideo";
import { TOTAL_FRAMES } from "./timeline";
import { video } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TricksVideo"
      component={TricksVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={video.fps}
      width={video.width}
      height={video.height}
    />
  );
};
