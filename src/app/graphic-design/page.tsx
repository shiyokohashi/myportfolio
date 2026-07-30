import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { GRAPHIC_DESIGN } from "@/data/graphic-design";

export default function GraphicDesignPage() {
  return (
    <PortfolioCategoryPage
      title="Graphic Design"
      intro="Branding · visual identity · design systems"
      items={GRAPHIC_DESIGN}
      basePath="/graphic-design"
    />
  );
}
