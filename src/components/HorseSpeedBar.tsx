"use client";

import { useEffect, useRef, useState } from "react";

import type { SetHorseSpeedOptions } from "@/hooks/useSyncedAnimation";
import { PAGE_GUTTER } from "@/lib/layout";
import {
  HORSE_SPEED_SLIDER_MAX,
  HORSE_SPEED_SLIDER_MIN,
  sliderValueToSpeed,
  speedToSliderValue,
} from "@/lib/horseSpeedSlider";
import { cn } from "@/lib/utils";
import { isSpeedAtEndpoint, SECRET_FRAME } from "@/lib/secretFrame";

export type HorseSpeedBarProps = {
  speed: number;
  onSpeedChange: (speed: number, options?: SetHorseSpeedOptions) => void;
  frameIndex?: number;
  frameCount?: number;
  className?: string;
  hidden?: boolean;
};

function formatSpeed(speed: number): string {
  if (speed < 1) return `${speed.toFixed(1)}×`;
  return `${speed.toFixed(speed % 1 === 0 ? 0 : 1)}×`;
}

function formatFrame(frameIndex: number, frameCount: number): string {
  return `${String(frameIndex + 1).padStart(2, "0")} / ${String(frameCount).padStart(2, "0")}`;
}

export function HorseSpeedBar({
  speed,
  onSpeedChange,
  frameIndex,
  frameCount,
  className,
  hidden = false,
}: HorseSpeedBarProps) {
  const [sliderValue, setSliderValue] = useState(() => speedToSliderValue(speed));
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setSliderValue(speedToSliderValue(speed));
    }
  }, [speed]);

  const displaySpeed = sliderValueToSpeed(sliderValue);
  const secretFrameActive = isSpeedAtEndpoint(displaySpeed);

  const handleSliderInput = (value: number) => {
    setSliderValue(value);
    onSpeedChange(sliderValueToSpeed(value), { immediate: true, commit: false });
  };

  const finishDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    onSpeedChange(displaySpeed, { immediate: true, commit: true });
  };

  return (
    <div
      className={cn(
        "horse-speed-bar w-full opacity-80 transition-opacity duration-200",
        hidden && "pointer-events-none opacity-0",
        className,
      )}
      aria-hidden={hidden}
    >
      <div className={cn("flex items-center gap-3 py-2", PAGE_GUTTER)}>
        {frameIndex !== undefined && frameCount !== undefined ? (
          <span
            aria-hidden
            className="w-12 shrink-0 text-left text-[10px] tabular-nums tracking-[0.08em] text-white/45 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
          >
            {secretFrameActive
              ? `${String(SECRET_FRAME.number).padStart(2, "0")} / ${String(SECRET_FRAME.number).padStart(2, "0")}`
              : formatFrame(frameIndex, frameCount)}
          </span>
        ) : null}
        <input
          id="horse-speed"
          type="range"
          min={HORSE_SPEED_SLIDER_MIN}
          max={HORSE_SPEED_SLIDER_MAX}
          step={1}
          value={sliderValue}
          aria-label="Horse speed"
          onPointerDown={(event) => {
            isDraggingRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={finishDrag}
          onInput={(event) =>
            handleSliderInput(Number(event.currentTarget.value))
          }
          className="horse-speed-slider min-w-0 flex-1"
          aria-valuetext={formatSpeed(displaySpeed)}
        />
        <span
          aria-hidden
          className="w-10 shrink-0 text-right text-xs tabular-nums text-white/50 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
        >
          {formatSpeed(displaySpeed)}
        </span>
      </div>
    </div>
  );
}
