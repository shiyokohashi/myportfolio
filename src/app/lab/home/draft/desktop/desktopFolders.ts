import { ILLUSTRATIONS } from "@/data/illustrations";
import { HOME_JOURNALISM, HOME_PAINTINGS } from "@/data/home";
import { JOURNALISM } from "@/data/journalism";
import { PAINTINGS } from "@/data/paintings";

export type FolderId = "paintings" | "illustrations" | "journalism";

export type FolderItem = {
  slug: string;
  title: string;
  thumb: string;
  href: string;
  external?: boolean;
};

export type DesktopFolderConfig = {
  id: FolderId;
  label: string;
  description: string;
  iconRight: number;
  iconY: number;
  windowX: number;
  windowY: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  items: FolderItem[];
};

function mapItems(
  works: { slug: string; title: string; thumbnail?: string; images?: string[]; externalUrl?: string }[],
  basePath: string,
  options?: { internalOnly?: boolean },
): FolderItem[] {
  return works.map((work) => ({
    slug: work.slug,
    title: work.title,
    thumb: work.thumbnail || work.images?.[0] || "",
    href: options?.internalOnly
      ? `${basePath}/${work.slug}`
      : (work.externalUrl ?? `${basePath}/${work.slug}`),
    external: options?.internalOnly ? false : Boolean(work.externalUrl),
  }));
}

export const DESKTOP_FOLDERS: Record<FolderId, DesktopFolderConfig> = {
  paintings: {
    id: "paintings",
    label: "Paintings",
    description: HOME_PAINTINGS.blurb,
    iconRight: 56,
    iconY: 380,
    windowX: 120,
    windowY: 100,
    width: 560,
    height: 440,
    minWidth: 360,
    minHeight: 280,
    items: mapItems(PAINTINGS, "/paintings"),
  },
  illustrations: {
    id: "illustrations",
    label: "Illustrations",
    description: "Digital illustration and live drawing work.",
    iconRight: 56,
    iconY: 500,
    windowX: 180,
    windowY: 140,
    width: 580,
    height: 460,
    minWidth: 360,
    minHeight: 280,
    items: mapItems(ILLUSTRATIONS, "/illustrations"),
  },
  journalism: {
    id: "journalism",
    label: "Journalism",
    description: HOME_JOURNALISM.blurb,
    iconRight: 56,
    iconY: 620,
    windowX: 240,
    windowY: 180,
    width: 600,
    height: 480,
    minWidth: 380,
    minHeight: 300,
    items: mapItems(JOURNALISM, "/journalism", { internalOnly: true }),
  },
};

export const FOLDER_IDS = Object.keys(DESKTOP_FOLDERS) as FolderId[];
