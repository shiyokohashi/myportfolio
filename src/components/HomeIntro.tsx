import Image from "next/image";
import Link from "next/link";

import favicon from "@/app/icon.png";
import { HeroExitReveal } from "@/components/HeroExitReveal";
import { HOME_INTRO } from "@/data/home";
import { HOME_TYPE, PAGE_GUTTER, SITE_SURFACE } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** About / Intro — name, positioning, proof, clear CTA. */
export function HomeIntro({ layout = "corridor" }: { layout?: "corridor" | "desktop" }) {
  const isDesktop = layout === "desktop";

  return (
    <section
      id="intro"
      aria-labelledby="intro-heading"
      className={cn(
        "relative z-40 flex scroll-mt-20 items-center",
        SITE_SURFACE,
        isDesktop
          ? "min-h-[58vh] py-16 pb-20 sm:py-20 sm:pb-24"
          : "-mt-[52vh] min-h-[88vh] py-16 sm:py-20",
        PAGE_GUTTER,
      )}
    >
      <HeroExitReveal className="mx-auto w-full max-w-3xl text-center" offsetY={14}>
        <div
          className={cn(
            "flex flex-col items-center",
            isDesktop ? "gap-5 sm:gap-6" : "gap-6 sm:gap-8",
          )}
        >
        <Image
          src={favicon}
          alt=""
          width={160}
          height={160}
          priority
          className="size-24 object-cover sm:size-28"
        />

        <h1 id="intro-heading" className={cn(HOME_TYPE.name, "text-zinc-900")}>
          {HOME_INTRO.name}
        </h1>

        <p className={cn(HOME_TYPE.body, "mx-auto max-w-xl text-zinc-600")}>
          {HOME_INTRO.positioning}
        </p>

        <p className={cn(HOME_TYPE.body, "mx-auto max-w-2xl text-zinc-600")}>
          {HOME_INTRO.proof}
        </p>

        <p className={cn(HOME_TYPE.meta, "text-zinc-500")}>
          <Link href="/projects" className="transition-opacity hover:text-zinc-900 hover:opacity-100">
            Projects
          </Link>
          <span aria-hidden className="px-2">
            ·
          </span>
          <a
            href={HOME_INTRO.primaryCta.href}
            className="transition-opacity hover:text-zinc-900 hover:opacity-100"
          >
            Contact
          </a>
        </p>
        </div>
      </HeroExitReveal>
    </section>
  );
}
