"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

/** Subtle bloom on bright glass highlights — not the whole scene. */
export function HorseSceneEffects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.88}
        luminanceSmoothing={0.92}
        mipmapBlur
        radius={0.62}
      />
    </EffectComposer>
  );
}
