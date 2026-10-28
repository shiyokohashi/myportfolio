import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { JOURNALISM } from "@/data/journalism";

export default function JournalismPage() {
  return (
    <PortfolioCategoryPage
      title="Editorial & Digital Cartoons"
      intro="High school – present: editorial cartoons, feature art, and commissions."
      items={JOURNALISM}
      basePath="/journalism"
    />
  );
}
