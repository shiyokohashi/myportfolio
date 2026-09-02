import { notFound } from "next/navigation";

import { BrisbaneCaseStudy } from "@/components/BrisbaneCaseStudy";
import { GraduaidCaseStudy } from "@/components/GraduaidCaseStudy";
import { WorkDetail } from "@/components/WorkDetail";
import { PROJECTS } from "@/data/projects";
import { getWorkBySlug, getWorkSlugs, getAdjacentWorks } from "@/lib/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWorkSlugs(PROJECTS);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(PROJECTS, slug);

  if (!work) notFound();

  const { prev, next } = getAdjacentWorks(PROJECTS, slug);
  const nav = { prev, next, navBasePath: "/projects" as const };

  if (slug === "brisbane-2032") {
    return <BrisbaneCaseStudy work={work} {...nav} />;
  }

  if (slug === "graduaid") {
    return <GraduaidCaseStudy work={work} />;
  }

  return <WorkDetail work={work} {...nav} />;
}
