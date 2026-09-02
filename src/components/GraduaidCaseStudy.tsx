import Image from "next/image";
import type { ReactNode } from "react";

import { MediaCover } from "@/components/MediaCover";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { PROJECTS } from "@/data/projects";
import { PAGE_GUTTER, SITE_SURFACE } from "@/lib/layout";
import { getAdjacentWorks } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

const IMG = "/images/projects/graduaid";

type GraduaidCaseStudyProps = {
  work: PortfolioWork;
};

function CaseStudyMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-zinc-400">{label}</dt>
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
    <section className={cn("pt-16 sm:pt-20", className)}>
      <div className="mb-10 flex items-baseline gap-4 sm:mb-12">
        <span className="text-sm tabular-nums text-zinc-400">{index}</span>
        <h2 className="text-2xl tracking-tight text-zinc-900 sm:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-2xl space-y-4 text-base leading-relaxed text-zinc-600 md:text-lg">
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-2xl space-y-3 text-base leading-relaxed text-zinc-600 md:text-lg">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InsightCard({ label, quote }: { label: string; quote: string }) {
  return (
    <figure className="pl-1">
      <blockquote className="text-base leading-relaxed text-zinc-700">
        {quote}
      </blockquote>
      <figcaption className="mt-3 text-sm font-medium text-zinc-900">{label}</figcaption>
    </figure>
  );
}

function ValidationBeat({
  step,
  title,
  problem,
  solution,
  copy,
  image,
  alt,
  width,
  height,
  reverse = false,
}: {
  step: string;
  title: string;
  problem?: string;
  solution?: string;
  copy?: string;
  image?: string;
  alt?: string;
  width?: number;
  height?: number;
  reverse?: boolean;
}) {
  const text = (
    <div>
      <p className="text-sm tabular-nums text-zinc-400">{step}</p>
      <h3 className="mt-2 text-xl tracking-tight text-zinc-900">{title}</h3>
      {problem && solution ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Design problem
            </p>
            <p className="mt-2 text-base leading-relaxed text-zinc-600">{problem}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Solution
            </p>
            <p className="mt-2 text-base leading-relaxed text-zinc-600">{solution}</p>
          </div>
        </div>
      ) : null}
      {copy ? (
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{copy}</p>
      ) : null}
    </div>
  );

  if (!image || !alt || !width || !height) {
    return (
      <div className="pt-0 first:pt-0">{text}</div>
    );
  }

  return (
    <div
      className={cn(
        "grid items-start gap-10 md:grid-cols-2 md:gap-14",
        reverse && "md:[&>*:first-child]:order-2",
      )}
    >
      {text}
      <FeatureFigure src={image} alt={alt} width={width} height={height} />
    </div>
  );
}

function FeatureFigure({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}) {
  return (
    <figure>
      <div className="overflow-hidden rounded-sm bg-zinc-50 p-4">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 768px"
          unoptimized
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-zinc-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function FeatureRow({
  title,
  copy,
  image,
  alt,
  width,
  height,
  caption,
  reverse = false,
}: {
  title: string;
  copy: ReactNode;
  image: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid items-start gap-10 md:grid-cols-2 md:gap-14",
        reverse && "md:[&>*:first-child]:order-2",
      )}
    >
      <div>
        <h3 className="text-xl tracking-tight text-zinc-900">{title}</h3>
        {typeof copy === "string" ? (
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{copy}</p>
        ) : (
          <div className="mt-3 space-y-3 text-base leading-relaxed text-zinc-600">{copy}</div>
        )}
      </div>
      <FeatureFigure
        src={image}
        alt={alt}
        width={width}
        height={height}
        caption={caption}
      />
    </div>
  );
}

function FeatureBanner({
  title,
  copy,
  image,
  alt,
  width,
  height,
}: {
  title: string;
  copy: string;
  image: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h3 className="text-xl tracking-tight text-zinc-900">{title}</h3>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">{copy}</p>
      </div>
      <figure className="overflow-hidden rounded-sm bg-zinc-50 p-4">
        <Image
          src={image}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
          sizes="100vw"
          unoptimized
        />
      </figure>
    </div>
  );
}

