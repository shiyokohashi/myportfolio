import type { PortfolioWork } from "@/types/portfolio";

/** Webdev & Apps — the /projects archive. Branding work lives in graphic-design.ts. */
export const PROJECTS: PortfolioWork[] = [
  {
    slug: "graduaid",
    title: "Graduaid",
    summary:
      "A UCSD degree planner that validates every course placement against real prerequisites and quarter offerings — before registration.",
    description: [
      "A UCSD degree planner that validates every course placement against real prerequisites and quarter offerings — before registration.",
    ],
    year: "2026",
    role: "Product design & development",
    tags: ["Web", "UX", "Education", "Product"],
    color: "#3b82f6",
    thumbnail: "/videos/graduaid-walkthrough.mov",
    mediaAspect: { width: 16, height: 9 },
    externalUrl: "https://graduaid.vercel.app/",
    detailLayout: "editorial",
    sections: [],
  },
  {
    slug: "secretaryat",
    title: "Secretaryat",
    summary:
      "Task tracker where every task is a horse — finish one, and it runs off the screen.",
    description: [
      "Secretaryat turns a to-do list into a pasture. Each task shows up as a horse in the field; when you check it off, the horse runs out of frame.",
    ],
    year: "2026",
    role: "Product design & development",
    tags: ["Desktop", "Product"],
    color: "#6b7c4c",
    thumbnail: "/videos/secretaryat.mp4",
    thumbnailCrop: true,
    videoCropScale: 1.03,
    mediaAspect: { width: 1280, height: 884 },
    detailLayout: "editorial",
    sections: [
      {
        title: "Product demo",
        description:
          "Add a task, watch a horse appear in the field, then check it off and see it run off screen.",
        layout: "full",
        items: [
          {
            video: "/videos/secretaryat.mp4",
            width: 1280,
            height: 884,
            cropVideo: true,
            videoCropScale: 1.03,
          },
        ],
      },
      {
        title: "Horse sprites",
        description:
          "Adobe Firefly generated the horse stills and walk/gallop cycles — then cleaned into sprite sheets for the in-app pasture animations.",
        layout: "full",
        items: [
          {
            image: "/images/projects/secretaryat/firefly-sprites.png",
            width: 1024,
            height: 546,
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
    thumbnailCrop: true,
    videoCropScale: 1.03,
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
            cropVideo: true,
            videoCropScale: 1.03,
          },
        ],
      },
    ],
  },
  {
    slug: "tabl",
    title: "tabl",
    summary:
      "A desktop studio table for creative projects — papers, stickies, and sketchbooks arranged on wood.",
    description: [
      "tabl is a macOS app for keeping creative work visible. Instead of burying files in folders, everything lives on a studio table you can rearrange like a real desk.",
      "Open tabl and drop in papers, sticky notes, index cards, and a sketchbook. Finished work tucks into a folder on the side. Persistence stays local, so the table is yours alone until you clear it.",
      "Built with Electron, React, and a small motion layer — meant to feel quiet and tactile, not like another project-management dashboard.",
    ],
    year: "2026",
    role: "Design & development",
    tags: ["Desktop", "App", "Electron"],
    color: "#8b6914",
    thumbnail: "/images/projects/tabl.png",
    mediaAspect: { width: 1600, height: 1000 },
    detailLayout: "editorial",
    sections: [
      {
        title: "The table",
        description:
          "A wood desk surface holds your active work — sketchbooks, loose papers, and notes you can drag around freely.",
        layout: "full",
        items: [
          {
            image: "/images/projects/tabl/ui-main.png",
            width: 1600,
            height: 1000,
          },
        ],
      },
      {
        title: "App icon",
        description:
          "Warm wood grain and a simple mark — closer to a desk object than a SaaS logo.",
        layout: "narrow",
        items: [
          {
            image: "/images/projects/tabl/icon-card.png",
            width: 1024,
            height: 1024,
          },
        ],
      },
      {
        title: "Objects on the desk",
        description:
          "Sketchbooks, paper, and finished folders are first-class objects — not rows in a list.",
        layout: "wide",
        items: [
          {
            image: "/images/projects/tabl/sketchbook-v2.png",
            width: 735,
            height: 588,
          },
          {
            image: "/images/projects/tabl/folder-finished.png",
            width: 512,
            height: 512,
          },
          {
            image: "/images/projects/tabl/paper.png",
            width: 400,
            height: 520,
          },
        ],
      },
    ],
  },
  {
    slug: "imployed",
    title: "Imployed",
    summary:
      "Career discovery site — browse 1,700+ roles by industry or personalize by salary and interests.",
    description: [
      "Most students and early-career job seekers know a handful of job titles — doctor, lawyer, engineer — but not the full breadth of roles that exist within an industry or match their skills.",
      "Imployed is a career exploration site I designed to make that invisible landscape visible. Users can browse featured roles by sector, filter by minimum salary and interest tags, and drill into detailed career pages with day-to-day tasks, skills to build, and honest tradeoffs.",
      "The goal was a calm, editorial browsing experience — more magazine than job board — that rewards curiosity over urgency.",
    ],
    year: "2026",
    role: "Product design & development",
    tags: ["Web", "UX", "Careers"],
    color: "#c45c42",
    thumbnail: "/videos/imployed.mp4",
    thumbnailCrop: true,
    videoCropScale: 1.03,
    mediaAspect: { width: 1280, height: 868 },
    externalUrl: "https://imployed.vercel.app/",
    detailLayout: "editorial",
    sections: [
      {
        title: "Homepage",
        description:
          "A screen recording of the landing experience — the terracotta wordmark, industry directory, and featured role grid that greet new visitors before they search or personalize.",
        layout: "full",
        items: [
          {
            video: "/videos/imployed.mp4",
            width: 1280,
            height: 868,
            cropVideo: true,
            videoCropScale: 1.03,
          },
        ],
      },
      {
        title: "Explore careers",
        description:
          "The entry point is a simple industry directory — Education, Finance, Government, Healthcare, and more. Each category opens a grid of featured roles with salary ranges and skill tags, so users can scan breadth before committing to a search path.",
        layout: "full",
        items: [
          {
            image: "/images/projects/imployed/explore-careers.png",
            width: 2532,
            height: 1702,
          },
        ],
      },
      {
        title: "Discover & personalize",
        description:
          "The Discover view ranks 1,700+ careers by fit. An optional sidebar lets users set a minimum salary and select interest tags — building products, healthcare, entrepreneurship — to surface roles that align with how they actually want to work.",
        layout: "full",
        items: [
          {
            image: "/images/projects/imployed/discover.png",
            width: 2538,
            height: 1708,
          },
        ],
      },
      {
        title: "Career detail",
        description:
          "Each role page goes beyond a title and salary: growth outlook, common tasks, potential downsides, skills to develop, matching interests, industries, and work style — enough context to decide whether a path is worth exploring further.",
        layout: "full",
        items: [
          {
            image: "/images/projects/imployed/career-detail.png",
            width: 2540,
            height: 1712,
          },
        ],
      },
    ],
  },
  {
    slug: "enro",
    title: "Enro",
    summary: "Hackathon build — Enro uses your phone's sensors to predict if you'll be late, then calls to get you moving.",
    description: [
      "En route. On time. Enro is a hackathon project that uses your phone's sensors to predict if you'll be late — then calls to get you moving.",
      "It reads your calendar and email to learn what you have planned, so the nudge comes before you're already behind. Less checking the time, more being on time.",
    ],
    year: "2026",
    role: "Hackathon — design & development",
    tags: ["Hackathon", "Web", "Product"],
    color: "#7aa7e8",
    thumbnail: "/videos/enro-demo-loop.mp4",
    mediaAspect: { width: 1280, height: 788 },
    externalUrl: "https://public-lemon-six-37.vercel.app/",
    detailLayout: "editorial",
    sections: [
      {
        title: "Demo",
        description: "The logo's radar sweep opens into a sample morning: Enro reads your calendar and email to see what you have planned.",
        layout: "full",
        items: [
          {
            video: "/videos/enro-demo-loop.mp4",
            width: 1280,
            height: 788,
          },
        ],
      },
      {
        title: "Logo sketches",
        description: "En route, on time — the mark started as a clock face and became a radar sweep.",
        layout: "narrow",
        items: [
          {
            image: "/images/notebook/enro.webp",
            width: 1400,
            height: 968,
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
