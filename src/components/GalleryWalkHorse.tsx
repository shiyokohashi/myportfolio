"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { HorseSprite } from "@/components/HorseSprite";
import { HORSE_SPRITE } from "@/config/animation";
import { applyHorseFrame } from "@/lib/syncedAnimation";

/** Match PerspectiveGallery vanishing point */
const VP_X = 0.7;

/** Placeholder size — swap sprite asset later without changing layout much */
const GALLERY_HORSE_HEIGHT = 200;

/** Full gallop cycles over the gallery scroll section */
const GALLOP_CYCLES = 14;

type GalleryWalkHorseProps = {
  scrollYProgress: MotionValue<number>;
  vw: MotionValue<number>;
  vh: MotionValue<number>;
};

/** Sprite horse pinned at the gallery vanishing point; gallop synced to scroll. */
export function GalleryWalkHorse({
  scrollYProgress,
  vw,
  vh,
}: GalleryWalkHorseProps) {
  const horseRef = useRef<HTMLDivElement>(null);

  const x = useTransform(vw, (w) => w * VP_X);
  const y = useTransform(vh, (h) => h / 2);

  const frameIndex = useTransform(scrollYProgress, (p) => {
    const progress = (p as number) * GALLOP_CYCLES;
    return (
      Math.floor((progress % 1) * HORSE_SPRITE.frameCount) %
      HORSE_SPRITE.frameCount
    );
  });

  useMotionValueEvent(frameIndex, "change", (frame) => {
    if (horseRef.current) {
      applyHorseFrame(horseRef.current, frame, GALLERY_HORSE_HEIGHT);
    }
  });

  useEffect(() => {
    if (horseRef.current) {
      applyHorseFrame(horseRef.current, 0, GALLERY_HORSE_HEIGHT);
    }
  }, []);

  return (
    <motion.div
      className="gallery-horse"
      style={{
        left: x,
        top: y,
        x: "-50%",
        y: "-50%",
      }}
      aria-hidden
    >
      <HorseSprite
        ref={horseRef}
        className="gallery-horse__sprite"
        displayHeightPx={GALLERY_HORSE_HEIGHT}
      />
    </motion.div>
  );
}
