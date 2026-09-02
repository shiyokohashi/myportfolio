"use client";

import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";

/** Bloom only on selected objects (horse) — gallery stays sharp and rectangular. */
export function NextSceneEffects() {
  return (
    <EffectComposer multisampling={0}>
      <SelectiveBloom
        intensity={1.05}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.95}
      />
    </EffectComposer>
  );
}
