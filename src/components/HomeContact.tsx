import Link from "next/link";

import { ScrollReveal } from "@/components/ScrollReveal";
import { NAV_ITEMS } from "@/config/navigation";
import { HOME_CONTACT } from "@/data/home";
import { HOME_TYPE, PAGE_GUTTER, WORKS_MAX } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Contact as a large closing footer — Email primary. */
export function HomeContact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={cn(
        "relative z-40 scroll-mt-24 border-t border-zinc-200 bg-zinc-950 text-zinc-100",
        PAGE_GUTTER,
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-[min(85vh,860px)] w-full flex-col justify-between py-32 sm:py-40 lg:py-48",
          WORKS_MAX,
        )}
      >
        <ScrollReveal offsetY={22}>
          <h2
            id="contact-heading"
            className={cn(HOME_TYPE.display, "max-w-3xl text-zinc-50")}
          >
            {HOME_CONTACT.headline}
          </h2>
          <p className={cn(HOME_TYPE.body, "mt-8 max-w-xl text-zinc-400 sm:mt-10")}>
            {HOME_CONTACT.blurb}
          </p>

          <div
            className={cn(
              HOME_TYPE.meta,
              "mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-3 text-zinc-500 sm:mt-16 sm:gap-x-10",
            )}
          >
            <a
              href={HOME_CONTACT.primaryCta.href}
              className={cn(
                HOME_TYPE.item,
                "text-zinc-50 transition-opacity hover:opacity-60",
              )}
            >
              {HOME_CONTACT.primaryCta.label}
            </a>
            {HOME_CONTACT.secondaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="transition-opacity hover:text-zinc-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </ScrollReveal>

        <footer className="mt-28 flex flex-col gap-10 border-t border-zinc-800 pt-10 sm:mt-36 sm:flex-row sm:items-end sm:justify-between">
          <nav
            aria-label="Footer"
            className={cn(
              HOME_TYPE.meta,
              "flex flex-wrap gap-x-8 gap-y-3 text-zinc-500",
            )}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-opacity hover:text-zinc-200 hover:opacity-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className={cn(HOME_TYPE.meta, "text-zinc-600")}>
            Shiyo Ohashi
          </p>
        </footer>
      </div>
    </section>
  );
}
