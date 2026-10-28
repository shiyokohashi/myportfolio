/**
 * Home notebook — the flipbook between the dock and the intro.
 *
 * The book opens on OPENING (left page) and the intro (right). Projects follow in list order: a
 * project with a `final` takes a whole spread (sketch left, final right); one
 * without takes a single page. Single-page projects are paired up so no page is
 * left blank — see `layoutPages`.
 *
 * Images live in `public/images/notebook/`. Scans with white paper blend into
 * the cream page via multiply.
 */
export type NotebookPage = {
  /** Path under /public. Leave empty for a blank page. */
  image?: string;
  alt?: string;
  /** "contain" keeps margins like a pasted-in print; "cover" bleeds to the page edges. */
  fit?: "contain" | "cover";
  /** With "contain": sit the image at the top of the page, like writing, instead of centered. */
  align?: "top" | "center";
  /** Small "view project" link at the foot of the page. */
  href?: string;
  /**
   * Handwriting split into lines, laid out as groups spread down the page.
   * `x` / `w` are the line's left offset and width as fractions of the text
   * block, so every line keeps the same handwriting size. `href` makes it a link.
   */
  writing?: { image: string; alt: string; x: number; w: number; href?: string }[][];
  /**
   * Several finished pieces glued in, rows top to bottom, read left to right.
   * Each row shares one height; `ratio` is the image's width / height.
   */
  gallery?: {
    /** Still image, or the poster frame when `video` is set. */
    image: string;
    alt: string;
    ratio: number;
    /** Muted, looping clip glued in like a print. */
    video?: string;
  }[][];
  /** A finished piece pasted in below the sketch, like a printed photo. */
  print?: {
    image: string;
    alt: string;
    /** "photo" is glued in with a tilt and shadow; "ink" sits on the paper like the sketch. */
    style?: "photo" | "ink";
    /** Muted, looping clip; `image` becomes its poster frame. */
    video?: string;
  };
};

export type NotebookProject = {
  name: string;
  /** Project page; shown as a link on the sketch page. */
  href?: string;
  /** Left page. */
  sketch: NotebookPage;
  /** Right page. */
  final?: NotebookPage;
};

/** Left page of the first spread: about me, an index of the site, contact. */
const OPENING: NotebookPage = {
  writing: [
    [
      { image: "/images/notebook/opening-greeting.webp", alt: "Hi! I'm Shiyo Ohashi.", x: 0.051, w: 0.354 },
      {
        image: "/images/notebook/opening-currently.webp",
        alt: "Currently: community as an Adobe Student Ambassador; leading marketing @ Triton Finance Group & Women in Tech; GTM, producer, brand design @ stēle; Cognitive Science Design & Interaction @ UC San Diego",
        x: 0.059,
        w: 0.918,
      },
    ],
    [
      { image: "/images/notebook/opening-index.webp", alt: "Full index of my works:", x: 0.023, w: 0.334 },
      { image: "/images/notebook/opening-webdev.webp", alt: "Webdev & Apps (my personal favs)", x: 0.052, w: 0.488, href: "/projects" },
      {
        image: "/images/notebook/opening-branding.webp",
        alt: "Branding (Triton Finance, Scot Scoop, AEON, Brisbane, campaigns…)",
        x: 0.053,
        w: 0.865,
        href: "/graphic-design",
      },
      { image: "/images/notebook/opening-paintings.webp", alt: "Paintings", x: 0.052, w: 0.121, href: "/paintings" },
      { image: "/images/notebook/opening-illustrations.webp", alt: "Illustrations", x: 0.056, w: 0.165, href: "/illustrations" },
      {
        image: "/images/notebook/opening-cartoons.webp",
        alt: "Editorial/digital cartoons (high school – present)",
        x: 0.054,
        w: 0.581,
        href: "/journalism",
      },
    ],
    [
      {
        image: "/images/notebook/opening-contact.webp",
        alt: "Contact @ shiyo.ohashi@gmail.com",
        x: 0.023,
        w: 0.495,
        // Opens a new message to me in the visitor's Gmail.
        href: "https://mail.google.com/mail/?view=cm&fs=1&to=shiyo.ohashi@gmail.com",
      },
    ],
  ],
};

const INTRO: NotebookPage = {
  image: "/images/notebook/intro-analog-girl.png",
  alt: "Handwritten: I've always been an analog girl at heart. I grew up journaling & sketching & writing poetry. Bare my pages and read my mind — here are some initial mockups and thought processes behind my work.",
  align: "top",
};

