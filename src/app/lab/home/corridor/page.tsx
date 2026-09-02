import Link from "next/link";

import { HorseCorridorHero } from "@/components/HorseCorridorHero";

export const metadata = {
  title: "Glass corridor",
  robots: { index: false, follow: false },
};

/** Live preview — original glass corridor framing (screen recording match). */
export default function HomeCorridorLabPage() {
  return (
    <>
      <HorseCorridorHero preset="default" />

      <div className="relative z-40 border-t border-zinc-200/80 bg-[#faf9f7] px-6 py-10 text-center">
        <p className="text-sm text-zinc-500">Earlier homepage iteration</p>
        <Link
          href="/"
          className="mt-2 inline-block text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-[3px] hover:decoration-zinc-500"
        >
          Back to full site →
        </Link>
      </div>
    </>
  );
}
