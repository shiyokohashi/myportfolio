"use client";

import { useEffect, useState } from "react";

import {
  FOOTER_VIDEO_FADE_LEAD_PX,
  FOOTER_VIDEO_FADE_PX,
  SCROLL_BG_FULL_PX,
} from "@/config/navigation";

function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

/** Extra easing so the footer video eases in gently at the start and end. */
function footerEase(value: number): number {
  return smoothstep(smoothstep(value));
}

export function useScrollReveal() {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  const [bottomSceneOpacity, setBottomSceneOpacity] = useState(1);
  const [footerVideoReveal, setFooterVideoReveal] = useState(0);

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

      const nextBackgroundOpacity =
        baseWhiteOpacity * (1 - nextFooterVideoReveal);
      const nextBottomSceneOpacity =
        (1 - baseWhiteOpacity) * (1 - nextFooterVideoReveal);

      setBackgroundOpacity(nextBackgroundOpacity);
      setBottomSceneOpacity(nextBottomSceneOpacity);
      setFooterVideoReveal(nextFooterVideoReveal);
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

  return { backgroundOpacity, bottomSceneOpacity, footerVideoReveal };
}
