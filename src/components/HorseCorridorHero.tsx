"use client";

import { Suspense, useEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import { CorridorScene } from "@/components/CorridorScene";
import { HorseSceneEffects } from "@/components/HorseSceneEffects";
import "./HorseCorridorHero.css";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Lets the DOM scroll handler pause/resume the R3F loop without React re-renders. */
function FrameLoopBridge({
  bridgeRef,
}: {
  bridgeRef: MutableRefObject<((running: boolean) => void) | null>;
}) {
  const set = useThree((state) => state.set);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    bridgeRef.current = (running: boolean) => {
      set({ frameloop: running ? "always" : "never" });
      if (running) invalidate();
    };
    return () => {
      bridgeRef.current = null;
    };
  }, [bridgeRef, invalidate, set]);

  return null;
}

/**
 * Homepage hero — fixed canvas (no pin jumps). Fade only on scroll-down;
 * scroll-up restores a fully clear scene.
 */
export function HorseCorridorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(true);
  const lastScrollYRef = useRef(0);
  const scrollDirRef = useRef<"up" | "down">("down");
  const frameLoopRef = useRef<((running: boolean) => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    let frame = 0;
    lastScrollYRef.current = window.scrollY;

    const sync = () => {
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;
      // Hysteresis so tiny trackpad jitter doesn't flip direction.
      if (delta < -2) scrollDirRef.current = "up";
      else if (delta > 2) scrollDirRef.current = "down";
      lastScrollYRef.current = y;
      container.dataset.scrollDir = scrollDirRef.current;

      const travel = Math.max(1, container.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, y / travel));
      const pastHero = progress >= 0.995;

      // Down: dissolve. Up: fully clear until we've left the hero entirely.
      const opacity =
        scrollDirRef.current === "up"
          ? pastHero
            ? 0
            : 1
          : 1 - smoothstep(0.48, 0.96, progress);

      viewport.style.opacity = String(opacity);
      viewport.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      viewport.style.pointerEvents = opacity < 0.08 ? "none" : "auto";

      // Keep WebGL warm near the hero; only sleep deep in the page.
      const shouldRun = y < travel + window.innerHeight * 0.35;
      if (shouldRun !== runningRef.current) {
        runningRef.current = shouldRun;
        frameLoopRef.current?.(shouldRun);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="top"
      className="horse-corridor-hero"
      aria-label="Glass horse portfolio corridor"
    >
      <div ref={viewportRef} className="horse-corridor-viewport">
        <Canvas
          dpr={[1, 1.75]}
          frameloop="always"
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          className="h-full w-full"
        >
          <FrameLoopBridge bridgeRef={frameLoopRef} />
          <color attach="background" args={["#faf9f7"]} />
          <ambientLight intensity={0.58} color="#ffffff" />
          <directionalLight
            position={[2, 9, 14]}
            intensity={0.52}
            color="#fffef9"
          />
          <directionalLight
            position={[-6, 5, -4]}
            intensity={0.12}
            color="#ffffff"
          />
          <Environment preset="studio" environmentIntensity={0.14} />
          <Suspense fallback={null}>
            <CorridorScene zoomOutScrollsPage />
          </Suspense>
          <HorseSceneEffects />
        </Canvas>
      </div>
    </div>
  );
}
