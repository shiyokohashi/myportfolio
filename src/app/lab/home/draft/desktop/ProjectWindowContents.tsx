"use client";

import { workHref } from "@/data/works";

type ProjectWindowContentsProps = {
  slug: string;
  title: string;
};

export function ProjectWindowContents({ slug, title }: ProjectWindowContentsProps) {
  return (
    <iframe
      title={title}
      className="desktop-window__iframe desktop-window__iframe--project"
      src={`${workHref(slug)}?embedded=1`}
    />
  );
}
