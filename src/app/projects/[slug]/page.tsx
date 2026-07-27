import { notFound } from "next/navigation";

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

  return (
    <WorkDetail
      work={work}
      categoryTitle="Personal Projects"
      categoryHref="/projects"
    />
  );
}
