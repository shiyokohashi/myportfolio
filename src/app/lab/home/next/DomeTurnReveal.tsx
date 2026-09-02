"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useDomeGallery } from "@/app/lab/home/next/DomeGalleryProvider";
import {
  REVEAL_TURN_THRESHOLD,
  wrapAngle,
} from "@/app/lab/home/next/domeGalleryState";

/** Drag to fade out; after enough turn, swap to a random project and fade in. */
export function DomeTurnReveal() {
  const {
    panelOpacityRef,
    accumulatedTurnRef,
    isDraggingRef,
    horseForwardRef,
    pickNextProject,
  } = useDomeGallery();

  const lastAzimuthRef = useRef<number | null>(null);

  const scratch = useMemo(
    () => ({
      forward: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((_, delta) => {
    scratch.forward.copy(horseForwardRef.current!);
    scratch.forward.y = 0;
    if (scratch.forward.lengthSq() < 0.0001) return;
    scratch.forward.normalize();

    const azimuth = Math.atan2(scratch.forward.x, scratch.forward.z);

    if (!isDraggingRef.current) {
      lastAzimuthRef.current = azimuth;
      if (accumulatedTurnRef.current! > 0) {
        accumulatedTurnRef.current = Math.max(
          0,
          accumulatedTurnRef.current! - delta * 0.65,
        );
      }
      if (panelOpacityRef.current! < 1) {
        panelOpacityRef.current = Math.min(
          1,
          panelOpacityRef.current! + delta * 3.2,
        );
      }
      return;
    }

    const prev = lastAzimuthRef.current;
    lastAzimuthRef.current = azimuth;
    if (prev === null) return;

    const deltaAz = wrapAngle(azimuth - prev);
    if (Math.abs(deltaAz) < 0.0002) return;

    accumulatedTurnRef.current! += Math.abs(deltaAz);
    const turnProgress = accumulatedTurnRef.current! / REVEAL_TURN_THRESHOLD;
    panelOpacityRef.current = Math.max(
      0,
      1 - THREE.MathUtils.smoothstep(0.12, 0.92, turnProgress),
    );

    if (accumulatedTurnRef.current! >= REVEAL_TURN_THRESHOLD) {
      pickNextProject();
      accumulatedTurnRef.current = 0;
      panelOpacityRef.current = 0;
    }
  });

  return null;
}
