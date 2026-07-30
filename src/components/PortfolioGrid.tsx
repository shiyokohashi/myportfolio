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
      <ul className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-12">
        {items.map((item, index) => (
          <li key={item.slug}>
            <PortfolioCard item={item} basePath={basePath} showGroup priority={index < 4} />
          </li>
        ))}
      </ul>
    );
  }

  const sections = items.reduce<Map<string, PortfolioWork[]>>((acc, item) => {
    const key = item.group ?? "Work";
    const list = acc.get(key) ?? [];
    list.push(item);
    acc.set(key, list);
    return acc;
  }, new Map());

  return (
    <div className="mt-14 space-y-16 sm:space-y-20">
      {[...sections.entries()].map(([group, groupItems]) => (
        <section key={group}>
          <h2 className="text-2xl tracking-tight text-zinc-900">{group}</h2>
          <ul className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-12">
            {groupItems.map((item, index) => (
              <li key={item.slug}>
                <PortfolioCard item={item} basePath={basePath} priority={index < 4} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
