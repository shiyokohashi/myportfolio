"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { useDomeGallery } from "@/app/lab/home/next/DomeGalleryProvider";

/** Keeps dome panel facing in sync with where the camera is looking. */
export function DomeViewSync() {
  const { camera } = useThree();
  const { horseForwardRef } = useDomeGallery();
  const forward = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() > 0.0001) {
      forward.normalize();
      horseForwardRef.current!.copy(forward);
    }
  });

  return null;
}
