import Image from "next/image";

import { HOME_ABOUT } from "@/data/home";
import { PAGE_GUTTER, SECTION_PY, WORKS_MAX } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** About — design × technology × business. */
export function HomeAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={cn("relative z-40 scroll-mt-24", SECTION_PY, PAGE_GUTTER)}
    >
      <div className={cn("mx-auto w-full", WORKS_MAX)}>
        <p className="text-sm text-zinc-400">
          About
        </p>

        <div className="mt-10 grid items-start gap-12 lg:mt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {HOME_ABOUT.portrait ? (
            <div className="mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-none">
              <Image
                src={HOME_ABOUT.portrait}
                alt=""
                width={800}
                height={800}
                className="h-auto w-full"
              />
            </div>
          ) : null}

          <div>
            <h2
              id="about-heading"
              className="font-display text-4xl tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              {HOME_ABOUT.headline}
            </h2>
            {HOME_ABOUT.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-8 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
