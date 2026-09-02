import { PROJECTS } from "@/data/projects";
import { getCarouselDisplaySrc, getVideoPoster, isVideoSrc } from "@/lib/media";

export type DesktopProjectId =
  | "aeon"
  | "graduaid"
  | "imployed"
  | "triton-trading-group"
  | "brisbane-2032";

export type DesktopProjectConfig = {
  id: DesktopProjectId;
  label: string;
  slug: string;
  thumb: string;
  thumbVideo?: string;
  hint: string;
  iconX: number;
  iconY: number;
  windowX: number;
  windowY: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
};

function projectThumb(slug: string): string {
  const project = PROJECTS.find((entry) => entry.slug === slug);
  if (!project?.thumbnail) return "";
  return getCarouselDisplaySrc(project.thumbnail, slug) ?? getVideoPoster(slug) ?? project.thumbnail;
}

function projectVideoThumb(slug: string): string | undefined {
  const project = PROJECTS.find((entry) => entry.slug === slug);
  if (!project?.thumbnail || !isVideoSrc(project.thumbnail)) return undefined;
  return project.thumbnail;
}

function projectHint(slug: string): string {
  return PROJECTS.find((entry) => entry.slug === slug)?.summary ?? "";
}

export const DESKTOP_PROJECTS: Record<DesktopProjectId, DesktopProjectConfig> = {
  aeon: {
    id: "aeon",
    label: "aeon",
    slug: "aeon",
    thumb: projectThumb("aeon"),
    thumbVideo: projectVideoThumb("aeon"),
    hint: projectHint("aeon"),
    iconX: 56,
    iconY: 108,
    windowX: 88,
    windowY: 72,
    width: 760,
    height: 540,
    minWidth: 420,
    minHeight: 320,
  },
  graduaid: {
    id: "graduaid",
    label: "Graduaid",
    slug: "graduaid",
    thumb: projectThumb("graduaid"),
    hint: projectHint("graduaid"),
    iconX: 228,
    iconY: 196,
    windowX: 160,
    windowY: 96,
    width: 780,
    height: 560,
    minWidth: 440,
    minHeight: 320,
  },
  imployed: {
    id: "imployed",
    label: "Imployed",
    slug: "imployed",
    thumb: projectThumb("imployed"),
    thumbVideo: projectVideoThumb("imployed"),
    hint: projectHint("imployed"),
    iconX: 88,
    iconY: 292,
    windowX: 120,
    windowY: 148,
    width: 760,
    height: 540,
    minWidth: 420,
    minHeight: 320,
  },
  "triton-trading-group": {
    id: "triton-trading-group",
    label: "Triton Trading",
    slug: "triton-trading-group",
    thumb: projectThumb("triton-trading-group"),
    hint: projectHint("triton-trading-group"),
    iconX: 312,
    iconY: 128,
    windowX: 200,
    windowY: 64,
    width: 740,
    height: 520,
    minWidth: 400,
    minHeight: 300,
  },
  "brisbane-2032": {
    id: "brisbane-2032",
    label: "Brisbane 2032",
    slug: "brisbane-2032",
    thumb: projectThumb("brisbane-2032"),
    hint: projectHint("brisbane-2032"),
    iconX: 176,
    iconY: 408,
    windowX: 140,
    windowY: 120,
    width: 760,
    height: 540,
    minWidth: 420,
    minHeight: 320,
  },
};

export const DESKTOP_PROJECT_IDS = Object.keys(DESKTOP_PROJECTS) as DesktopProjectId[];
