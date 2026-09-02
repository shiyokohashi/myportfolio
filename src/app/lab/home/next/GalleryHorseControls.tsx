"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { useGalleryRun } from "@/app/lab/home/next/GalleryRunProvider";
import { TURN_SENSITIVITY } from "@/app/lab/home/next/galleryRunState";

const DRAG_THRESHOLD_PX = 6;

/** Drag or arrow keys to steer the horse — threshold avoids fighting card clicks. */
export function GalleryHorseControls() {
  const { gl } = useThree();
  const { horseTurnRef } = useGalleryRun();
  const pointerDown = useRef(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const startX = useRef(0);

  useEffect(() => {
    const element = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      pointerDown.current = true;
      dragging.current = false;
      startX.current = event.clientX;
      lastX.current = event.clientX;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerDown.current) return;

      if (!dragging.current) {
        if (Math.abs(event.clientX - startX.current) < DRAG_THRESHOLD_PX) return;
        dragging.current = true;
      }

      const deltaX = event.clientX - lastX.current;
      lastX.current = event.clientX;
      horseTurnRef.current!.current -= deltaX * TURN_SENSITIVITY;
    };

    const endDrag = () => {
      pointerDown.current = false;
      dragging.current = false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        horseTurnRef.current!.current += 0.055;
      }
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        horseTurnRef.current!.current -= 0.055;
      }
    };

    const onWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : 0;
      if (!delta) return;
      horseTurnRef.current!.current -= delta * 0.0018;
    };

    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("keydown", onKeyDown);
    element.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("wheel", onWheel);
    };
  }, [gl.domElement, horseTurnRef]);

  return null;
}
