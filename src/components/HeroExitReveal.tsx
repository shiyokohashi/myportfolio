"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type HeroExitRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  offsetY?: number;
  /** Selector for the scroll hero that covers the page above this section. */
  heroSelector?: string;
};

/**
 * Fade/slide reveal that waits until the fixed gallery hero has scrolled away.
 * Otherwise IntersectionObserver fires early while the intro is still covered.
 */
export function HeroExitReveal({
  children,
  className,
  delayMs = 0,
  offsetY = 28,
  heroSelector = ".horse-corridor-hero",
}: HeroExitRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -4% 0px",
    threshold: 0.08,
    once: false,
  });
  const [heroClear, setHeroClear] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const hero = document.querySelector(heroSelector);

    const sync = () => {
      if (!hero) {
        setHeroClear(true);
        return;
      }
      const el = hero as HTMLElement;
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / travel));
      const scrollingUp = el.dataset.scrollDir === "up";

      // Hide intro while returning so it doesn't sit on top of a clear horse.
      if (scrollingUp && progress < 0.98) {
        setHeroClear(false);
        return;
      }

      setHeroClear(progress >= 0.55);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [heroSelector]);

  const shouldShow = heroClear && inView;

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(shouldShow);
      return;
    }

    if (!shouldShow) {
      setRevealed(false);
      return;
    }

    // Ensure a paint at opacity 0 before transitioning in.
    setRevealed(false);
    let outer = 0;
    let inner = 0;
    outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [shouldShow, reduceMotion]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]",
        revealed ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        transform: revealed ? "translateY(0)" : `translateY(${offsetY}px)`,
        transitionDelay: revealed ? `${delayMs}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
