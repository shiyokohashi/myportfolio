import type { PortfolioWork } from "@/types/portfolio";

export function getWorkBySlug(
  items: PortfolioWork[],
  slug: string,
): PortfolioWork | undefined {
  return items.find((item) => item.slug === slug);
}

export function getWorkSlugs(items: PortfolioWork[]) {
  return items.map((item) => ({ slug: item.slug }));
}