const PROJECTS: NotebookProject[] = [
  {
    name: "Brisbane 2032",
    href: "/graphic-design/brisbane-2032",
    sketch: {
      image: "/images/notebook/brisbane-2032.webp",
      alt: "Production case study notes and sketches: Olympics design and branding for Brisbane Summer 2032, research, logo explorations and billboard ideas",
      align: "top",
      print: {
        image: "/images/notebook/brisbane-2032-logos.webp",
        alt: "Brisbane 2032 logo explorations: ten kangaroo-and-river marks in blue, green, gold and terracotta with the Olympic rings",
      },
    },
    final: {
      gallery: [
        [
          {
            image: "/images/notebook/brisbane-2032-billboard.webp",
            alt: "Brisbane 32 billboard: Bound for Gold — a kangaroo morphing into sprinters across a yellow track",
            ratio: 1.778,
          },
        ],
        [
          {
            image: "/images/notebook/brisbane-2032-ticket-1.webp",
            alt: "Brisbane 2032 athletics ticket: aerial view of runners on a red track with lane numbers",
            ratio: 0.615,
          },
          {
            image: "/images/notebook/brisbane-2032-ticket-2.webp",
            alt: "Brisbane 2032 swimming ticket: aerial view of swimmers in pool lanes",
            ratio: 0.623,
          },
        ],
      ],
    },
  },
  {
    name: "Portfolio homepage",
    href: "/projects/portfolio-sketchbook",
    sketch: {
      image: "/images/notebook/portfolio-homepage.webp",
      alt: "Website sketch: open-book homepage with projects, paintings, editorial illustrations and cartoons",
      print: {
        image: "/images/notebook/portfolio-sketchbook-final.webp",
        alt: "Final sketchbook homepage: an open notebook labeled projects, my art and journalism/cartoons, with paintings and recruitment posts flowing across the spread",
      },
    },
  },
  {
    name: "Degree planner",
    href: "/projects/graduaid",
    sketch: {
      image: "/images/notebook/degree-planner.webp",
      alt: "Notes: degree and class planner flowchart for UCSD",
      align: "top",
    },
  },
  {
    name: "Adobe Zine",
    href: "/graphic-design/adobe-campus-case-study",
    sketch: {
      image: "/images/notebook/adobe-zine.webp",
      alt: "Adobe Zine storyboard: campus creative scene, Sun God statue, Me x AI workflow",
    },
    // The printed zine, in the storyboard's order: cover, 01–02, 03, 04, back cover.
    final: {
      gallery: [
        [
          {
            image: "/images/notebook/adobe-zine-cover.webp",
            alt: "UCSuperDesign zine cover: a field guide to a more creative campus, with a winged Sun God firefly over an ivy-covered arch",
            ratio: 0.707,
          },
          {
            image: "/images/notebook/adobe-zine-01-campus-02-vision.webp",
            alt: "Zine spread 01 My Campus Creative Space and 02 My Vision: B2B (back to basics), a weekly creative drop-in space",
            ratio: 1.414,
          },
        ],
        [
          {
            image: "/images/notebook/adobe-zine-03-why-me.webp",
            alt: "Zine spread: three-phase plan to lower the barrier, connect the campus and build a creative culture, and 03 Why Me?",
            ratio: 1.414,
          },
          {
            image: "/images/notebook/adobe-zine-04-me-myself-ai.webp",
            alt: "Zine spread 04 Me, Myself, and (A)I: process figures and how AI helps make anything I can imagine",
            ratio: 1.414,
          },
        ],
        [
          {
            image: "/images/notebook/adobe-zine-back-cover.webp",
            alt: "Zine back cover: a chain of students holding hands, led by the glowing firefly, with contact details",
            ratio: 0.707,
          },
        ],
      ],
    },
  },
  {
    name: "TTG Recruitment",
    href: "/graphic-design/triton-trading-group",
    sketch: {
      image: "/images/notebook/ttg-recruitment.webp",
      alt: "TTG Recruitment Fall 2026 sketches: coming soon, scoreboard, schedule, golf flag",
      print: {
        image: "/images/notebook/ttg-recruitment-final.webp",
        alt: "Triton Trading Group Fall Recruitment 26 posts: What Is Triton Trading, Info Night, Yogurt Chats, tabling photo, Drive Your Future, and Coming Soon mowed into grass",
      },
    },
  },
  {
    name: "Deskkeeper",
    href: "/projects/deskkeeper",
    sketch: {
      image: "/images/notebook/deskkeeper.webp",
      alt: "Deskkeeper app sketch: folders, skip / delete / review later buttons, horse illustration",
      // The sketch's "nav??" idea built out: cards over a mountain field, horse runs below.
      print: {
        image: "/images/notebook/horse-gallery-poster.webp",
        video: "/videos/horse-gallery-loop.mp4",
        alt: "Finished gallery: project cards drift over mountains and a flower field while a white horse runs along the speed bar",
      },
    },
  },
  {
    name: "Interface promo",
    sketch: {
      image: "/images/notebook/interface-promo.webp",
      alt: "Interface promo sketch: parts of a face in different styles, RSVP collage",
      print: {
        image: "/images/notebook/interface-promo-final.webp",
        alt: "Interface RSVP final: collage of eye, ear, nose and mouth cutouts over a cloudy sky, with large black RSVP lettering and nav links",
      },
    },
  },
  {
    name: "TFG monograms",
    href: "/graphic-design/triton-trading-group",
    sketch: {
      image: "/images/notebook/tfg-monograms.webp",
      alt: "TFG monogram lettering explorations",
      print: {
        image: "/images/notebook/tfg-monogram-final.png",
        alt: "Final TFG monogram: interlocking serif T, F and G",
        style: "ink",
      },
    },
  },
  {
    name: "Brandy Melville",
    href: "/graphic-design/brandy-x-yrb",
    sketch: {
      image: "/images/notebook/brandy-melville.webp",
      alt: "Notes: Brandy Melville x Yellow Rat Bastard campaign, to-do lists, visual directions",
    },
    // Problem → pitch → campaign.
    final: {
      gallery: [
        [
          {
            image: "/images/notebook/brandy-yrb-issues.webp",
            alt: "Issues: exclusionary sizing and PR backlash, fast-fashion waste, aesthetic fatigue, single-gender marketing",
            ratio: 2.015,
          },
        ],
        [
          {
            image: "/images/notebook/brandy-yrb-proposal.webp",
            alt: "Proposal: a 72-hour Brandy Melville x Yellow Rat Bastard capsule with genderless numeric sizing and upcycled deadstock",
            ratio: 1.978,
          },
        ],
        [
          {
            image: "/images/notebook/brandy-yrb-poster-limo.webp",
            alt: "Brandy x YRB campaign poster: three friends lounging in a limo — Not made to fit in. A limited edition capsule, 72 hours only",
            ratio: 1.465,
          },
          {
            image: "/images/notebook/brandy-yrb-poster-one-for-all.webp",
            alt: "Brandy x YRB campaign poster: three people on lawn chairs on chalk-drawn asphalt — One for all, all for one",
            ratio: 1.254,
          },
        ],
      ],
    },
  },
  {
    name: "IronMind",
    href: "/graphic-design/ironmind",
    sketch: {
      image: "/images/notebook/ironmind.webp",
      alt: "IronMind AI sketch: retractable banner and trifold brochure layouts — inside panels, front, back with contact info, inside cover with the challenge",
      align: "top",
    },
    final: {
      gallery: [
        [
          {
            image: "/images/notebook/ironmind-brochure.webp",
            alt: "IronMind trifold brochure: The Challenge, a black-and-white huddle with contact info, and ironmind.ai cover — from data to decisions in 90 seconds",
            ratio: 1.294,
          },
          {
            image: "/images/notebook/ironmind-banner.webp",
            alt: "IronMind retractable banner: Data to decisions in 90 seconds over a neural fiber image, for sports, healthcare and enterprise",
            ratio: 0.407,
          },
        ],
      ],
    },
  },
  {
    name: "Enro",
    href: "/projects/enro",
    sketch: {
      image: "/images/notebook/enro.webp",
      alt: "Enro logo sketches: clock and radar marks — en route, on time, time/clock/radar, OMW",
      print: {
        image: "/images/projects/enro/poster.webp",
        video: "/videos/enro-demo-loop.mp4",
        alt: "Enro demo: the enro logo's radar sweep, then it reads your calendar and email",
      },
    },
  },
];

/**
 * Two-page projects must start on a left page. When one would land on a right
 * page, the next single-page project is pulled forward to fill the gap.
 */
function layoutPages(opening: NotebookPage[], projects: NotebookProject[]): NotebookPage[] {
  const pages: NotebookPage[] = [...opening];
  const queue = [...projects];
  const sketchOf = (p: NotebookProject): NotebookPage => ({ ...p.sketch, href: p.href });

  while (queue.length) {
    const onRightPage = pages.length % 2 === 1;
    if (onRightPage && queue[0].final) {
      const single = queue.findIndex((p) => !p.final);
      if (single === -1) {
        pages.push({});
        continue;
      }
      pages.push(sketchOf(queue.splice(single, 1)[0]));
      continue;
    }
    const next = queue.shift()!;
    pages.push(sketchOf(next));
    if (next.final) pages.push(next.final);
  }
  return pages;
}

export const NOTEBOOK = {
  title: "Sketchbook",
  pages: layoutPages([OPENING, INTRO], PROJECTS),
} as const;
