"use client";

import { PerspectiveCamera } from "@react-three/drei";

import { CurvedGalleryCards } from "@/app/lab/home/next/CurvedGalleryCards";
import { GalleryCamera } from "@/app/lab/home/next/GalleryCamera";
import { GalleryEnvironment } from "@/app/lab/home/next/GalleryEnvironment";
import { GalleryHorse } from "@/app/lab/home/next/GalleryHorse";
import { GalleryHorseControls } from "@/app/lab/home/next/GalleryHorseControls";
import { GalleryRunProvider } from "@/app/lab/home/next/GalleryRunProvider";

/** Immersive cylindrical gallery — horse runs inside, cards reveal by proximity. */
export function NextGalleryScene() {
  return (
    <GalleryRunProvider>
      <PerspectiveCamera makeDefault fov={44} near={0.05} far={160} />
      <GalleryEnvironment />
      <CurvedGalleryCards />
      <GalleryHorse />
      <GalleryCamera />
      <GalleryHorseControls />
    </GalleryRunProvider>
  );
}
