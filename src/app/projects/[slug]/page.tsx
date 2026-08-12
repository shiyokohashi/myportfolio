import { notFound } from "next/navigation";

import { BrisbaneCaseStudy } from "@/components/BrisbaneCaseStudy";
import { WorkDetail } from "@/components/WorkDetail";
import { PROJECTS } from "@/data/projects";
import { getWorkBySlug, getWorkSlugs } from "@/lib/portfolio";

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

  if (slug === "brisbane-2032") {
    return <BrisbaneCaseStudy work={work} />;
  }

  return <WorkDetail work={work} />;
}
