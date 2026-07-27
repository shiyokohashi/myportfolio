import { PaintingsIndexPage } from "@/components/PaintingsIndexPage";
import { PAINTINGS } from "@/data/paintings";

export default function PaintingsPage() {
  return (
    <PaintingsIndexPage
      title="Paintings"
      items={PAINTINGS}
      basePath="/paintings"
    />
  );
}