export function GraduaidCaseStudy({ work }: GraduaidCaseStudyProps) {
  const { prev, next } = getAdjacentWorks(PROJECTS, work.slug);

  return (
    <main className={cn("relative z-10 pb-32 pt-24 sm:pb-40 sm:pt-28", SITE_SURFACE)}>
      <div className={cn("mx-auto max-w-6xl", PAGE_GUTTER)}>
        <header className="pb-12 sm:pb-14">
          <p className="text-sm text-zinc-400">Product design · Case study</p>
          <h1 className="mt-4 max-w-4xl text-4xl tracking-tight text-zinc-900 sm:text-5xl">
            {work.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-600 md:text-xl">
            Graduaid maps UCSD requirements onto a draggable four-year timeline — a
            planner I built after degree audits, PDF flowcharts, and the Schedule of
            Classes failed to answer one question: does this plan actually work?
          </p>

          {work.externalUrl ? (
            <p className="mt-6">
              <a
                href={work.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-zinc-900 underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                View live project →
              </a>
            </p>
          ) : null}

          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <CaseStudyMeta label="Timeline" value="2025–2026" />
            <CaseStudyMeta label="Role" value="Product design & development" />
            <CaseStudyMeta
              label="Built with"
              value="React, TypeScript, catalog engine"
            />
            <CaseStudyMeta label="Platform" value="Web app" />
          </dl>
        </header>
      </div>

      {work.thumbnail ? (
        <div className="mt-16 sm:mt-20">
          <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-zinc-50">
            <div className="aspect-video w-full">
              <MediaCover
                src={work.thumbnail}
                alt="Graduaid product walkthrough"
                poster={`${IMG}/overview.png`}
                objectFit="contain"
                lazy={false}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className={cn("mx-auto max-w-6xl sm:mt-24", PAGE_GUTTER)}>
        <CaseStudySection index="01" title="Challenge" className="mt-20">
          <Prose>
            <p className="text-xl leading-snug text-zinc-900 md:text-2xl">
              How might we help UCSD students plan a degree they can actually register
              for — without juggling PDFs, degree audits, and spreadsheets that never
              validate prerequisites in calendar order?
            </p>
            <p>
              Students must satisfy overlapping structures at once — major sequences,
              college GEs, prerequisite chains, and courses offered only in specific
              quarters. Spreadsheets and PDF flowcharts do not know any of this.
            </p>
          </Prose>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <InsightCard
              label="Wrong medium"
              quote="Degree audits, GE trackers, and the Schedule of Classes live in separate places — none talk when you're stress-testing a plan."
            />
            <InsightCard
              label="Experimentation is punished"
              quote="Change your minor or move a course earlier? Most tools skip validation until registration or auto-schedule in ways students don't trust."
            />
            <InsightCard
              label="Feedback is too late or too noisy"
              quote="Prereq violations are easy to miss — and alarming UI breaks focus instead of teaching the rules."
            />
          </div>
          <div className="mt-14">
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-400">
              Goals
            </p>
            <BulletList
              items={[
                "One workspace — requirements pool, timeline, and metrics in a single view.",
                "Validate in calendar order — prereqs satisfied before the term, not just somewhere on the plan.",
                "Assist, don't override — valid-term hints, Fix actions, and undo; student stays in control.",
                "Calm over clever — course rows are the hero, not the chrome.",
                "Teach the rules — prereq trees and hover chains visible while you plan.",
              ]}
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="02" title="Solution snapshot" className="mt-20">
          <Prose>
            <p>
              Graduaid splits the screen into three layers: a requirements sidebar,
              a four-year timeline, and a validation engine that powers drag
              highlights, locked rows, alerts, and Fix actions — so every surface
              agrees on what valid means.
            </p>
          </Prose>
        </CaseStudySection>

        <CaseStudySection index="03" title="Process" className="mt-20">
          <Prose>
            <p>
              I mapped core flows on paper before high-fidelity UI: choose college,
              major, and minor; import transcript credit; visualize four years across
              quarters; drag courses into terms; flag prerequisite and availability
              conflicts.
            </p>
          </Prose>
          <div className="mt-12 grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <FeatureFigure
              src={`${IMG}/slide-03.png`}
              alt="Early scope notes and flow sketches"
              width={665}
              height={1107}
            />
            <BulletList
              items={[
                "Program setup: college, major, minor, Warren Programs of Concentration.",
                "Credit import: university transcript and AP/high school via OCR.",
                "Planning loop: drag from pool → valid-term highlights → sidebar mutes placed courses.",
                "Conflict states: prerequisite errors (hard lock) vs. quarter availability (warning).",
              ]}
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="04" title="How validation works" className="mt-20">
          <Prose>
            <p>
              The differentiator is calendar-order simulation — not &ldquo;do you have
              the prereq somewhere on the plan?&rdquo; but &ldquo;do you have it before
              this term?&rdquo; That matches how registration actually works.
            </p>
          </Prose>
          <div className="mt-14 space-y-16">
            <ValidationBeat
              step="01"
              title="Simulate prerequisites in order"
              problem="Prerequisites are AND-of-ORs — (CSE 12 OR CSE 20) AND MATH 20C — but students can't tell if their plan satisfies that in order."
              solution="Each course stores grouped prereqs. The engine walks years and quarters chronologically, building a satisfied set from transcript credit plus scheduled courses before evaluating each placement."
            />
            <ValidationBeat
              step="02"
              title="Highlight valid quarters while dragging"
              problem="Students don't know which quarters are valid until after they drop a course."
              solution="While dragging, valid terms highlight in neutral gray. The same simulation powers drop targets — if a quarter glows, prerequisites pass and the course is historically offered there."
            />
            <ValidationBeat
              step="03"
              title="Alerts & recovery"
              problem="Fixing a bad placement means hunting through four years manually."
              solution="Alerts include Move to earliest valid term — scan forward from Frosh year to the first slot where rules pass."
              copy="COGS 100 before COGS 1 surfaces in the metrics panel with a one-click Fix to the earliest valid term."
              image={`${IMG}/feature-validation.png`}
              alt="Validation alerts with Fix action"
              width={1821}
              height={825}
            />
            <ValidationBeat
              step="04"
              title="Inline on the timeline"
              copy="Locked rows show the same message as the alert panel — students see the problem on the row itself, not only in a dropdown."
              image={`${IMG}/feature-locked-row.png`}
              alt="Locked course row on timeline"
              width={1029}
              height={222}
              reverse
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="05" title="Features" className="mt-20">
          <div className="space-y-20">
            <FeatureRow
              title="Program setup"
              copy="Select college, major, and minor, then Run to rebuild the sidebar from the UCSD catalog."
              image={`${IMG}/feature-program.png`}
              alt="Program setup panel"
              width={4134}
              height={372}
            />
            <FeatureRow
              title="Requirements pool"
              copy="All graduation requirements in one sidebar — major sequences, one-of groups, college GEs, and university requirements."
              image={`${IMG}/feature-sidebar.png`}
              alt="Requirements sidebar with grouped requirements and progress"
              width={514}
              height={644}
              reverse
            />
            <FeatureRow
              title="Drag & drop timeline"
              copy="Drag courses onto quarters; valid terms highlight in gray while dragging and the sidebar mutes placed courses."
              image={`${IMG}/feature-drag.png`}
              alt="Timeline with valid quarter highlights during drag"
              width={3297}
              height={2109}
            />
            <FeatureRow
              title="Course detail"
              copy="Anchored detail card with prerequisite tree, quarters offered, unlock paths, and requirement mapping."
              image={`${IMG}/feature-course-detail.png`}
              alt="Course detail card"
              width={1491}
              height={1983}
              reverse
            />
            <FeatureBanner
              title="Multiple schedules"
              copy="Tabbed what-if plans — duplicate, rename, delete, with silent auto-save and undo."
              image={`${IMG}/feature-tabs.png`}
              alt="Schedule tabs"
              width={4134}
              height={126}
            />
          </div>
        </CaseStudySection>

        <CaseStudySection index="06" title="Interaction design" className="mt-20">
          <Prose>
            <p>
              Course rows are the hero — shared between sidebar and timeline. The UI
              teaches catalog rules while you plan.
            </p>
          </Prose>
          <div className="mt-10">
            <BulletList
              items={[
                "2px category stripe on rows — expands/highlights on hover.",
                "Neutral drag ghost and full-height gray drop zones.",
                "Silent auto-save with ⌘Z undo.",
                "Day and night themes via CSS tokens.",
              ]}
            />
          </div>
          <div className="mt-12 overflow-hidden rounded-sm bg-zinc-950">
            <div className="aspect-video w-full">
              <MediaCover
                src="/videos/graduaid-night-mode.mov"
                alt="Graduaid timeline in night mode"
                poster={`${IMG}/feature-night-timeline.png`}
                objectFit="contain"
                lazy={false}
              />
            </div>
          </div>
        </CaseStudySection>

        {work.tags && work.tags.length > 0 ? (
          <div className="mt-20 pt-4">
            <p className="text-sm text-zinc-400">Tags</p>
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

        <ProjectNavigation prev={prev} next={next} />
      </div>
    </main>
  );
}
