export type HomeIteration = {
  id: string;
  title: string;
  /** Short label, e.g. "Current" */
  badge?: string;
  description: string;
  /** Drop screenshots in public/images/home-iterations/ */
  image?: string;
  video?: string;
  liveHref?: string;
  liveLabel?: string;
};

export const HOME_ITERATIONS: HomeIteration[] = [
  {
    id: "glass-corridor",
    title: "Glass horse corridor",
    badge: "Previous",
    description:
      "The last live homepage — a 3D horse galloping through a glass corridor. Scroll to fade into the rest of the page.",
    video: "/videos/glass-corridor.mov",
    image: "/images/home-iterations/glass-corridor-wide.png",
    liveHref: "/point-cloud-horse",
    liveLabel: "Try live",
  },
  {
    id: "carousel-hero",
    title: "Carousel galloping horse",
    description:
      "Sprite horse running along the bottom, project cards sliding past, and a speed slider tied to the grass background.",
    video: "/videos/carousel-hero.mov",
    liveHref: "/lab/home/carousel",
    liveLabel: "Try live",
  },
  {
    id: "sketchbook",
    title: "Sketchbook spread",
    description:
      "Earlier homepage mock — projects, paintings, and journalism arranged like an open sketchbook.",
    image: "/images/home-iterations/sketchbook.png",
    video: "/videos/portfolio-sketchbook.mov",
    liveHref: "/projects/portfolio-sketchbook",
    liveLabel: "View mock",
  },
  {
    id: "earliest-website",
    title: "My earliest website",
    description:
      "First portfolio site on Readymag — hand-drawn sketchbook layout with journalism, art, and graphic design.",
    image: "/images/home-iterations/earliest-website.png",
    liveHref: "https://readymag.website/u2798158916/4888419/",
    liveLabel: "View site",
  },
];
