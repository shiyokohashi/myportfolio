"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  HOME_ITERATIONS,
  type HomeIteration,
} from "@/data/home-iterations";
import { cn } from "@/lib/utils";

function IterationPreview({ iteration }: { iteration: HomeIteration }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showVideo = iteration.video || (iteration.image && imageFailed);
  const showImage = iteration.image && !imageFailed && !iteration.video;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-zinc-100">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iteration.image}
          alt=""
          className="h-full w-full object-cover object-top"
          onError={() => setImageFailed(true)}
        />
      ) : showVideo ? (
        <video
          src={iteration.video}
          className="h-full w-full object-cover object-top"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-zinc-400">
          Screenshot coming soon
        </div>
      )}
    </div>
  );
}

function IterationRow({ iteration }: { iteration: HomeIteration }) {
  return (
    <article className="space-y-3">
      <IterationPreview iteration={iteration} />
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 className="font-display text-base font-semibold tracking-tight text-zinc-900">
            {iteration.title}
          </h3>
          {iteration.badge ? (
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
              {iteration.badge}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-zinc-600">
          {iteration.description}
        </p>
        {iteration.liveHref ? (
          iteration.liveHref.startsWith("http") ? (
            <a
              href={iteration.liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-[3px] transition-colors hover:decoration-zinc-500"
            >
              {iteration.liveLabel ?? "Open"} →
            </a>
          ) : (
            <Link
              href={iteration.liveHref}
              className="inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-[3px] transition-colors hover:decoration-zinc-500"
            >
              {iteration.liveLabel ?? "Open"} →
            </Link>
          )
        ) : null}
      </div>
    </article>
  );
}

export function HomeIterationsPanel({ variant = "default" }: { variant?: "default" | "desktop" }) {
  const isDesktop = variant === "desktop";
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          isDesktop
            ? "desktop-iterations-trigger"
            : "absolute bottom-[clamp(1rem,3vw,1.5rem)] right-[clamp(1rem,3vw,1.5rem)] z-[2] border-0 bg-transparent p-0 font-sans text-[10px] font-medium tracking-[0.02em] text-zinc-500 transition hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2",
        )}
      >
        See past iterations
      </button>

      {open ? (
        <div
          className={cn(
            "fixed inset-0 flex items-end justify-center bg-black/30 p-4 backdrop-blur-[1px] sm:items-center",
            isDesktop ? "z-[10050]" : "z-[110]",
          )}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-iterations-title"
        >
          <div
            className="max-h-[min(88vh,720px)] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-200/80 bg-[#faf9f7] p-5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="home-iterations-title"
                  className="font-display text-lg font-semibold tracking-tight text-zinc-900"
                >
                  Homepage iterations
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {isDesktop
                    ? "Earlier homepage directions before the desktop."
                    : "Earlier directions before the current hero."}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {HOME_ITERATIONS.map((iteration) => (
                <IterationRow key={iteration.id} iteration={iteration} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
