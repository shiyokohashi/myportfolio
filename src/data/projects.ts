import type { PortfolioWork } from "@/types/portfolio";

/** Product and app projects — home carousel + /projects archive. */
export const PROJECTS: PortfolioWork[] = [
  {
    slug: "graduaid",
    title: "Graduaid",
    summary: "Academic planning tool for mapping courses, requirements, and degree progress.",
    description: [
      "Graduaid is a personal project I built to learn UX/UI development while experimenting with ways AI could simplify college degree planning.",
      "As a college student, I noticed that degree planning often requires juggling multiple PDFs, prerequisite chains, and academic planners — so I designed a single dashboard where requirements, scheduling, and progress live in one place.",
    ],
    year: "2026",
    role: "Product design",
    tags: ["Web", "UX", "Education"],
    color: "#3b82f6",
    thumbnail: "/images/projects/graduaid/slide-06.png",
    detailLayout: "editorial",
    sections: [
      {
        title: "The dashboard",
        description:
          "A term-by-term board with a requirements sidebar — drag courses into quarters, track units, and catch prerequisite errors before registration.",
        layout: "full",
        items: [
          {
            image: "/images/projects/graduaid/slide-06.png",
            width: 2120,
            height: 1406,
          },
        ],
      },
      {
        title: "The problem",
        description:
          "UCSD students navigate degree audits, GE trackers, and the Schedule of Classes separately — none of them talk to each other when you're trying to answer whether a plan actually works.",
        layout: "wide",
        items: [
          {
            image: "/images/projects/graduaid/slide-02.png",
            width: 1334,
            height: 1620,
          },
        ],
      },
      {
        title: "Planning & scope",
        description:
          "Early notes mapped the core flows: choose college, major, and minor; upload transcript or AP credit; visualize four years across three quarters; drag courses into terms; color-code by requirement type; flag prerequisite and availability conflicts.",
        layout: "narrow",
        items: [
          {
            image: "/images/projects/graduaid/slide-03.png",
            width: 665,
            height: 1107,
          },
        ],
      },
      {
        title: "Profile setup",
        description:
          "Students start by selecting college, major, minor, and Programs of Concentration — Warren college, for example, requires two PoCs from non-contiguous disciplines. Transcript upload automatically checks off completed classes and credits.",
        layout: "wide",
        items: [
          {
            image: "/images/projects/graduaid/slide-04.png",
            width: 2400,
            height: 756,
          },
        ],
      },
      {
        title: "Requirements panel",
        description:
          "All graduation requirements appear in one sidebar, pulled from the UCSD catalog. Completed credits gray out; categories are color-coded by requirement type. Expand any course to see prerequisites, future classes it unlocks, and what larger requirement it satisfies.",
        layout: "full",
        items: [
          {
            image: "/images/projects/graduaid/slide-05.png",
            width: 2474,
            height: 1130,
          },
        ],
      },
      {
        title: "Progress & warnings",
        description:
          "A progress bar tracks total and upper-division units. Clicking a warning routes you to the conflict and highlights the offending course — for example, a College GE slot blocked until SYN 1 is complete.",
        layout: "full",
        items: [
          {
            image: "/images/projects/graduaid/slide-07.png",
            width: 2880,
            height: 1391,
          },
        ],
      },
    ],
  },
  {
    slug: "deskkeeper",
    title: "Deskkeeper",
    summary: "Desktop file review app for sorting downloads, screenshots, and loose files.",
    description: [
      "Deskkeeper is a macOS-style utility for clearing a messy desktop — preview a file, decide in seconds, and move on without opening Finder or digging through folders.",
      "Files, folders, and a review queue each get their own tab. The main view shows a large preview with metadata, plus quick actions to skip, trash, or mark for review.",
      "A folder carousel at the bottom keeps context visible — recent collections, labeled stacks, and blank slots for things you'll sort later.",
    ],
    year: "2026",
    role: "Design & development",
    tags: ["Desktop", "Product"],
    color: "#78716c",
    thumbnail: "/images/projects/deskkeeper.png",
    images: ["/images/projects/deskkeeper.png"],
  },
  {
    slug: "portfolio-sketchbook",
    title: "Portfolio Sketchbook",
    summary: "Interactive sketchbook homepage — projects, art, and journalism in one spread.",
    description: [
      "An earlier portfolio concept built as an open sketchbook — one spread that holds projects, paintings, and journalism side by side, like flipping through a physical book.",
      "Handwritten section labels and a centered strip of work samples keep the layout informal and personal, while about and resume stay accessible from the margins.",
      "This site evolved from that idea: the same categories, but with the horse carousel, scroll reveal, and archive pages you see now.",
    ],
    year: "2026",
    role: "Web design",
    tags: ["Portfolio", "Interaction"],
    color: "#d6d3d1",
    thumbnail: "/images/projects/portfolio-book.png",
    images: ["/images/projects/portfolio-book.png"],
  },
];
