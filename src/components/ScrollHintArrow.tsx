"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Fixed down-arrow — hides once the page bottom is in view. */
export function ScrollHintArrow() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - window.scrollY - window.innerHeight;
      setAtBottom(remaining <= 48);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      href="#intro"
      aria-label="Scroll to intro"
      aria-hidden={atBottom}
      tabIndex={atBottom ? -1 : undefined}
      className={cn(
        "scroll-hint-arrow fixed inset-x-0 bottom-6 z-[9999] flex justify-center text-white/70 transition-opacity duration-300",
        atBottom && "pointer-events-none opacity-0",
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6 8 11 13 6" />
      </svg>
    </a>
  );
}
