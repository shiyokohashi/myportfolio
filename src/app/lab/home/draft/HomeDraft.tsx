"use client";

import Link from "next/link";

import { DraftHero } from "./DraftHero";

/**
 * Sandbox homepage for new ideas. Does not affect `/`.
 * Route: /lab/home/draft
 */
export function HomeDraft() {
  return (
    <>
      <DraftHero />

      <div className="relative z-40 border-t border-black/10 bg-black/20 px-6 py-6 text-center backdrop-blur-md">
        <p className="text-sm text-white/85">Homepage draft — not linked from the live site</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/"
            className="font-medium text-white underline decoration-white/40 underline-offset-[3px] hover:decoration-white"
          >
            Current homepage →
          </Link>
          <Link
            href="/lab/home/next"
            className="text-white/80 underline decoration-white/25 underline-offset-[3px] hover:text-white hover:decoration-white/60"
          >
            Previous next iteration →
          </Link>
        </div>
      </div>
    </>
  );
}
