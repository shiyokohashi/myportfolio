import { notFound } from "next/navigation";

import { WorkDetail } from "@/components/WorkDetail";
import { PAINTINGS } from "@/data/paintings";
import { getWorkBySlug, getWorkSlugs } from "@/lib/portfolio";

type PaintingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWorkSlugs(PAINTINGS);
}

export default async function PaintingPage({ params }: PaintingPageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(PAINTINGS, slug);

  if (!work) notFound();

  return <WorkDetail work={work} naturalImages />;
}
