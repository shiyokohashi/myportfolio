import { ScrollReveal } from "@/components/ScrollReveal";
import { HOME_SERVICES } from "@/data/home";
import { HOME_TYPE, PAGE_GUTTER, SECTION_PY, WORKS_MAX } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Services — title + short description per capability. */
export function HomeServices() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className={cn("relative z-40 scroll-mt-24", SECTION_PY, PAGE_GUTTER)}
    >
      <div className={cn("mx-auto w-full", WORKS_MAX)}>
        <ScrollReveal>
          <header className="max-w-2xl">
            <h2
              id="services-heading"
              className={cn(HOME_TYPE.section, "text-zinc-900")}
            >
              {HOME_SERVICES.title}
            </h2>
          </header>
        </ScrollReveal>

        <ul className="mt-20 grid list-none gap-x-16 gap-y-4 border-t border-zinc-200 sm:mt-28 sm:grid-cols-2 lg:gap-x-20">
          {HOME_SERVICES.items.map((item, index) => (
            <li key={item.title}>
              <ScrollReveal delayMs={index * 50} offsetY={18}>
                <div className="border-b border-zinc-200 py-12 sm:py-14">
                  <h3 className={cn(HOME_TYPE.item, "text-zinc-900")}>
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      HOME_TYPE.body,
                      "mt-4 max-w-md text-zinc-500",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
