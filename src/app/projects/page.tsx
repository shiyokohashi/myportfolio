import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { PROJECTS } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <PortfolioCategoryPage
      title="Personal Projects"
      editHint="Add or edit projects in src/data/projects.ts — each entry gets its own page."
      items={PROJECTS}
      basePath="/projects"
    />
  );
}
