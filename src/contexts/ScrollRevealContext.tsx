"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SCROLL_BG_FULL_PX } from "@/config/navigation";

type ScrollRevealState = {
  /** Home hero — light nav text while the video backdrop is visible. */
  lightNav: boolean;
  /** Horse/carousel fully hidden behind the white scroll layer. */
  sceneHidden: boolean;
};

type ScrollRevealContextValue = ScrollRevealState & {
  registerWhiteOverlay: (node: HTMLElement | null) => void;
  registerBottomSceneCarousel: (node: HTMLElement | null) => void;
  registerBottomSceneChrome: (node: HTMLElement | null) => void;
};

const ScrollRevealContext = createContext<ScrollRevealContextValue | null>(null);

function applyScrollStyles(
  scrollY: number,
  whiteOverlay: HTMLElement | null,
  carouselNode: HTMLElement | null,
  chromeNode: HTMLElement | null,
) {
  const baseWhiteOpacity = Math.min(1, scrollY / SCROLL_BG_FULL_PX);
  const bottomOpacity = 1 - baseWhiteOpacity;

  if (whiteOverlay) {
    whiteOverlay.style.opacity = String(baseWhiteOpacity);
  }

  if (carouselNode) {
    carouselNode.style.opacity = String(bottomOpacity);
  }

  if (chromeNode) {
    chromeNode.style.opacity = String(bottomOpacity);
  }

  return {
    lightNav: baseWhiteOpacity < 0.35,
    sceneHidden: bottomOpacity <= 0.02,
  };
}

export function ScrollRevealProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollRevealState>({
    lightNav: true,
    sceneHidden: false,
  });

  const whiteOverlayRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLElement | null>(null);
  const chromeRef = useRef<HTMLElement | null>(null);
  const flagsRef = useRef(state);

  const registerWhiteOverlay = useCallback((node: HTMLElement | null) => {
    whiteOverlayRef.current = node;
    if (node) {
      const next = applyScrollStyles(
        window.scrollY,
        node,
        carouselRef.current,
        chromeRef.current,
      );
      flagsRef.current = next;
      setState(next);
    }
  }, []);

  const registerBottomSceneCarousel = useCallback((node: HTMLElement | null) => {
    carouselRef.current = node;
    if (node) {
      node.style.opacity = String(
        1 - Math.min(1, window.scrollY / SCROLL_BG_FULL_PX),
      );
    }
  }, []);

  const registerBottomSceneChrome = useCallback((node: HTMLElement | null) => {
    chromeRef.current = node;
    if (node) {
      node.style.opacity = String(
        1 - Math.min(1, window.scrollY / SCROLL_BG_FULL_PX),
      );
    }
  }, []);

  useEffect(() => {
    let frame = 0;

    const scheduleUpdate = () => {
      const next = applyScrollStyles(
        window.scrollY,
        whiteOverlayRef.current,
        carouselRef.current,
        chromeRef.current,
      );

      if (
        flagsRef.current.lightNav === next.lightNav &&
        flagsRef.current.sceneHidden === next.sceneHidden
      ) {
        return;
      }

      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        flagsRef.current = next;
        setState(next);
      });
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

  const value: ScrollRevealContextValue = {
    ...state,
    registerWhiteOverlay,
    registerBottomSceneCarousel,
    registerBottomSceneChrome,
  };

  return (
    <ScrollRevealContext.Provider value={value}>
      {children}
    </ScrollRevealContext.Provider>
  );
}

export function useScrollReveal() {
  const context = useContext(ScrollRevealContext);

  if (!context) {
    throw new Error("useScrollReveal must be used within ScrollRevealProvider");
  }

  return context;
}
