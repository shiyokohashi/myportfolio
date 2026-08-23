import { PortfolioCard } from "@/components/PortfolioCard";
import type { PortfolioWork } from "@/types/portfolio";

type PortfolioGridProps = {
  items: PortfolioWork[];
  /** e.g. "/projects" → links to /projects/my-slug */
  basePath: string;
};

/** Listing grid — one card per portfolio entry. */
export function PortfolioGrid({ items, basePath }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <p className="mt-8 text-zinc-600">
        No entries yet. Add one to the data file for this category.
      </p>
    );
  }

  const grouped = items.some((item) => item.group);
  if (!grouped) {
    return (
      <ul className="mt-16 grid items-start gap-12 sm:mt-20 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-16">
        {items.map((item, index) => (
          <li key={item.slug} className="min-w-0">
            <PortfolioCard item={item} basePath={basePath} showGroup priority={index < 4} />
          </li>
        ))}
      </ul>
    );
  }

  const sections = items.reduce<Map<string, PortfolioWork[]>>((acc, item) => {
    const key = item.group ?? "More projects";
    const list = acc.get(key) ?? [];
    list.push(item);
    acc.set(key, list);
    return acc;
  }, new Map());

  return (
    <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
      {[...sections.entries()].map(([group, groupItems]) => (
        <section key={group}>
          <h2 className="text-2xl tracking-tight text-zinc-900">{group}</h2>
          <ul className="mt-10 grid items-start gap-12 sm:mt-12 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-16">
            {groupItems.map((item, index) => (
              <li key={item.slug} className="min-w-0">
                <PortfolioCard item={item} basePath={basePath} priority={index < 4} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
