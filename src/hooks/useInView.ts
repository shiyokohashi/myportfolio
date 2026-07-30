"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = IntersectionObserverInit & {
  once?: boolean;
  /** When false, treat the element as in view immediately (skip observer). */
  disabled?: boolean;
};

function isElementInView(element: HTMLElement, rootMargin = "0px"): boolean {
  const marginY = Number.parseFloat(rootMargin.split(/\s+/)[0] ?? "0") || 0;
  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.bottom >= -marginY && rect.top <= viewportHeight + marginY;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const {
    once = true,
    threshold = 0.12,
    rootMargin = "0px 0px -6% 0px",
    root,
    disabled = false,
  } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    if (isElementInView(element, rootMargin)) {
      setInView(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin, root },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [disabled, once, threshold, rootMargin, root]);

  return { ref, inView };
}
