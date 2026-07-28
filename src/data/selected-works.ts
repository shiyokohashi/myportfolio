import { ABOUT } from "@/data/about";
import { GRAPHIC_DESIGN } from "@/data/graphic-design";
import { JOURNALISM } from "@/data/journalism";
import { PAINTINGS } from "@/data/paintings";
import { PROJECTS } from "@/data/projects";
import { getWorkBySlug } from "@/lib/portfolio";
import type { PortfolioWork } from "@/types/portfolio";

export type SelectedWorkLayout = "featured" | "default";

export type SelectedWorkEntry = {
  slug: string;
  layout?: SelectedWorkLayout;
};

export type SelectedWorksCategory = {
  title: string;
  href: string;
  entries: SelectedWorkEntry[];
  blurb: string;
  /** Grid column count for non-featured items. Defaults to 2. */
  gridColumns?: 2 | 3;
  /** Render featured entries below the grid instead of above. */
  featuredAfter?: boolean;
  /** Tighter spacing and smaller cards — for lighter sections like journalism. */
  compact?: boolean;
  /** Optional link shown below the category grid. */
  footerLink?: { label: string; href: string };
};

/** Home page selected works — order, layout, and featured slugs per category. */
export const SELECTED_WORKS_CATEGORIES: SelectedWorksCategory[] = [
  {
    title: "Personal Projects",
    href: "/projects",
    entries: [
      { slug: "deskkeeper", layout: "featured" },
      { slug: "graduaid" },
      { slug: "portfolio-sketchbook" },
    ],
    blurb: "PLACEHOLDER PLACEHOLDER PLACEHOLDER",
    gridColumns: 2,
  },
  {
    title: "Graphic Design",
    href: "/graphic-design",
    entries: [
      { slug: "adobe-campus-case-study" },
      { slug: "triton-trading-group" },
      { slug: "brisbane-2032" },
    ],
    blurb:
      "Visual identities, brand systems, and campaign work — mostly for clubs, publications, and side clients.",
  },
  {
    title: "Paintings",
    href: "/paintings",
    entries: [
      { slug: "tiger-daughter-2026" },
      { slug: "untitled-2025" },
      { slug: "wings" },
      { slug: "horse-faces" },
    ],
    blurb: "Back to basics -- my traditional mediums",
    footerLink: {
      label: "commission me",
      href: `mailto:${ABOUT.connect.email}`,
    },
  },
  {
    title: "Journalism",
    href: "/journalism",
    entries: [
      { slug: "abort-the-court" },
      { slug: "bleeding-red-white-and-blue" },
      { slug: "the-meta-curse" },
    ],
    blurb: "Editorial cartoons, feature photos, and commission pieces",
    gridColumns: 3,
    compact: true,
  },
];

const SOURCE_BY_PATH: Record<string, PortfolioWork[]> = {
  "/projects": PROJECTS,
  "/graphic-design": GRAPHIC_DESIGN,
  "/paintings": PAINTINGS,
  "/journalism": JOURNALISM,
};

export type SelectedWorksItem = PortfolioWork & {
  layout: SelectedWorkLayout;
};

export type SelectedWorksGroup = Omit<SelectedWorksCategory, "entries"> & {
  items: SelectedWorksItem[];
  gridColumns: 2 | 3;
  compact: boolean;
  featuredAfter: boolean;
  footerLink?: { label: string; href: string };
};

export function getSelectedWorksGroups(): SelectedWorksGroup[] {
  return SELECTED_WORKS_CATEGORIES.map((category) => ({
    title: category.title,
    href: category.href,
    blurb: category.blurb,
    gridColumns: category.gridColumns ?? 2,
    compact: category.compact ?? false,
    featuredAfter: category.featuredAfter ?? false,
    footerLink: category.footerLink,
    items: category.entries
      .map((entry) => {
        const work = getWorkBySlug(
          SOURCE_BY_PATH[category.href] ?? [],
          entry.slug,
        );
        if (!work) return undefined;

        return {
          ...work,
          layout: entry.layout ?? "default",
        };
      })
      .filter((item): item is SelectedWorksItem => item !== undefined),
  }));
}
