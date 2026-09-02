"use client";

import { HomeContact } from "@/components/HomeContact";
import { HomeIllustrations } from "@/components/HomeIllustrations";
import { HomeIntro } from "@/components/HomeIntro";
import { HomeJournalism } from "@/components/HomeJournalism";
import { HomePaintings } from "@/components/HomePaintings";
import { HomePreloads } from "@/components/HomePreloads";
import { HomeSelectedWork } from "@/components/HomeSelectedWork";
import { NextHero } from "@/app/lab/home/next/NextHero";

/**
 * Sandbox homepage — edit here only. Mirrors `/` today; merge back when ready.
 * Route: /lab/home/next
 */
export function HomeNextIteration() {
  return (
    <>
      <HomePreloads />

      <NextHero />

      <HomeIntro />
      <HomeSelectedWork />

      <div className="relative z-40 border-t border-zinc-200/80 bg-zinc-50">
        <HomeJournalism />
        <HomePaintings />
        <HomeIllustrations />
      </div>

      <HomeContact />
    </>
  );
}
