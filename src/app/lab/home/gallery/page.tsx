import Link from "next/link";

import { PerspectiveGallery } from "@/components/PerspectiveGallery";

export const metadata = {
  title: "Perspective gallery",
  robots: { index: false, follow: false },
};

/** Live preview of an earlier homepage — pinned perspective gallery + grass background. */
export default function HomeGalleryLabPage() {
  return (
    <>
      <PerspectiveGallery />
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
