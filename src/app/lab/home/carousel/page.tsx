import Link from "next/link";

import { BottomScene } from "@/components/BottomScene";

export const metadata = {
  title: "Carousel hero",
  robots: { index: false, follow: false },
};

/** Live preview — sprite horse, sliding project cards, and speed slider over the grass video. */
export default function HomeCarouselLabPage() {
  return (
    <>
      <div className="relative min-h-[180vh]" aria-hidden={false}>
        <BottomScene />
      </div>

      <div className="relative z-40 border-t border-zinc-200/80 bg-[#faf9f7] px-6 py-10 text-center">
        <p className="text-sm text-zinc-500">Earlier homepage iteration</p>
        <Link
          href="/"
          className="mt-2 inline-block text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-[3px] hover:decoration-zinc-500"
        >
          Back to current site →
        </Link>
      </div>
    </>
  );
}
