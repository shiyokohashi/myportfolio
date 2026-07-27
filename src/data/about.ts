import type { AboutContent } from "@/types/portfolio";

/** About Me copy — shown on the home page after scrolling down. */
export const ABOUT: AboutContent = {
  title: "About Me",
  portrait: "/images/about/portrait.png",
  paragraphs: [
    "Second-year Cognitive Science Design & Interaction student at UC San Diego building digital experiences, visual identities, and brands at the intersection of creativity and technology.",
  ],
  bullets: [],
  connect: {
    resume: {
      label: "Resume",
      href: "/resume.pdf",
    },
    email: "shiyo.ohashi@gmail.com",
    linkedin: {
      label: "Shiyo Ohashi",
      href: "https://www.linkedin.com/in/shiyo-ohashi",
    },
  },
};
