import { BRISBANE_2032, TRITON_TRADING_GROUP } from "@/data/graphic-design";
import type { PortfolioWork } from "@/types/portfolio";

/** Product and app projects — home carousel + /projects archive. */
export const PROJECTS: PortfolioWork[] = [
  { ...TRITON_TRADING_GROUP, group: "Featured Projects" },
  { ...BRISBANE_2032, group: "Featured Projects" },
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
    slug: "aeon",
    title: "aeon",
    summary:
      "Product design and creative direction — speculative wearable and full Firefly campaign in under 6 hours.",
    description: [],
    editorialHero: {
      video: "/videos/aeon.mp4",
      width: 1280,
      height: 720,
      headline: "aeon",
      tagline:
        "A wearable device that gives students and professionals more time in their day—with one twist: it lets you turn back time.",
      metadata: [
        "45-minute Design Sprint",
        "Adobe Creative Café",
        "Firefly Boards",
        "<6 Hour Iteration",
      ],
    },
    workflow: {
      title: "From idea to product in under 6 hours.",
      steps: [
        "Adobe Creative Café",
        "Firefly Boards",
        "Problem & Concept",
        "Interaction Design",
        "Marketing Strategy",
        "Billboards",
        "Fake Ad Video",
      ],
      image: {
        src: "/images/projects/aeon/firefly-workflow.png",
        width: 1024,
        height: 586,
        alt: "Adobe Firefly Boards workflow",
        caption:
          "The sprint board — shot lists, mood frames, logo passes, product renders, and campaign comps in one session.",
      },
    },
    year: "2026",
    role: "Product design • Creative direction • AI workflow",
    tags: ["Product design", "Creative direction", "AI workflow", "Adobe Firefly", "Wearables", "Speculative"],
    color: "#3d3630",
    thumbnail: "/videos/aeon.mp4",
    mediaAspect: { width: 1280, height: 720 },
    detailLayout: "editorial",
    sections: [
      {
        title: "Problem & concept",
        layout: "wide",
        columns: [
          {
            title: "The Problem",
            description:
              "For students and professionals alike, there never seems to be enough time.\n\nBetween deadlines, meetings, classes, and constant distractions, productivity tools can help organize our schedules—but they can't create more hours in the day.\n\nWhat if they could?",
          },
          {
            title: "The Concept",
            description:
              "aeon is a wearable bracelet that gives users more time by allowing them to turn back time.\n\nA rotating inner band acts as the primary interaction. Turning the band rewinds time by a selected number of hours, allowing users to revisit moments, rethink decisions, and continue their day from a different point in time.",
          },
        ],
        items: [],
      },
      {
        title: "Creative brief",
        layout: "wide",
        columns: [
          {
            title: "Target Audience",
            description: "Students and professionals — busy people who never have enough hours in the day.",
          },
          {
            title: "Brand Direction",
            description: "Editorial, premium, minimal, warm, timeless.",
          },
          {
            title: "Inspiration",
            description:
              "Jewelry first, technology second. Inspired by Oura Ring and Apple Watch.",
          },
        ],
        descriptionGroups: [
          {
            heading: "Design Principles",
            entriesLayout: "horizontal",
            entries: [
              {
                title: "01 — Effortless Interaction",
                description:
                  "Simple, intuitive controls designed for everyday use.",
              },
              {
                title: "02 — Intentional Movement",
                description:
                  "Physical gestures make manipulating time feel deliberate and meaningful.",
              },
              {
                title: "03 — Calm Technology",
                description:
                  "Minimal feedback reduces cognitive load and creates a distraction-free experience.",
              },
              {
                title: "04 — Jewelry, Not Technology",
                description:
                  "A premium, minimalist design that feels stylish enough to replace a smartwatch.",
              },
              {
                title: "05 — Familiar Yet Futuristic",
                description:
                  "Combines recognizable interactions with a new way to experience time.",
              },
            ],
          },
        ],
        items: [],
      },
      {
        title: "Interaction design",
        layout: "wide",
        featureWrap: {
          heading: "Core Features",
          image: {
            image: "/images/projects/aeon/interaction-design.png",
            width: 1024,
            height: 887,
            displayWidth: 320,
          },
          left: [
            {
              title: "Twist to Lock In",
              description:
                "Users rotate aeon's inner band to select how many hours they want to rewind. Once the desired time is reached, pressing the band inward locks in the selection and confirms the rewind. This two-step interaction makes changing time resistant to accidental activation.",
            },
            {
              title: "Haptic Feedback",
              description:
                "Vibrations and light signals communicate without a screen.",
            },
          ],
          right: [
            {
              title: "Screen-Free Design",
              description:
                "A physical, intuitive experience that feels like jewelry.",
            },
            {
              title: "Everyday Wearability",
              description:
                "Minimal metal craftsmanship designed for daily use.",
            },
          ],
        },
        items: [],
      },
      {
        title: "Logo",
        description:
          "A lowercase serif creates a timeless, elegant identity, while the embossed metal finish reinforces the bracelet's physical materiality.",
        layout: "full",
        items: [
          {
            image: "/images/projects/aeon/logo-iterations.png",
            width: 1024,
            height: 464,
            title: "Logo iterations",
            description:
              "Sketchbook → text in Adobe Express → 3D emboss in Adobe Firefly.",
          },
        ],
      },
      {
        title: "Marketing Strategy",
        description:
          "Rather than positioning aeon as a science-fiction device, the campaign sells a lifestyle.\n\nThe creative direction reimagines hustle culture through a more optimistic lens: having enough time to pursue ambitious careers without sacrificing personal goals. Editorial-inspired photography, premium product imagery, and minimalist layouts position aeon alongside modern lifestyle technology rather than traditional consumer electronics.",
        layout: "contained",
        items: [],
      },
      {
        title: "Campaign explorations",
        description:
          "Creative direction tests from the same Firefly session — mood, scale, and guerrilla ideas that pressure-tested the world before billboards.",
        layout: "full",
        itemsLayout: "grid-3",
        items: [
          {
            image: "/images/projects/aeon/misc-ring-loop.png",
            width: 1024,
            height: 764,
            title: "The loop at scale",
            description: "Target demographic: young, stylish working people.",
          },
          {
            image: "/images/projects/aeon/misc-editorial-vintage.png",
            width: 1024,
            height: 686,
            title: "Editorial collage",
            description:
              "Tie to traditional and grounds the futuristic design; feels more human.",
          },
          {
            image: "/images/projects/aeon/misc-coffee-concept.png",
            width: 1024,
            height: 699,
            title: "An extra aeon, please",
            description:
              "Guerrilla marketing for working people — product in the wild, not on a billboard.",
          },
        ],
      },
      {
        title: "Billboards",
        description:
          "Inspired by luxury fashion, the direction positions aeon as an object of desire. Minimal typography, product-focused visuals, clean editorial style to emphasize sophistication.",
        layout: "full",
        itemsLayout: "grid",
        items: [
          {
            image: "/images/projects/aeon/billboard-chain.png",
            width: 837,
            height: 1024,
            title: "Chain & charm",
            description: "Subliminal messaging — craftsmanship.",
          },
          {
            image: "/images/projects/aeon/billboard-lifestyle.png",
            width: 1024,
            height: 683,
            title: "On wrist, in the city",
            description:
              "Target audience: businesspeople — demonstrates style & everyday wear.",
          },
        ],
      },
      {
        title: "Continuous billboards concept",
        description: "Short, sweet, memorable.",
        layout: "full",
        itemsLayout: "grid",
        items: [
          {
            image: "/images/projects/aeon/billboard-concept-alarm.png",
            width: 1024,
            height: 528,
          },
          {
            image: "/images/projects/aeon/billboard-concept-running.png",
            width: 1024,
            height: 528,
          },
          {
            image: "/images/projects/aeon/billboard-concept-eat.png",
            width: 1024,
            height: 528,
          },
          {
            image: "/images/projects/aeon/billboard-concept-floor.png",
            width: 1024,
            height: 528,
          },
        ],
      },
      {
        title: "Fake ad video",
        description:
          "Rapid edits, everyday sounds, and circular motifs capture the pace of modern life. At its peak, everything pauses. The coffee spill reverses into the aeon bracelet.",
        layout: "full",
        itemsLayout: "storyboard",
        items: [
          {
            image: "/images/projects/aeon/ad/01-alarm.png",
            width: 1024,
            height: 659,
            title: "Alarm clock",
            shot: {
              visual:
                "Top-down shot of a circular alarm clock. The second hand ticks rapidly. A hand slams it off. Cut to black.",
              audio:
                "Alarm blaring. Amplified clock ticking. SMASH. Immediate silence.",
              purpose: "Establish urgency.",
            },
          },
          {
            image: "/images/projects/aeon/ad/02-loading.png",
            width: 1024,
            height: 659,
            title: "Loading wheel",
            shot: {
              visual:
                "Cursor repeatedly clicks a spinning loading wheel. Minimal composition centered on screen. Cut to black.",
              audio: "Mouse clicks. Loading tone. Quiet keyboard taps.",
              purpose: "Visualize lost time.",
            },
          },
          {
            image: "/images/projects/aeon/ad/03-bagel.png",
            width: 1024,
            height: 659,
            title: "Bagel",
            shot: {
              visual:
                "Overhead shot. A hand grabs a bagel, takes one hurried bite, then drops it back onto the plate unfinished. Cut to black.",
              audio: "Bite. Ceramic plate clink. Footsteps begin underneath.",
              purpose: "Humanize the problem.",
            },
          },
          {
            image: "/images/projects/aeon/ad/04-sidewalk.png",
            width: 1024,
            height: 659,
            title: "Walking",
            shot: {
              visual:
                "Tracking shot from behind as someone fast-walks through a city, weaving between pedestrians.",
              audio:
                "Footsteps. Traffic ambience. Phone vibration. Clock ticking subtly returns.",
              purpose: "Increase pace.",
            },
          },
          {
            image: "/images/projects/aeon/ad/06-elevator.png",
            width: 1024,
            height: 659,
            title: "Elevator",
            shot: {
              visual:
                "Finger repeatedly presses the circular elevator button. Doors begin closing just before they're reached.",
              audio: "Elevator ding. Button clicks. Mechanical door closing.",
              purpose: "Escalate tension.",
            },
          },
          {
            image: "/images/projects/aeon/ad/07-keyboard.png",
            width: 1024,
            height: 659,
            title: "Keyboard",
            shot: {
              visual:
                "Fingers type frantically. Cursor jumps between fields. Notifications begin stacking on screen.",
              audio:
                "Keyboard clicks. Clock ticking loud and fast — stays up front, doesn't fade.",
              purpose: "The circle motif breaks — everything feels more chaotic.",
            },
          },
          {
            image: "/images/projects/aeon/ad/08-backspace.png",
            width: 1024,
            height: 659,
            title: "Backspace",
            shot: {
              visual:
                "Backspace hammered repeatedly — delete, retype, delete again. Cuts between keys and screen get shorter.",
              audio:
                "Typing stutters into backspace taps. Ticking stays loud and fast, tempo climbing.",
              purpose: "Running out of time — undo can't keep up.",
            },
          },
          {
            image: "/images/projects/aeon/ad/09-mouse.png",
            width: 1024,
            height: 659,
            title: "Mouse",
            shot: {
              visual:
                "Mouse clicks in rapid succession. Cursor jumps between windows. Cuts accelerate into a stutter.",
              audio:
                "Clicks layer over keyboard and backspace. Notification pings stack in. Ticking remains loud and fast — peak chaos before the cut.",
              purpose: "Peak anxiety.",
            },
          },
          {
            image: "/images/projects/aeon/ad/10-eye.png",
            width: 1024,
            height: 659,
            title: "Eye",
            shot: {
              visual: "Extreme close-up. The eye blinks rapidly — stress, exhaustion, no time to pause.",
              audio: "Ticking cuts through. Blink sounds sharp and close. Tempo still fast.",
              purpose: "Last beat before the product — running on empty.",
            },
          },
          {
            image: "/images/projects/aeon/ad/11-coffee-foam.png",
            width: 1024,
            height: 659,
            title: "Coffee cup",
            executionVideo: "/videos/aeon-spill-execution.mov",
            executionVideoWidth: 1920,
            executionVideoHeight: 1076,
            executionVideoStart: 1.05,
          },
          {
            image: "/images/projects/aeon/ad/05-spill.png",
            width: 1024,
            height: 659,
            title: "Coffee spill",
            shot: {
              visual:
                "Slow-motion close-up as coffee spills across the desk. Droplets suspend in midair.",
              audio:
                "Every sound abruptly cuts away. One coffee drop lands. Silence.",
              purpose: "Freeze the climax.",
            },
          },
          {
            image: "/images/projects/aeon/ad/tagline-coffee.png",
            width: 1024,
            height: 659,
            title: "Tagline",
            shot: {
              visual:
                "Coffee surface fills the frame. White lowercase serif: it's time to make time.",
              audio: "Complete silence. Hold for one beat.",
              purpose: "Create contrast.",
            },
          },
          {
            image: "/images/projects/aeon/ad/13-product-cup.png",
            width: 1024,
            height: 659,
            title: "Rewind",
            shot: {
              visual:
                "The cup stands back up — spill reverses, coffee pulls back into the cup.",
              audio: "Deep reverse whoosh. Soft metallic click.",
              purpose: "Introduce control.",
            },
          },
        ],
      },
      {
        title: "bonus: my brainstorming",
        layout: "full",
        items: [
          {
            image: "/images/projects/aeon/brainstorming.png",
            width: 768,
            height: 1024,
            displayWidth: 240,
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
