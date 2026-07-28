import type { PortfolioWork } from "@/types/portfolio";

const SITE = "https://www.shiyoohashi.com";

/** Graphic design work — migrated from shiyoohashi.com/projects. */
export const GRAPHIC_DESIGN: PortfolioWork[] = [
  {
    slug: "triton-trading-group",
    title: "Triton Trading Group (2025–26)",
    summary:
      "Brand and recruitment design for UCSD's fastest-growing pre-professional business organization.",
    description: [
      "Triton Trading Group (TTG) is UCSD's fastest-growing pre-professional business organization. This work spans social recaps, portfolio headers, Spring 2026 recruitment, and a Winter 2025 tabling banner — all built to feel cohesive across campus touchpoints and digital channels.",
    ],
    year: "2025–26",
    role: "Brand identity",
    tags: ["Brand Identity", "Education"],
    thumbnail: "/images/projects/triton-trading/thumbnail.png",
    sections: [
      {
        title: "Bimonthly quant recap",
        description:
          "Recap graphics for LinkedIn and Instagram, giving followers a snapshot of what TTG's quant team has been working on.",
        items: [
          {
            title: "May 13",
            description:
              "Early-May recap highlighting recent quant team activity and session takeaways.",
            image: `${SITE}/images/projects/triton-trading/bimonthly-quant/may-13.png`,
          },
          {
            title: "May 20",
            description:
              "Mid-month recap covering new analysis, tools, and team updates.",
            image: `${SITE}/images/projects/triton-trading/bimonthly-quant/may-20.png`,
          },
          {
            title: "May 29",
            description: "Late-May recap closing out the current quant cycle.",
            image: `${SITE}/images/projects/triton-trading/bimonthly-quant/may-29.png`,
          },
        ],
      },
      {
        title: "Monthly portfolio",
        description:
          "Header illustrations for TTG's monthly portfolio recap posts on the organization blog.",
        items: [
          {
            title: "March",
            description: "Header art for the March portfolio roundup.",
            image: `${SITE}/images/projects/triton-trading/monthly-portfolio/march.png`,
          },
          {
            title: "April",
            description: "Header art for the April portfolio roundup.",
            image: `${SITE}/images/projects/triton-trading/monthly-portfolio/april.png`,
          },
          {
            title: "May",
            description: "Header art for the May portfolio roundup.",
            image: `${SITE}/images/projects/triton-trading/monthly-portfolio/may.png`,
          },
        ],
      },
      {
        title: "Recruitment",
        description:
          "Spring 2026 recruitment collateral for info sessions, social, and on-campus outreach.",
        items: [
          {
            title: "WE WANT YOU",
            description:
              "Hero graphic for the FP&A track, built around a bold call-to-action.",
            image: `${SITE}/images/projects/triton-trading/recruitment/asset-02.png`,
          },
          {
            title: "What we're looking for",
            description:
              "Overview of qualifications and expectations for Financial Planning & Analysis applicants.",
            image: `${SITE}/images/projects/triton-trading/recruitment/asset-03.png`,
          },
          {
            title: "The cards",
            description:
              "Campaign visual pairing TTG's playing-card motif with market chart imagery.",
            image: `${SITE}/images/projects/triton-trading/recruitment/asset-05.png`,
          },
          {
            title: "Recruitment schedule",
            description:
              "Full timeline of tabling, info nights, and invite-only events.",
            image: `${SITE}/images/projects/triton-trading/recruitment/asset-01.png`,
          },
          {
            title: "Schedule cards",
            description:
              "Two-week calendar with QR codes for applications, the website, and Instagram.",
            image: `${SITE}/images/projects/triton-trading/recruitment/asset-04.png`,
          },
        ],
      },
      {
        title: "Tabling banner",
        description: "Vertical banner for Winter 2025 recruitment tabling.",
        variant: "banner",
        items: [{ image: `${SITE}/images/projects/triton-trading/banner.png` }],
      },
    ],
  },
  {
    slug: "adobe-campus-case-study",
    title: "Adobe Campus Case Study",
    summary:
      "UCSuperDesign — a field guide proposing a more creative campus at UC San Diego.",
    description: [],
    year: "2025",
    role: "Brand identity",
    tags: ["Brand Identity", "Education", "Adobe"],
    thumbnail: "/images/projects/adobe-campus-case-study/spread.png",
    detailLayout: "editorial",
    sections: [
      {
        title: "Field guide",
        layout: "contained",
        items: [
          {
            image: "/images/projects/adobe-campus-case-study/spread.png",
            width: 1024,
            height: 768,
          },
        ],
      },
    ],
  },
  {
    slug: "brisbane-2032",
    title: "Brisbane Olympics (2026)",
    summary:
      "Production case study for UCSD Adwave — Olympic identity concept for Brisbane 2032.",
    description: [
      "A production case study for UCSD Adwave exploring a full branding system for the Brisbane 2032 Olympic Games — from kangaroo-to-athlete motion graphics to event tickets and out-of-home.",
      "The \"Bound for Gold\" direction uses warm yellow fields, concentric ripple marks, and a progression of figures that transition from Australia's native symbol into human athletes at full stride.",
    ],
    year: "2026",
    role: "Brand identity",
    tags: ["Brand Identity", "Entertainment"],
    thumbnail: "/images/banner/brisbane-bound-for-gold-billboard.png",
  },
  {
    slug: "scot-scoop-news-logo",
    title: "Scotscoop Logo (2023)",
    summary:
      "Logo design for Scot Scoop News, the student news publication at Carlmont High School.",
    description: [
      "Identity work for Scot Scoop News — from early mascot explorations through a final editorial mark used across the publication's digital and print presence.",
      "The direction shifted toward something more editorial — credible, restrained, and built to represent serious student journalism.",
    ],
    year: "2023",
    role: "Brand identity",
    tags: ["Brand Identity", "Publishing"],
    thumbnail: `${SITE}/images/projects/scot-scoop/thumbnail.png`,
    sections: [
      {
        title: "Final mark",
        items: [
          {
            title: "Double-S monogram",
            description:
              "Final double-S monogram, inspired by the New York Times letterform tradition. Hand-drawn first, then refined in Adobe Illustrator for the site and social channels.",
            image: `${SITE}/images/projects/scot-scoop/finished-logo.png`,
          },
        ],
      },
      {
        title: "Early explorations",
        description:
          "Early explorations built on Scot Scoop's existing identity — light, pun-driven directions around ice cream, broadcast, and the double meaning of \"scoop.\"",
        items: [
          {
            image: `${SITE}/images/projects/scot-scoop/brainstorm-sketches.png`,
          },
          {
            title: "Logo explorations",
            description:
              "Mascot-style S marks and companion logos for ScotCenter, the publication's broadcast channel.",
            image: `${SITE}/images/projects/scot-scoop/logo-explorations.png`,
          },
        ],
      },
      {
        title: "Editorial direction",
        items: [
          {
            image: `${SITE}/images/projects/scot-scoop/serious-concepts.png`,
          },
          {
            title: "Vector lockup",
            description:
              "Vector lockup deployed across Scot Scoop's site, social profiles, and print collateral.",
            image: `${SITE}/images/projects/scot-scoop/final-logo.png`,
          },
        ],
      },
    ],
  },
];
