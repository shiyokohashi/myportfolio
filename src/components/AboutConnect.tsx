"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { ABOUT } from "@/data/about";

/** Resume, email, and LinkedIn — fades in at the bottom of the about section. */
export function AboutConnect() {
  const { connect } = ABOUT;

  return (
    <ScrollReveal
      className="mx-auto mt-16 max-w-3xl font-sans sm:mt-20 lg:mt-24"
      offsetY={14}
      delayMs={80}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] tracking-wide text-zinc-400 sm:text-[11px]">
        <a
          href={connect.resume.href}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline transition-opacity hover:opacity-70"
        >
          {connect.resume.label}
        </a>

        <a
          href={`mailto:${connect.email}`}
          className="no-underline transition-opacity hover:opacity-70"
        >
          {connect.email}
        </a>

        <a
          href={connect.linkedin.href}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline transition-opacity hover:opacity-70"
        >
          LinkedIn
        </a>
      </div>
    </ScrollReveal>
  );
}
