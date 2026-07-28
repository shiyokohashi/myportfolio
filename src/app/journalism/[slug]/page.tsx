import { notFound } from "next/navigation";

import { WorkDetail } from "@/components/WorkDetail";
import { JOURNALISM } from "@/data/journalism";
import { getWorkBySlug, getWorkSlugs } from "@/lib/portfolio";

type JournalismWorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWorkSlugs(JOURNALISM);
}

export default async function JournalismWorkPage({
  params,
}: JournalismWorkPageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(JOURNALISM, slug);

  if (!work) notFound();

  return <WorkDetail work={work} />;
}
