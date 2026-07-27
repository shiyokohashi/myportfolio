import Image from "next/image";

import { ABOUT } from "@/data/about";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

/**
 * About Me — first section after scrolling past the hero on the home page.
 * Edit copy in src/data/about.ts
 */
export function AboutSection() {
  const { connect, portrait } = ABOUT;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={cn(
        "relative z-40 flex min-h-screen scroll-mt-20 items-center justify-center pt-28 pb-32 sm:pt-32 sm:pb-36",
        PAGE_GUTTER,
      )}
    >
      <div className="mx-auto w-full max-w-[min(1400px,98vw)] text-center">
        {portrait && (
          <div className="mx-auto mb-5 w-[min(120px,28vw)] sm:mb-6">
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

        <div className="space-y-10 sm:space-y-12">
          {ABOUT.paragraphs.map((paragraph, index) =>
            index === 0 ? (
              <h2
                key={index}
                id="about-heading"
                className="mx-auto max-w-[min(920px,92vw)] text-3xl leading-snug tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl"
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

        <div className="mx-auto mt-14 max-w-3xl font-sans sm:mt-16">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-600 sm:text-sm">
            <a
              href={connect.resume.href}
              className="transition-opacity hover:opacity-70"
            >
              {connect.resume.label}
            </a>

            <a
              href={`mailto:${connect.email}`}
              className="transition-opacity hover:opacity-70"
            >
              {connect.email}
            </a>

            <a
              href={connect.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
