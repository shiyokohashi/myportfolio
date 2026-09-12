import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { PROJECTS } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <PortfolioCategoryPage
      title="Projects"
      intro="Apps, product experiments, and brand work — from desktop tools to campaign systems."
      items={PROJECTS}
      basePath="/projects"
    />
  );
}
