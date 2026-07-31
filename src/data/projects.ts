import type { PortfolioWork } from "@/types/portfolio";

/** Product and app projects — home carousel + /projects archive. */
export const PROJECTS: PortfolioWork[] = [
  {
    slug: "graduaid",
    title: "Graduaid",
    summary:
      "Academic planning tool for mapping courses, requirements, and degree progress.",
    description: [
      "Graduaid is a personal project I built to learn UX/UI development while experimenting with ways AI could simplify college degree planning.",
      "As a college student, I noticed that degree planning often requires juggling multiple PDFs, prerequisite chains, and academic planners — so I designed a single dashboard where requirements, scheduling, and progress live in one place.",
      "The work moved from problem framing and scope sketches into a high-fidelity prototype: choose college, major, and minor; import transcript or AP credit; visualize four years across three quarters; drag courses into terms; color-code by requirement type; and flag prerequisite conflicts before registration.",
    ],
    year: "2026",
    role: "Product design & development",
    tags: ["Web", "UX", "Education"],
    color: "#3b82f6",
    thumbnail: "/videos/graduaid-demo.mp4",
    mediaAspect: { width: 1280, height: 832 },
    externalUrl: "https://graduaid.vercel.app/",
    detailLayout: "editorial",
    sections: [
      {
        title: "The problem",
        description:
          "UCSD students navigate degree audits, GE trackers, and the Schedule of Classes separately — none of them talk to each other when you're trying to answer whether a plan actually works.",
        layout: "contained",
        items: [],
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
        title: "The dashboard",
        description:
          "A term-by-term board with a requirements sidebar — drag courses into quarters, track units, and catch prerequisite errors before registration. Header progress bars track total and upper-division units; clicking a warning routes you to the conflict and highlights the offending course — for example, a missing prerequisite on MATH 10B.",
        layout: "full",
        items: [
          {
            image: "/images/projects/graduaid/hero-light.png",
            width: 2580,
            height: 1638,
          },
        ],
      },
      {
        title: "Product walkthrough",
        description:
          "Drag-and-drop scheduling, requirement expansion, and live conflict detection — the core loop students use to build and stress-test a degree plan.",
        layout: "full",
        items: [
          {
            video: "/videos/graduaid-demo.mp4",
            width: 1280,
            height: 832,
          },
        ],
      },
      {
        title: "Profile & transfer credit",
        description:
          "Students start by selecting college, major, minor, and Programs of Concentration — Warren College, for example, requires two PoCs from non-contiguous disciplines. University transcripts and AP / high school credit import separately, then feed completed courses back into the plan and automatically adjust remaining requirements.",
        layout: "contained",
        items: [
          {
            image: "/images/projects/graduaid/profile-setup.png",
            width: 2558,
            height: 588,
            displayWidth: 880,
            title: "College, major & minor",
            description:
              "Changing any input re-runs the requirement engine so the sidebar and timeline reflect the correct catalog.",
          },
          {
            image: "/images/projects/graduaid/transcript-import.png",
            width: 560,
            height: 106,
            displayWidth: 420,
            title: "Transcript import",
            description:
              "Separate entry points for university transcript and AP / high school credit.",
          },
        ],
      },
      {
        title: "Requirements & course detail",
        description:
          "All graduation requirements appear in one sidebar, pulled from the UCSD catalog. Drag courses onto the timeline, expand categories to pick eligible options, and inspect prerequisites, unlocks, and requirement mapping without leaving the plan.",
        layout: "contained",
        itemsLayout: "grid",
        items: [
          {
            image: "/images/projects/graduaid/requirements.png",
            width: 700,
            height: 1018,
            displayWidth: 300,
            title: "Drag to timeline",
            description:
              "54 available requirements — drag directly onto a term, or expand a row to choose from eligible courses.",
          },
          {
            image: "/images/projects/graduaid/course-detail.png",
            width: 454,
            height: 452,
            displayWidth: 260,
            title: "Course detail",
            description:
              "Prerequisites, unlocks (e.g. CAT 1 → CAT 2), and requirement mapping at a glance.",
          },
        ],
      },
      {
        title: "Compare alternate plans",
        description:
          "Tabbed schedules let students explore what-if scenarios — a different minor, an extra quarter, a changed major — without losing their primary plan.",
        layout: "contained",
        items: [
          {
            image: "/images/projects/graduaid/plan-tabs.png",
            width: 856,
            height: 260,
            displayWidth: 640,
            title: "Multiple schedules, one workspace",
            description:
              "My Plan, Schedule 2, and new tabs save independently so students can compare paths side by side.",
          },
        ],
      },
      {
        title: "Dark mode",
        description:
          "A glassmorphic dark theme for late-night planning — same layout and interactions, tuned for low-light readability with frosted panels over a soft gradient backdrop.",
        layout: "full",
        items: [
          {
            image: "/images/projects/graduaid/hero-dark.png",
            width: 2574,
            height: 1638,
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
    thumbnail: "/videos/deskkeeper.mov",
    mediaAspect: { width: 2314, height: 1558 },
    detailLayout: "editorial",
    sections: [
      {
        title: "App icon",
        layout: "narrow",
        items: [
          {
            image: "/images/projects/deskkeeper/icon.png",
            width: 1024,
            height: 1024,
          },
        ],
      },
      {
        title: "Product demo",
        description:
          "Preview files, sort into folders, and clear a messy desktop without leaving the app.",
        layout: "full",
        items: [
          {
            video: "/videos/deskkeeper.mov",
            width: 2314,
            height: 1558,
          },
        ],
      },
    ],
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
    thumbnail: "/videos/portfolio-sketchbook.mov",
    mediaAspect: { width: 2774, height: 1682 },
    detailLayout: "editorial",
    sections: [
      {
        title: "Sketchbook spread",
        description:
          "An interactive homepage mockup — projects, paintings, and journalism arranged like an open sketchbook with handwritten labels and a scrolling strip of work.",
        layout: "full",
        items: [
          {
            video: "/videos/portfolio-sketchbook.mov",
            width: 2774,
            height: 1682,
          },
        ],
      },
    ],
  },
];
