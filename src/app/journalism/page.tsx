import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { JOURNALISM } from "@/data/journalism";

export default function JournalismPage() {
  return (
    <PortfolioCategoryPage
      title="Journalism"
      items={JOURNALISM}
      basePath="/journalism"
    />
  );
}
