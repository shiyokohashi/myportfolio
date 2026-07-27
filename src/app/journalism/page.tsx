import { PortfolioCategoryPage } from "@/components/PortfolioCategoryPage";
import { JOURNALISM } from "@/data/journalism";

export default function JournalismPage() {
  return (
    <PortfolioCategoryPage
      title="Journalism"
      editHint="18 works — editorial cartoons, feature photos, and commission work."
      items={JOURNALISM}
      basePath="/journalism"
    />
  );
}
