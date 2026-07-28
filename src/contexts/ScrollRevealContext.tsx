"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  FOOTER_VIDEO_FADE_LEAD_PX,
  FOOTER_VIDEO_FADE_PX,
  SCROLL_BG_FULL_PX,
} from "@/config/navigation";

type ScrollRevealState = {
  backgroundOpacity: number;
  bottomSceneOpacity: number;
  footerVideoReveal: number;
};

const ScrollRevealContext = createContext<ScrollRevealState>({
  backgroundOpacity: 0,
  bottomSceneOpacity: 1,
  footerVideoReveal: 0,
});

function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function footerEase(value: number): number {
  return smoothstep(smoothstep(value));
}

export function ScrollRevealProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollRevealState>({
    backgroundOpacity: 0,
    bottomSceneOpacity: 1,
    footerVideoReveal: 0,
  });
  const stateRef = useRef(state);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const baseWhiteOpacity = Math.min(1, scrollY / SCROLL_BG_FULL_PX);
      const footer = document.getElementById("site-footer");
      let nextFooterVideoReveal = 0;

      if (footer) {
        const footerTop = footer.getBoundingClientRect().top + scrollY;
        const viewportBottom = scrollY + window.innerHeight;
        nextFooterVideoReveal = footerEase(
          Math.min(
            1,
            Math.max(
              0,
              (viewportBottom + FOOTER_VIDEO_FADE_LEAD_PX - footerTop) /
                FOOTER_VIDEO_FADE_PX,
            ),
          ),
        );
      }

      const next: ScrollRevealState = {
        backgroundOpacity: baseWhiteOpacity * (1 - nextFooterVideoReveal),
        bottomSceneOpacity: (1 - baseWhiteOpacity) * (1 - nextFooterVideoReveal),
        footerVideoReveal: nextFooterVideoReveal,
      };

      const prev = stateRef.current;
      if (
        prev.backgroundOpacity === next.backgroundOpacity &&
        prev.bottomSceneOpacity === next.bottomSceneOpacity &&
        prev.footerVideoReveal === next.footerVideoReveal
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
