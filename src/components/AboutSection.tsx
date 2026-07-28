import Image from "next/image";

import { AboutConnect } from "@/components/AboutConnect";
import { ABOUT } from "@/data/about";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

/**
 * About Me — first section after scrolling past the hero on the home page.
 * Edit copy in src/data/about.ts
 */
export function AboutSection() {
  const { portrait } = ABOUT;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={cn(
        "relative z-40 flex min-h-screen scroll-mt-20 items-center justify-center pt-36 pb-40 sm:pt-40 sm:pb-48 lg:pt-44 lg:pb-52",
        PAGE_GUTTER,
      )}
    >
      <div className="mx-auto w-full max-w-[min(1400px,98vw)] text-center">
        {portrait && (
          <div className="mx-auto mb-8 w-[min(120px,28vw)] sm:mb-10">
            <Image
              src={portrait}
              alt=""
              width={800}
              height={800}
              className="h-auto w-full"
              priority
            />
          </div>
        )}

        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {ABOUT.paragraphs.map((paragraph, index) =>
            index === 0 ? (
              <h2
                key={index}
                id="about-heading"
                className="mx-auto max-w-[min(880px,88vw)] text-3xl leading-snug tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              >
                {paragraph}
              </h2>
            ) : (
              <p
                key={index}
                className="text-xs leading-relaxed text-zinc-600 sm:text-sm"
              >
                {paragraph}
              </p>
            ),
          )}

          {ABOUT.bullets && ABOUT.bullets.length > 0 && (
            <p className="mx-auto max-w-3xl text-xs leading-relaxed text-zinc-600 sm:text-sm">
              Currently: {ABOUT.bullets.join(", ")}
            </p>
          )}
        </div>

        <AboutConnect />
      </div>
    </section>
  );
}
