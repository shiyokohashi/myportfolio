import Image from "next/image";

import favicon from "@/app/icon.png";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HOME_INTRO } from "@/data/home";
import { HOME_TYPE, PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** About / Intro — name, positioning, proof, clear CTA. */
export function HomeIntro() {
  return (
    <section
      id="intro"
      aria-labelledby="intro-heading"
      className={cn(
        "relative z-40 flex min-h-screen scroll-mt-20 items-center justify-center pt-44 pb-48 sm:pt-52 sm:pb-56 lg:pt-56 lg:pb-64",
        PAGE_GUTTER,
      )}
    >
      <ScrollReveal className="mx-auto w-full max-w-5xl text-center" offsetY={20}>
        <Image
          src={favicon}
          alt=""
          width={240}
          height={240}
          priority
          className="mx-auto mb-14 size-40 object-cover sm:mb-16 sm:size-52 lg:mb-20 lg:size-60"
        />

        <h1 id="intro-heading" className={cn(HOME_TYPE.name, "text-zinc-900")}>
          {HOME_INTRO.name}
        </h1>

        <p className={cn(HOME_TYPE.body, "mx-auto mt-12 max-w-xl text-zinc-600 sm:mt-14")}>
          {HOME_INTRO.positioning}
        </p>

        <p className={cn(HOME_TYPE.body, "mx-auto mt-10 max-w-xl text-zinc-500")}>
          {HOME_INTRO.proof}
        </p>

        <p
          className={cn(
            HOME_TYPE.meta,
            "mt-12 flex flex-wrap items-baseline justify-center gap-x-6 gap-y-3 text-zinc-500 sm:gap-x-8",
          )}
        >
          <a
            href={HOME_INTRO.primaryCta.href}
            className={cn(
              HOME_TYPE.item,
              "text-zinc-900 transition-opacity hover:opacity-60",
            )}
          >
            {HOME_INTRO.primaryCta.label}
          </a>
          {HOME_INTRO.secondaryLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </p>
      </ScrollReveal>
    </section>
  );
}
