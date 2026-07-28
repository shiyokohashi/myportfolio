"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** Slide distance in px before reveal. */
  offsetY?: number;
};

/** Fade and slide up when scrolled into view. */
export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  offsetY = 28,
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -4% 0px",
    threshold: 0.08,
  });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]",
        inView ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        transform: inView ? "translateY(0)" : `translateY(${offsetY}px)`,
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
