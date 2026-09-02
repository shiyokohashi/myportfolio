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

export function getAdjacentWorks(
  items: PortfolioWork[],
  slug: string,
): { prev?: PortfolioWork; next?: PortfolioWork } {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return {};

  return {
    prev: index > 0 ? items[index - 1] : undefined,
    next: index < items.length - 1 ? items[index + 1] : undefined,
  };
}
