import Link from "next/link";

import { ScrollReveal } from "@/components/ScrollReveal";
import { NAV_ITEMS } from "@/config/navigation";
import { HOME_CONTACT } from "@/data/home";
import { HOME_TYPE, PAGE_END_PB, PAGE_GUTTER, WORKS_MAX } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Contact as a large closing section — footer sits at the page foot. */
export function HomeContact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={cn(
        "relative z-40 scroll-mt-24 border-t border-zinc-200 bg-white",
        PAGE_GUTTER,
      )}
    >
      <div className={cn("mx-auto w-full pt-32 sm:pt-40 lg:pt-48", WORKS_MAX)}>
        <ScrollReveal offsetY={22}>
          <h2
            id="contact-heading"
            className={cn(HOME_TYPE.display, "max-w-3xl text-zinc-900")}
          >
            {HOME_CONTACT.headline}
          </h2>
          <p className={cn(HOME_TYPE.body, "mt-8 max-w-xl text-zinc-500 sm:mt-10")}>
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
                "text-zinc-900 transition-opacity hover:opacity-60",
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
                className="transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Clears fixed horse UI, then footer at the true page foot */}
      <div className={cn(PAGE_END_PB)} aria-hidden />

      <footer
        className={cn(
          "mx-auto flex w-full flex-col gap-10 border-t border-zinc-200 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-12",
          WORKS_MAX,
        )}
      >
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
              className="transition-opacity hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className={cn(HOME_TYPE.meta, "text-zinc-500")}>Shiyo Ohashi</p>
      </footer>
    </section>
  );
}
