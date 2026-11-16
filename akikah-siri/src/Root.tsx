import React from "react";
import { Composition, Still } from "remotion";
import { CharacterSheet } from "./CharacterSheet";
import { Ep1SayangAnak } from "./episodes/ep1/Ep1SayangAnak";
import { Ep2ApaKataSyarak } from "./episodes/ep2/Ep2ApaKataSyarak";
import { Ep3JomJawabKBAT } from "./episodes/ep3/Ep3JomJawabKBAT";
import { VIDEO } from "./shared/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Ep1-SayangAnak"
        component={Ep1SayangAnak}
        durationInFrames={90 * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ showSafeZone: false, voiceFile: "audio/ep1.mp3" }}
      />
      <Composition
        id="Ep2-ApaKataSyarak"
        component={Ep2ApaKataSyarak}
        durationInFrames={90 * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ showSafeZone: false, voiceFile: "audio/ep2.mp3" }}
      />
      <Composition
        id="Ep3-JomJawabKBAT"
        component={Ep3JomJawabKBAT}
        durationInFrames={90 * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ showSafeZone: false, voiceFile: "audio/ep3.mp3" }}
      />
      <Still id="Helaian-Watak" component={CharacterSheet} width={VIDEO.width} height={VIDEO.height} />
    </>
  );
};
