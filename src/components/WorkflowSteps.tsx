import Image from "next/image";

import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { shouldUseUnoptimized } from "@/lib/media";
import type { PortfolioWorkflow } from "@/types/portfolio";

type WorkflowStepsProps = PortfolioWorkflow & {
  className?: string;
};

/** Vertical process reveal — sprint steps from café to campaign. */
export function WorkflowSteps({
  title,
  steps,
  image,
  className,
}: WorkflowStepsProps) {
  return (
    <section
      className={cn(
        "border-t border-zinc-200 bg-white py-16 md:py-24",
        className,
      )}
    >
      <div className={cn("mx-auto max-w-2xl", PAGE_GUTTER)}>
        <h2 className="text-center text-2xl tracking-tight text-zinc-900 md:text-3xl">
          {title}
        </h2>

        <ol className="mt-12 flex flex-col items-center">
          {steps.map((step, index) => (
            <li key={step} className="flex flex-col items-center">
              <span className="text-base text-zinc-800 md:text-lg">{step}</span>
              {index < steps.length - 1 && (
                <span
                  className="my-3 text-lg text-zinc-300 select-none"
                  aria-hidden
                >
                  ↓
                </span>
              )}
            </li>
          ))}
        </ol>

        {image && (
          <figure className="mt-14 md:mt-16">
            <Image
              src={image.src}
              alt={image.alt ?? ""}
              width={image.width}
              height={image.height}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 672px"
              quality={92}
              unoptimized={
                shouldUseUnoptimized(image.src) ||
                image.src.startsWith("/images/projects/")
              }
            />
            {image.caption && (
              <figcaption className="mt-3 text-center text-sm text-zinc-500">
                {image.caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </section>
  );
}
