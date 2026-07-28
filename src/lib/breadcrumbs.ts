import { GRAPHIC_DESIGN } from "@/data/graphic-design";
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
    label: "all projects",
    works: PROJECTS,
  },
  "graphic-design": {
    href: "/graphic-design",
    label: "graphic design",
    works: GRAPHIC_DESIGN,
  },
  paintings: {
    href: "/paintings",
    label: "paintings",
    works: PAINTINGS,
  },
  journalism: {
    href: "/journalism",
    label: "journalism",
    works: JOURNALISM,
  },
};

function slugToLabel(slug: string): string {
  return slug.replace(/-/g, " ");
}

/** Build breadcrumb trail from the current pathname. */
export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  if (pathname === "/") return [];

  const crumbs: Breadcrumb[] = [{ label: "home", href: "/" }];
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
    label: work?.title.toLowerCase() ?? slugToLabel(slug),
  });

  return crumbs;
}
