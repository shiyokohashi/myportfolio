"use client";

import { useEffect, useRef } from "react";

export type HorseEscapePayload = {
  strip: string;
  frameCount: number;
  frameW: number;
  frameH: number;
  fps: number;
  direction: number;
  viewportX: number;
  viewportY: number;
};

const HORSE_H = 95;

type HorseEscapeOverlayProps = {
  payload: HorseEscapePayload;
  onDone: () => void;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function HorseEscapeOverlay({ payload, onDone }: HorseEscapeOverlayProps) {
  const horseRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      doneRef.current = true;
      onDone();
    };

    const run = async () => {
      const horse = horseRef.current;
      const canvas = canvasRef.current;
      if (!horse || !canvas) {
        finish();
        return;
      }

      let stripImg: HTMLImageElement;
      try {
        stripImg = await loadImage(payload.strip);
      } catch {
        finish();
        return;
      }

      const frameCount = payload.frameCount || 12;
      const frameW = payload.frameW || Math.round(stripImg.naturalWidth / frameCount);
      const frameH = payload.frameH || stripImg.naturalHeight;
      const fps = payload.fps || 12;
      const runRight = payload.direction >= 0;
      const face = runRight ? 1 : -1;
      const frameDispW = Math.round((HORSE_H * frameW) / frameH);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        finish();
        return;
      }

      canvas.width = frameDispW;
      canvas.height = HORSE_H;

      const displayW = window.innerWidth;
      const displayH = window.innerHeight;
      const startX = payload.viewportX - frameDispW / 2;
      const startY = Math.min(
        Math.max(payload.viewportY - HORSE_H * 0.85, 8),
        displayH - HORSE_H - 8,
      );
      const endX = runRight ? displayW + frameDispW + 40 : -frameDispW - 40;
      const distance = Math.abs(endX - startX);
      const speed = 880;
      const durationMs = Math.max(2000, (distance / speed) * 1000);
      const frameMs = 1000 / fps;
      const leapPeak = 28;

      horse.style.width = `${frameDispW}px`;
      horse.style.height = `${HORSE_H}px`;
      horse.style.setProperty("--face", String(face));
      horse.style.opacity = "1";
      horse.style.transform = `translate3d(${Math.round(startX)}px, ${Math.round(startY)}px, 0)`;
      horse.hidden = false;

      const drawFrame = (index: number) => {
        const sx = index * frameW;
        ctx.clearRect(0, 0, frameDispW, HORSE_H);
        ctx.drawImage(stripImg, sx, 0, frameW, frameH, 0, 0, frameDispW, HORSE_H);
      };

      drawFrame(0);

      const started = performance.now();
      let lastFrame = 0;

      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const tick = (now: number) => {
        const elapsed = now - started;
        const t = Math.min(1, elapsed / durationMs);
        const travel = easeInOut(t);

        const x = startX + (endX - startX) * travel;
        let y = startY;
        if (t < 0.14) {
          y = startY - Math.sin((t / 0.14) * Math.PI) * leapPeak;
        }

        horse.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;

        const frame = Math.floor(elapsed / frameMs) % frameCount;
        if (frame !== lastFrame) {
          lastFrame = frame;
          drawFrame(frame);
        }

        const fullyOff = runRight ? x >= displayW : x + frameDispW <= 0;
        if (fullyOff) horse.style.opacity = "0";

        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          finish();
        }
      };

      raf = requestAnimationFrame(tick);
      window.setTimeout(finish, durationMs + 500);
    };

    void run();

    return () => {
      finished = true;
      cancelAnimationFrame(raf);
    };
  }, [onDone, payload]);

  return (
    <div className="horse-escape-overlay" aria-hidden>
      <div ref={horseRef} className="horse-escape-overlay__horse" hidden>
        <canvas ref={canvasRef} className="horse-escape-overlay__sprite" />
      </div>
    </div>
  );
}
