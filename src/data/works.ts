import { GRAPHIC_DESIGN } from "@/data/graphic-design";
import { ILLUSTRATIONS } from "@/data/illustrations";
import { JOURNALISM } from "@/data/journalism";
import { PAINTINGS } from "@/data/paintings";
import { PROJECTS } from "@/data/projects";
import type { PortfolioWork } from "@/types/portfolio";

/** Every section, keyed by its route — used to find a work without knowing where it lives. */
const SECTIONS: [basePath: string, works: PortfolioWork[]][] = [
  ["/projects", PROJECTS],
  ["/graphic-design", GRAPHIC_DESIGN],
  ["/paintings", PAINTINGS],
  ["/illustrations", ILLUSTRATIONS],
  ["/journalism", JOURNALISM],
];

/** Look up a work by slug in whichever section lists it. */
export function findWork(slug: string): PortfolioWork | undefined {
  for (const [, works] of SECTIONS) {
    const work = works.find((item) => item.slug === slug);
    if (work) return work;
  }
  return undefined;
}

/** Detail-page URL for a slug, e.g. "aeon" → "/graphic-design/aeon". */
export function workHref(slug: string): string {
  for (const [basePath, works] of SECTIONS) {
    if (works.some((item) => item.slug === slug)) return `${basePath}/${slug}`;
  }
  return `/projects/${slug}`;
}
