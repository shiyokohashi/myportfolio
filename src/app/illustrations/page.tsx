import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { ILLUSTRATIONS } from "@/data/illustrations";

export default function IllustrationsPage() {
  return (
    <PortfolioCategoryPage
      title="Illustrations"
      items={ILLUSTRATIONS}
      basePath="/illustrations"
      intro="Sketches and illustrations — Procreate, ink, charcoal, and mixed media."
    />
  );
}
