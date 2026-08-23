import { ABOUT } from "@/data/about";

/** Home page copy — edit here to update the landing page. */
export const HOME_INTRO = {
  name: "Shiyo Ohashi",
  /** One-line positioning — who you help + what you do. */
  positioning:
    "I build brands, visual identities, and digital experiences.",
  proof:
    "Currently leading creative & marketing at Triton Trading Group while studying Cognitive Science & Design at UC San Diego.",
  primaryCta: {
    label: "Email",
    href: `mailto:${ABOUT.connect.email}`,
  },
  secondaryLinks: [
    { label: "LinkedIn", href: ABOUT.connect.linkedin.href, external: true },
    { label: "Resume", href: ABOUT.connect.resume.href, external: true },
  ],
} as const;

export type HomeSelectedWorkItem = {
  title: string;
  roles: string;
  /** One short line — outcome or context. */
  blurb: string;
  href: string;
  /** Optional override — defaults to the matching /projects entry thumbnail. */
  thumbnail?: string;
  /** Prefer video poster / image over video on the home grid. */
  poster?: string;
  /** Use contain when on-image text must stay fully visible. */
  thumbnailFit?: "cover" | "contain";
  featured?: boolean;
};

export const HOME_SELECTED_WORK = {
  title: "Selected Work",
  viewAll: { label: "View all work", href: "/projects" },
  items: [
    {
      title: "Secretaryat",
      roles: "Product · Desktop",
      blurb:
        "Task tracker where every task is a horse — finish one, and it runs off the screen.",
      href: "/projects/secretaryat",
      featured: true,
    },
    {
      title: "Triton Trading Group",
      roles: "Brand · Marketing · Creative Direction",
      blurb:
        "700+ followers, 200+ applications, and a 3,400% reach lift to 250K monthly views.",
      href: "/projects/triton-trading-group",
      thumbnail: "/images/projects/triton-trading/recruitment-collage.png",
      thumbnailFit: "cover",
      featured: true,
    },
    {
      title: "Brisbane 2032",
      roles: "Brand · Campaign · Identity",
      blurb: "Olympic identity concept built around Bound for Gold.",
      href: "/projects/brisbane-2032",
      featured: true,
    },
    {
      title: "aeon",
      roles: "Product · Brand · Creative Direction",
      blurb:
        "Wearable product concept and full campaign — designed in a day.",
      href: "/projects/aeon",
    },
    {
      title: "Deskkeeper",
      roles: "Product · Desktop",
      blurb: "Desktop file review app for sorting downloads and loose files.",
      href: "/projects/deskkeeper",
    },
    {
      title: "Imployed",
      roles: "Product · Brand · Web",
      blurb: "Career discovery product for browsing 1,700+ roles.",
      href: "/projects/imployed",
    },
  ] satisfies HomeSelectedWorkItem[],
} as const;

export const HOME_SERVICES = {
  title: "What I do",
  items: [
    {
      title: "Brand",
      description:
        "Identity systems, visual languages, and guidelines that stay coherent across every touchpoint.",
    },
    {
      title: "Digital",
      description:
        "Websites, product UI, and digital experiences built for clarity and conversion.",
    },
    {
      title: "Creative",
      description:
        "Art direction and campaigns that give brands a clear point of view.",
    },
    {
      title: "Strategy",
      description:
        "Positioning and creative strategy that make the work harder to ignore.",
    },
  ],
} as const;

export const HOME_JOURNALISM = {
  title: "Journalism",
  blurb: "Editorial cartoons, feature photos, and commission pieces.",
  viewAll: { label: "View all journalism", href: "/journalism" },
  items: [
    {
      title: "Abort the Court",
      href: "/journalism/abort-the-court",
      thumbnail: "/images/journalism/thumbs/abort-the-court.jpg",
    },
    {
      title: "Bleeding Red, White, and Blue",
      href: "/journalism/bleeding-red-white-and-blue",
      thumbnail: "/images/journalism/thumbs/bleeding-red-white-and-blue.jpeg",
    },
    {
      title: "The Meta-Curse",
      href: "/journalism/the-meta-curse",
      thumbnail: "/images/journalism/thumbs/the-meta-curse.jpg",
    },
  ],
} as const;

export const HOME_PAINTINGS = {
  title: "Paintings",
  blurb: "Back to basics — traditional mediums and canvas work.",
  viewAll: { label: "View all paintings", href: "/paintings" },
  commission: {
    label: "Commission Me",
    href: `mailto:${ABOUT.connect.email}`,
  },
  items: [
    {
      title: "Tiger Daughter",
      href: "/paintings/tiger-daughter-2026",
      thumbnail: "/images/paintings/tiger-daughter-2026.png",
    },
    {
      title: "Leaving the Nest",
      href: "/paintings/wings",
      thumbnail: "/images/paintings/thumbs/panorama-2026.jpeg",
    },
  ],
} as const;

export const HOME_ILLUSTRATIONS = {
  title: "Illustrations",
  viewAll: { label: "View all illustrations", href: "/illustrations" },
  items: [
    {
      title: "Kitchen Gathering",
      summary: "NYC live drawings · Ink · July 2023",
      href: "/illustrations/kitchen-gathering",
      thumbnail: "/images/sketches/kitchen-gathering.png",
    },
    {
      title: "Fashion Illustrations",
      summary: "Fashion illustrations · July 2023",
      href: "/illustrations/fashion-sketch",
      thumbnail: "/images/sketches/fashion-sketch.png",
    },
    {
      title: "Blue Floral Portrait",
      summary: "Procreate · August 2025",
      href: "/illustrations/blue-floral-portrait",
      thumbnail: "/images/sketches/blue-floral-portrait.png",
    },
  ],
} as const;

export const HOME_CONTACT = {
  headline: "Let's talk.",
  blurb: "Available for freelance — brand, digital, and creative projects.",
  primaryCta: {
    label: "Email",
    href: `mailto:${ABOUT.connect.email}`,
    detail: ABOUT.connect.email,
  },
  secondaryLinks: [
    { label: "LinkedIn", href: ABOUT.connect.linkedin.href, external: true },
    { label: "Resume", href: ABOUT.connect.resume.href, external: true },
  ],
} as const;
