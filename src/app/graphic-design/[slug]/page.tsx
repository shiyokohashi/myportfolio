import { notFound } from "next/navigation";

import { BrisbaneCaseStudy } from "@/components/BrisbaneCaseStudy";
import { WorkDetail } from "@/components/WorkDetail";
import { GRAPHIC_DESIGN } from "@/data/graphic-design";
import { getWorkBySlug, getWorkSlugs, getAdjacentWorks } from "@/lib/portfolio";

type GraphicDesignWorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWorkSlugs(GRAPHIC_DESIGN);
}

export default async function GraphicDesignWorkPage({
  params,
}: GraphicDesignWorkPageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(GRAPHIC_DESIGN, slug);

  if (!work) notFound();

  const { prev, next } = getAdjacentWorks(GRAPHIC_DESIGN, slug);
  const nav = { prev, next, navBasePath: "/graphic-design" as const };

  if (slug === "brisbane-2032") {
    return <BrisbaneCaseStudy work={work} {...nav} />;
  }

  return <WorkDetail work={work} {...nav} />;
}
