import { ABOUT } from "@/data/about";

export const FOOTER_CREDITS = {
  thankYou: "Thank you for exploring!",
  portfolioBy: {
    label: "A portfolio by",
    name: "Shiyo Ohashi.",
  },
  basedIn: {
    label: "Based in",
    location: "San Francisco Bay Area + San Diego",
  },
  continue: {
    label: "Want to continue the journey?",
    links: [
      { label: "Resume", href: ABOUT.connect.resume.href },
      { label: "LinkedIn", href: ABOUT.connect.linkedin.href },
      { label: "Email", href: `mailto:${ABOUT.connect.email}` },
    ],
  },
} as const;
