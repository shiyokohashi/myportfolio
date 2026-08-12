import { notFound } from "next/navigation";

import { WorkDetail } from "@/components/WorkDetail";
import { ILLUSTRATIONS } from "@/data/illustrations";
import { getWorkBySlug, getWorkSlugs } from "@/lib/portfolio";

type IllustrationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWorkSlugs(ILLUSTRATIONS);
}

export default async function IllustrationPage({ params }: IllustrationPageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(ILLUSTRATIONS, slug);

  if (!work) notFound();

  return <WorkDetail work={work} naturalImages />;
}
