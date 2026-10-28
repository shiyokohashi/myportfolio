import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { GRAPHIC_DESIGN } from "@/data/graphic-design";

export default function GraphicDesignPage() {
  return (
    <PortfolioCategoryPage
      title="Branding"
      intro="Identities and campaigns — Triton Trading Group, Scot Scoop, AEON, Brisbane 2032, and more."
      items={GRAPHIC_DESIGN}
      basePath="/graphic-design"
    />
  );
}
