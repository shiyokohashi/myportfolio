import Image from "next/image";
import type { ReactNode } from "react";

import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

const IMG = "/images/projects/brisbane-2032";

type BrisbaneCaseStudyProps = {
  work: PortfolioWork;
};

function CaseStudyMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-sm text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900">{value}</dd>
    </div>
  );
}

function CaseStudySection({
  index,
  title,
  children,
  className,
}: {
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-zinc-200 pt-14 sm:pt-16", className)}>
      <div className="mb-8 flex items-baseline gap-4 sm:mb-10">
        <span className="text-sm tabular-nums text-zinc-400">
          {index}
        </span>
        <h2 className="text-2xl tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function CaseStudyFigure({
  src,
  alt,
  caption,
  fullBleed = false,
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  fullBleed?: boolean;
  priority?: boolean;
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={3600}
      height={2026}
      className="h-auto w-full"
      sizes={fullBleed ? "100vw" : "(max-width: 1200px) 100vw, 1200px"}
      priority={priority}
    />
  );

  if (fullBleed) {
    return (
      <figure className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        {image}
        {caption ? (
          <figcaption
            className={cn(
              "mx-auto mt-4 max-w-3xl text-sm text-zinc-500",
              PAGE_GUTTER,
            )}
          >
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure>
      {image}
      {caption ? (
        <figcaption className="mt-4 text-sm text-zinc-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl space-y-4 text-base leading-relaxed text-zinc-600">
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-2xl space-y-2 text-base leading-relaxed text-zinc-600">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Brisbane 2032 — editorial case study built from the Adwave production deck. */
export function BrisbaneCaseStudy({ work }: BrisbaneCaseStudyProps) {
  return (
    <main className="relative z-10 bg-white pb-32 pt-24 sm:pb-40 sm:pt-28">
      <div className={cn("mx-auto max-w-6xl", PAGE_GUTTER)}>
        <header className="border-b border-zinc-200 pb-10 sm:pb-12">
          <p className="text-sm text-zinc-400">
            Brand identity · Case study
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl tracking-tight text-zinc-900 sm:text-5xl">
            {work.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            A production case study for UCSD Adwave — a full branding system for
            the Brisbane 2032 Summer Olympic Games, from identity research
            through out-of-home and ticket applications.
          </p>

          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <CaseStudyMeta label="Role" value="Brand & campaign design" />
            <CaseStudyMeta label="Year" value="2026" />
            <CaseStudyMeta label="Context" value="UCSD Adwave production" />
            <CaseStudyMeta
              label="Deliverables"
              value="Logo, billboard, tickets"
            />
          </dl>
        </header>

        <CaseStudySection index="01" title="Overview">
          <Prose>
            <p>
              This project explores what a Brisbane Summer Olympics could look
              and feel like — set against the alpine, editorial tone of French
              Alps 2030. The direction needed to feel natural, dynamic, and
              atmospheric: rooted in the Brisbane River, community rhythm, and
              the kinetic energy of track and aquatics.
            </p>
            <p>
              The system centers on a kangaroo-to-athlete motion narrative —
              Australia&apos;s native symbol transforming into human performance
              — carried through logo lockups, a &ldquo;Bound for Gold&rdquo;
              out-of-home campaign, and event tickets designed for a
              multicultural, community-forward host city.
            </p>
          </Prose>
        </CaseStudySection>

        <CaseStudySection index="02" title="Discovery & planning" className="mt-16">
          <Prose>
            <p>
              Early planning mapped research areas, thematic keywords, and
              deliverables: logo, merchandise, ticket stub, billboards, and
              transit/social applications. Two concept threads anchored the work
              — sports motion and river systems — with track & field and
              aquatics as primary sport references.
            </p>
          </Prose>
          <div className="mt-10">
            <CaseStudyFigure
              src={`${IMG}/page-01.png`}
              alt="Handwritten planning notes and early logo sketches"
              caption="Initial planning notes — keywords, deliverables, and early kangaroo–river explorations."
            />
          </div>
          <div className="mt-10">
            <BulletList
              items={[
                "Keywords: natural, dynamic, atmospheric, connection, ripple, glow, rhythm.",
                "Motifs: Brisbane River, kangaroo silhouette, boomerang ring patterns.",
                "Research: Brisbane climate, Indigenous history, urban infrastructure, and Olympic precedent.",
              ]}
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="03" title="Logo research" className="mt-16">
          <Prose>
            <p>
              Logo research pulled from Olympic history, Brisbane geography, and
              Australian symbolism — looking for a mark that could stand alone
              while feeling fluid and place-specific.
            </p>
          </Prose>
          <div className="mt-10">
            <BulletList
              items={[
                "Center the Brisbane River — a defining feature of the city and a focus of pre-Games ecological investment in Southeast Queensland.",
                "Study past Games marks for simplicity and standalone clarity; Sydney 2000 informed palette and ring treatment.",
                "Combine kangaroo form with river curvature in a single continuous line.",
              ]}
            />
          </div>
          <div className="mt-10">
            <CaseStudyFigure
              src={`${IMG}/logo-research.png`}
              alt="Logo research mood board and finished kangaroo river mark"
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="04" title="Logo system" className="mt-16">
          <Prose>
            <p>
              Ten lockup directions tested framing devices, colorways, and
              typographic arrangements — from arch and stadium silhouettes to
              circular badges and stacked wordmarks.
            </p>
          </Prose>
          <div className="mt-10">
            <CaseStudyFigure
              src={`${IMG}/logo-explorations.png`}
              alt="Grid of ten Brisbane 2032 logo variations"
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="05" title="Out-of-home campaign" className="mt-16">
          <Prose>
            <p>
              The &ldquo;Bound for Gold&rdquo; billboard extends the identity
              into campaign space — gold field, subtle track texture, and a
              sequential transition from kangaroo to sprinter built from the
              logo&apos;s motion logic.
            </p>
          </Prose>
          <div className="mt-10">
            <BulletList
              items={[
                "Headline ties directly to the kangaroo theme and medal ambition.",
                "Logo mark opens the sequence; athletes resolve into full stride at the right edge.",
                "Warm gold palette codes the work as unmistakably Australian summer.",
              ]}
            />
          </div>
        </CaseStudySection>
      </div>

      <div className="mt-14 sm:mt-16">
        <CaseStudyFigure
          src={`${IMG}/billboard.png`}
          alt="Bound for Gold Brisbane 2032 billboard showing kangaroo to athlete motion"
          fullBleed
          priority
        />
      </div>

      <div className={cn("mx-auto mt-16 max-w-6xl sm:mt-20", PAGE_GUTTER)}>
        <CaseStudySection index="06" title="Ticket research">
          <Prose>
            <p>
              Ticket concepts drew from vintage sport graphics, surf culture,
              and Brisbane&apos;s demographic character — one of Australia&apos;s
              most multicultural cities, shaped by migration from Asia, the
              Middle East, Africa, and the Pacific Islands.
            </p>
          </Prose>
          <div className="mt-10">
            <CaseStudyFigure
              src={`${IMG}/ticket-inspo.png`}
              alt="Ticket design inspiration including sport graphics and surf photography"
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="07" title="Event tickets" className="mt-16">
          <Prose>
            <p>
              Finished stubs apply the rising &ldquo;up&rdquo; motif from the
              track campaign — community members and first responders run
              alongside athletes. Track & field uses outback rock texture;
              aquatics uses lane geometry from above.
            </p>
          </Prose>
          <div className="mt-10">
            <BulletList
              items={[
                "Shared header: Brisbane 2032 wordmark, date, and barcode.",
                "Track ticket: textured red-earth field with lane numbers and gate info.",
                "Aquatics ticket: overhead pool lanes with stadium seating at the base.",
                "System designed to extend across additional sports.",
              ]}
            />
          </div>
          <div className="mt-10">
            <CaseStudyFigure
              src={`${IMG}/tickets.png`}
              alt="Finished Brisbane 2032 track and field and swimming event tickets"
            />
          </div>
        </CaseStudySection>

        {work.tags && work.tags.length > 0 ? (
          <div className="mt-16 border-t border-zinc-200 pt-10">
            <p className="text-sm text-zinc-400">
              Tags
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </main>
  );
}
