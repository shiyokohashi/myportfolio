"use client";

import { ABOUT } from "@/data/about";
import { HOME_INTRO } from "@/data/home";

export function AboutWindowContents() {
  return (
    <article className="about-window">
      <header className="about-window__header">
        <h2 className="about-window__title">{HOME_INTRO.name}</h2>
        <p className="about-window__lead">{HOME_INTRO.positioning}</p>
      </header>
      <p className="about-window__body">{HOME_INTRO.proof}</p>
      {ABOUT.paragraphs.map((paragraph) => (
        <p key={paragraph} className="about-window__body">
          {paragraph}
        </p>
      ))}
      <p className="about-window__links">
        <a href={HOME_INTRO.primaryCta.href}>{HOME_INTRO.primaryCta.label}</a>
        {HOME_INTRO.secondaryLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {link.label}
          </a>
        ))}
      </p>
    </article>
  );
}
