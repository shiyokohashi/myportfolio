"use client";

import { useFrame } from "@react-three/fiber";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";

import {
  HORSE_Y,
  REVEAL_DURATION,
  RUN_RADIUS,
  RUN_SPEED,
  type CardRevealState,
} from "@/app/lab/home/next/galleryRunState";

type GalleryRunContextValue = {
  horsePosRef: React.RefObject<THREE.Vector3>;
  horseForwardRef: React.RefObject<THREE.Vector3>;
  horseHeadingRef: React.RefObject<{ current: number }>;
  horseTurnRef: React.RefObject<{ current: number }>;
  revealStatesRef: React.RefObject<Map<string, CardRevealState>>;
  getRevealOpacity: (id: string, elapsed: number) => number;
  markRevealStart: (id: string, elapsed: number) => void;
};

const GalleryRunContext = createContext<GalleryRunContextValue | null>(null);

export function useGalleryRun() {
  const context = useContext(GalleryRunContext);
  if (!context) {
    throw new Error("useGalleryRun must be used within GalleryRunProvider");
  }
  return context;
}

function GalleryRunController() {
  const { horsePosRef, horseForwardRef, horseHeadingRef, horseTurnRef } =
    useGalleryRun();

  const scratch = useMemo(
    () => ({
      forward: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((_, delta) => {
    const heading = horseHeadingRef.current!.current;
    horseHeadingRef.current!.current = heading + RUN_SPEED * delta;

    const turn = horseTurnRef.current!.current;
    const angle = horseHeadingRef.current!.current + turn;

    horsePosRef.current!.set(
      Math.sin(angle) * RUN_RADIUS,
      HORSE_Y,
      Math.cos(angle) * RUN_RADIUS,
    );

    scratch.forward.set(Math.sin(angle), 0, Math.cos(angle)).normalize();
    horseForwardRef.current!.copy(scratch.forward);
  });

  return null;
}

export function GalleryRunProvider({ children }: { children: ReactNode }) {
  const horsePosRef = useRef(new THREE.Vector3(0, HORSE_Y, RUN_RADIUS));
  const horseForwardRef = useRef(new THREE.Vector3(0, 0, 1));
  const horseHeadingRef = useRef({ current: 0 });
  const horseTurnRef = useRef({ current: 0 });
  const revealStatesRef = useRef(new Map<string, CardRevealState>());

  const value = useMemo<GalleryRunContextValue>(
    () => ({
      horsePosRef,
      horseForwardRef,
      horseHeadingRef,
      horseTurnRef,
      revealStatesRef,
      getRevealOpacity: (id, elapsed) => {
        const state = revealStatesRef.current.get(id);
        if (!state?.startedAt) return 0;
        if (state.revealed) return 1;
        const progress = THREE.MathUtils.clamp(
          (elapsed - state.startedAt) / REVEAL_DURATION,
          0,
          1,
        );
        if (progress >= 1) state.revealed = true;
        return THREE.MathUtils.smoothstep(progress, 0, 1);
      },
      markRevealStart: (id, elapsed) => {
        const map = revealStatesRef.current;
        const existing = map.get(id);
        if (existing?.startedAt) return;
        map.set(id, { startedAt: elapsed, revealed: false });
      },
    }),
    [],
  );

  return (
    <GalleryRunContext.Provider value={value}>
      <GalleryRunController />
      {children}
    </GalleryRunContext.Provider>
  );
}
