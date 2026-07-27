"use client";

import { useEffect, useState, type RefObject } from "react";

/** 0 at section enter, 1 at section exit — for scroll-scrubbed animations. */
export function useSectionScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height + viewport;
      const traveled = viewport - rect.top;
      const next = Math.min(1, Math.max(0, traveled / total));
      setProgress(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}
