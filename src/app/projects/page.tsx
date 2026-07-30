import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { PROJECTS } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <PortfolioCategoryPage
      title="Personal Projects"
      items={PROJECTS}
      basePath="/projects"
    />
  );
}
