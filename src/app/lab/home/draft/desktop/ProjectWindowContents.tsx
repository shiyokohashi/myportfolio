"use client";

type ProjectWindowContentsProps = {
  slug: string;
  title: string;
};

export function ProjectWindowContents({ slug, title }: ProjectWindowContentsProps) {
  return (
    <iframe
      title={title}
      className="desktop-window__iframe desktop-window__iframe--project"
      src={`/projects/${slug}?embedded=1`}
    />
  );
}
