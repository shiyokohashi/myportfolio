"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { FOOTER_CREDITS } from "@/data/footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

function CreditRole({ children }: { children: ReactNode }) {
  return (
    <p className="text-base text-white/90 sm:text-lg">{children}</p>
  );
}

function CreditValue({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-2 text-white", className)}>{children}</p>
  );
}

function CreditsBlock({ ariaHidden }: { ariaHidden?: boolean }) {
  const { thankYou, portfolioBy, basedIn, continue: continueSection } =
    FOOTER_CREDITS;

  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="film-credits-block mx-auto w-full max-w-md px-6 py-10 text-center"
    >
      <p className="py-4 font-display text-3xl text-white sm:text-4xl">
        {thankYou}
      </p>

      <div className="py-6 sm:py-8">
        <CreditRole>{portfolioBy.label}</CreditRole>
        <CreditValue className="font-display text-2xl sm:text-3xl">
          {portfolioBy.name}
        </CreditValue>
      </div>

      <div className="py-6 sm:py-8">
        <CreditRole>{basedIn.label}</CreditRole>
        <CreditValue className="text-base sm:text-lg">{basedIn.location}</CreditValue>
      </div>

      <div className="py-6 sm:py-8">
        <CreditRole>{continueSection.label}</CreditRole>
        <nav
          aria-label="Contact links"
          className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-base text-white sm:text-lg"
        >
          {continueSection.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="film-credits-link no-underline text-white transition-opacity hover:opacity-95"
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function CreditsCycle({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <>
      <CreditsBlock ariaHidden={ariaHidden} />
      <div className="film-credits-cycle-gap" aria-hidden />
    </>
  );
}

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const { footerVideoReveal } = useScrollReveal();
  const [creditsActive, setCreditsActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const creditsOpacity = Math.min(
    1,
    Math.max(0, (footerVideoReveal - 0.12) / 0.72),
  );
  const creditsFade = creditsOpacity * creditsOpacity * (3 - 2 * creditsOpacity);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);

    const node = footerRef.current;
    if (!node) {
      return () => media.removeEventListener("change", updateMotion);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setCreditsActive(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      aria-label="Closing credits"
      className="relative z-40 min-h-screen"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[min(58vh,28rem)]"
        style={{
          opacity: 1 - footerVideoReveal,
          background:
            "linear-gradient(to bottom, rgb(255 255 255) 0%, rgb(255 255 255 / 0.92) 18%, rgb(255 255 255 / 0.55) 52%, transparent 100%)",
        }}
      />

      <div
        aria-hidden
        className="film-credits-scrim absolute inset-0"
        style={{ opacity: footerVideoReveal * 0.85 }}
      />

      <div
        className="film-credits-viewport absolute inset-0 z-[1] overflow-hidden"
        style={{ opacity: creditsFade }}
      >
        {reduceMotion ? (
          <div className="relative z-[1] flex h-full items-center justify-center">
            <CreditsBlock />
          </div>
        ) : (
          <div
            className={cn(
              "film-credits-loop",
              creditsActive && "film-credits-loop-active",
            )}
          >
            <CreditsCycle />
            <CreditsCycle ariaHidden />
          </div>
        )}
      </div>
    </footer>
  );
}
