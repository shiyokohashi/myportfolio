"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { useGalleryRun } from "@/app/lab/home/next/GalleryRunProvider";
import {
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
} from "@/app/lab/home/next/galleryRunState";

/** Third-person camera — follows behind the horse with gentle damping. */
export function GalleryCamera() {
  const { camera } = useThree();
  const { horsePosRef, horseForwardRef } = useGalleryRun();

  const desired = useMemo(
    () => ({
      position: new THREE.Vector3(),
      lookAt: new THREE.Vector3(),
      current: new THREE.Vector3(
        0,
        CAMERA_HEIGHT,
        CAMERA_DISTANCE + 11.5,
      ),
    }),
    [],
  );

  useFrame((_, delta) => {
    const horsePos = horsePosRef.current!;
    const forward = horseForwardRef.current!;

    desired.position
      .copy(forward)
      .multiplyScalar(-CAMERA_DISTANCE)
      .add(horsePos);
    desired.position.y = horsePos.y + CAMERA_HEIGHT;

    desired.lookAt.copy(forward).multiplyScalar(6).add(horsePos);
    desired.lookAt.y = horsePos.y + 1.4;

    const follow = 1 - Math.exp(-4.5 * delta);
    desired.current.lerp(desired.position, follow);
    camera.position.copy(desired.current);
    camera.lookAt(desired.lookAt);
    camera.up.set(0, 1, 0);
  });

  return null;
}
