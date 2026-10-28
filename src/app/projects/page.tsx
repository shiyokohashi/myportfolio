import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { PROJECTS } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <PortfolioCategoryPage
      title="Webdev & Apps"
      intro="My personal favs — sites, apps, and tools I designed and built."
      items={PROJECTS}
      basePath="/projects"
    />
  );
}
