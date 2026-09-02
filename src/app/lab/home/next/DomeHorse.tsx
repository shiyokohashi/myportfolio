"use client";

import { Select } from "@react-three/postprocessing";

import { DOME_SCENE_FRAMING } from "@/app/lab/home/next/domeGalleryState";
import { NextPointCloudHorse } from "@/app/lab/home/next/NextPointCloudHorse";

const { horsePos } = DOME_SCENE_FRAMING;

/** Fixed side-on dot horse — parent scene group applies HORSE_YAW. */
export function DomeHorse() {
  return (
    <Select enabled>
      <group position={horsePos} renderOrder={8}>
        <NextPointCloudHorse scale={1.38} />
      </group>
    </Select>
  );
}
