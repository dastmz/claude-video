import React from "react";
import { Composition, Still } from "remotion";
import { CharacterSheet } from "./CharacterSheet";
import { Ep1SayangAnak } from "./episodes/ep1/Ep1SayangAnak";
import { Ep2ApaKataSyarak } from "./episodes/ep2/Ep2ApaKataSyarak";
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
      {/* Episod 3: tambah <Composition id="Ep3-..."> di sini menggunakan src/shared/ */}
      <Still id="Helaian-Watak" component={CharacterSheet} width={VIDEO.width} height={VIDEO.height} />
    </>
  );
};
