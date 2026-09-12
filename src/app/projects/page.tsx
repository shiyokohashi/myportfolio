import { PortfolioCard } from "@/components/PortfolioCard";
import { PROJECTS } from "@/data/projects";
import { CONTENT_MAX, PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

function partitionProjects(items: PortfolioWork[]) {
  const apps = items.filter((item) => item.group === "Apps");
  const rest = items.filter((item) => item.group !== "Apps");
  return { apps, rest };
}

export default function ProjectsPage() {
  const { apps, rest } = partitionProjects(PROJECTS);
  const featured = apps[0];
  const otherApps = apps.slice(1);

  return (
    <main
      className={cn(
        "relative z-10 pt-28 pb-48 sm:pt-32 sm:pb-52 lg:pb-56",
        PAGE_GUTTER,
      )}
    >
      <div className={cn("mx-auto", CONTENT_MAX)}>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
          Personal work
        </p>
        <h1 className="mt-3 text-4xl tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          Projects
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Apps and experiments I build for myself — desktop tools, planners, and
          portfolio toys. Case studies for client and club design live under{" "}
          <a
            href="/graphic-design"
            className="underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 hover:decoration-zinc-500"
          >
            Graphic Design
          </a>
          .
        </p>

        {featured && (
          <section className="mt-16 sm:mt-20" aria-labelledby="apps-heading">
            <div className="flex items-end justify-between gap-6">
              <h2
                id="apps-heading"
                className="text-2xl tracking-tight text-zinc-900 sm:text-3xl"
              >
                Apps
              </h2>
              <p className="hidden text-sm text-zinc-400 sm:block">
                Mac utilities and product experiments
              </p>
            </div>

            <div className="mt-8">
              <PortfolioCard
                item={featured}
                basePath="/projects"
                size="featured"
                showGroup
                showSummary
                priority
              />
            </div>

            {otherApps.length > 0 && (
              <ul className="mt-14 grid list-none gap-10 sm:grid-cols-2 sm:gap-12">
                {otherApps.map((item) => (
                  <li key={item.slug}>
                    <PortfolioCard
                      item={item}
                      basePath="/projects"
                      showGroup
                      showSummary
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {rest.length > 0 && (
          <section className="mt-24 sm:mt-28" aria-labelledby="more-heading">
            <h2
              id="more-heading"
              className="text-2xl tracking-tight text-zinc-900 sm:text-3xl"
            >
              Experiments
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
              Smaller builds and portfolio prototypes that don’t need a full
              product surface.
            </p>
            <ul className="mt-10 grid list-none gap-10 sm:grid-cols-2 sm:gap-12">
              {rest.map((item) => (
                <li key={item.slug}>
                  <PortfolioCard
                    item={item}
                    basePath="/projects"
                    showGroup
                    showSummary
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="min-h-[40vh]" aria-hidden />
    </main>
  );
}
