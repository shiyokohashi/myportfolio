"use client";

import { forwardRef, useState } from "react";

import {
  getHorseDisplayWidth,
  HORSE_DISPLAY_HEIGHT_PX,
} from "@/config/animation";
import { getInitialHorseRenderState } from "@/lib/horseEntrance";
import { getHorseFrameInlineStyles } from "@/lib/syncedAnimation";
import { cn } from "@/lib/utils";

export type HorseSpriteProps = {
  className?: string;
  displayHeightPx?: number;
};

/** Sprite-sheet horse gallop. Frames are advanced by the shared rAF controller. */
export const HorseSprite = forwardRef<HTMLDivElement, HorseSpriteProps>(
  function HorseSprite({ className, displayHeightPx = HORSE_DISPLAY_HEIGHT_PX }, ref) {
    const displayWidth = getHorseDisplayWidth(displayHeightPx);
    const [initialRender] = useState(getInitialHorseRenderState);
    const frameStyles = getHorseFrameInlineStyles(
      initialRender.frameIndex,
      displayHeightPx,
    );

    return (
      <div
        ref={ref}
        role="img"
        aria-label="Galloping horse"
        className={cn("relative isolate shrink-0 will-change-transform", className)}
        style={{
          width: displayWidth,
          height: displayHeightPx,
        }}
        suppressHydrationWarning
      >
        <div
          data-sprite-frame
          className="h-full w-full bg-no-repeat backface-hidden [filter:contrast(1.06)_saturate(0.98)]"
          style={frameStyles}
          suppressHydrationWarning
        />
      </div>
    );
  },
);
