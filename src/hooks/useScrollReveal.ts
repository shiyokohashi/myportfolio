"use client";

import { useEffect, useState } from "react";

import { SCROLL_BG_FULL_PX, FOOTER_VIDEO_FADE_PX } from "@/config/navigation";

function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

export function useScrollReveal() {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  const [bottomSceneOpacity, setBottomSceneOpacity] = useState(1);
  const [footerVideoReveal, setFooterVideoReveal] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const baseWhiteOpacity = Math.min(1, scrollY / SCROLL_BG_FULL_PX);
      const footer = document.getElementById("site-footer");
      let footerVideoReveal = 0;

      if (footer) {
        const footerTop = footer.getBoundingClientRect().top + scrollY;
        const viewportBottom = scrollY + window.innerHeight;
        footerVideoReveal = smoothstep(
          Math.min(
            1,
            Math.max(0, (viewportBottom - footerTop) / FOOTER_VIDEO_FADE_PX),
          ),
        );
      }

      const backgroundOpacity = baseWhiteOpacity * (1 - footerVideoReveal);
      const bottomSceneOpacity =
        (1 - baseWhiteOpacity) * (1 - footerVideoReveal);

      setBackgroundOpacity(backgroundOpacity);
      setBottomSceneOpacity(bottomSceneOpacity);
      setFooterVideoReveal(footerVideoReveal);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { backgroundOpacity, bottomSceneOpacity, footerVideoReveal };
}
