import { notFound } from "next/navigation";

import { BrisbaneCaseStudy } from "@/components/BrisbaneCaseStudy";
import { WorkDetail } from "@/components/WorkDetail";
import { GRAPHIC_DESIGN } from "@/data/graphic-design";
import { getWorkBySlug, getWorkSlugs } from "@/lib/portfolio";

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

  if (slug === "brisbane-2032") {
    return <BrisbaneCaseStudy work={work} />;
  }

  return <WorkDetail work={work} />;
}
