import { GRAPHIC_DESIGN } from "@/data/graphic-design";
import { ILLUSTRATIONS } from "@/data/illustrations";
import { JOURNALISM } from "@/data/journalism";
import { PAINTINGS } from "@/data/paintings";
import { PROJECTS } from "@/data/projects";
import type { PortfolioWork } from "@/types/portfolio";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type CategoryRoute = {
  href: string;
  label: string;
  works: PortfolioWork[];
};

const CATEGORY_ROUTES: Record<string, CategoryRoute> = {
  projects: {
    href: "/projects",
    label: "Projects",
    works: PROJECTS,
  },
  "graphic-design": {
    href: "/graphic-design",
    label: "Graphic design",
    works: GRAPHIC_DESIGN,
  },
  paintings: {
    href: "/paintings",
    label: "Paintings",
    works: PAINTINGS,
  },
  illustrations: {
    href: "/illustrations",
    label: "Illustrations",
    works: ILLUSTRATIONS,
  },
  journalism: {
    href: "/journalism",
    label: "Journalism",
    works: JOURNALISM,
  },
};

function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Build breadcrumb trail from the current pathname. */
export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  if (pathname === "/") return [];

  const crumbs: Breadcrumb[] = [{ label: "Home", href: "/" }];
  const [categorySegment, slug] = pathname.split("/").filter(Boolean);
  const category = categorySegment
    ? CATEGORY_ROUTES[categorySegment]
    : undefined;

  if (!category) return crumbs;

  if (!slug) {
    crumbs.push({ label: category.label });
    return crumbs;
  }

  const work = category.works.find((item) => item.slug === slug);

  crumbs.push({ label: category.label, href: category.href });
  crumbs.push({
    label: work?.title ?? slugToLabel(slug),
  });

  return crumbs;
}
