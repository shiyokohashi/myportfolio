import { HomeDraft } from "./HomeDraft";

export const metadata = {
  title: "Home (draft)",
  robots: { index: false, follow: false },
};

/** Isolated homepage sandbox — edit files in this folder only. */
export default function HomeDraftPage() {
  return <HomeDraft />;
}
