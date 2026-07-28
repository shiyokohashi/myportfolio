"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SCROLL_BG_FULL_PX } from "@/config/navigation";

type ScrollRevealState = {
  backgroundOpacity: number;
  bottomSceneOpacity: number;
};

const ScrollRevealContext = createContext<ScrollRevealState>({
  backgroundOpacity: 0,
  bottomSceneOpacity: 1,
});

export function ScrollRevealProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollRevealState>({
    backgroundOpacity: 0,
    bottomSceneOpacity: 1,
  });
  const stateRef = useRef(state);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const baseWhiteOpacity = Math.min(1, scrollY / SCROLL_BG_FULL_PX);

      const next: ScrollRevealState = {
        backgroundOpacity: baseWhiteOpacity,
        bottomSceneOpacity: 1 - baseWhiteOpacity,
      };

      const prev = stateRef.current;
      if (
        prev.backgroundOpacity === next.backgroundOpacity &&
        prev.bottomSceneOpacity === next.bottomSceneOpacity
      ) {
        return;
      }

      stateRef.current = next;
      setState(next);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ScrollRevealContext.Provider value={state}>
      {children}
    </ScrollRevealContext.Provider>
  );
}

export function useScrollReveal() {
  return useContext(ScrollRevealContext);
}
