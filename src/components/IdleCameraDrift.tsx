"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const DRIFT_SPEED = 0.24;
const IDLE_DELAY_MS = 2000;

/** Slow orbit drift when the user isn't dragging the camera. */
export function IdleCameraDrift() {
  const controls = useThree((state) => state.controls as OrbitControlsImpl | null);
  const dragging = useRef(false);
  const idleSince = useRef(0);

  useEffect(() => {
    if (!controls) return;

    const onStart = () => {
      dragging.current = true;
      controls.autoRotate = false;
    };
    const onEnd = () => {
      dragging.current = false;
      idleSince.current = performance.now();
    };

    idleSince.current = performance.now();
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.autoRotate = false;
    };
  }, [controls]);

  useFrame(() => {
    if (!controls || dragging.current) return;
    controls.autoRotate = performance.now() - idleSince.current >= IDLE_DELAY_MS;
    controls.autoRotateSpeed = DRIFT_SPEED;
  });

  return null;
}
