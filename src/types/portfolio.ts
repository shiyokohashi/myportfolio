/**
 * Shared shape for portfolio entries across categories.
 * Edit the data files in src/data/ — pages pick up changes automatically.
 */
export type PortfolioSectionItem = {
  title?: string;
  description?: string;
  image?: string;
  video?: string;
  width?: number;
  height?: number;
  /** Cap rendered width while keeping full-resolution source. */
  displayWidth?: number;
  /** Slight center zoom on video figures. */
  cropVideo?: boolean;
  /** Center zoom amount when cropVideo is set (default 1.03). */
  videoCropScale?: number;
  /** Storyboard beat — time, visual, audio, purpose. */
  shot?: {
    visual: string;
    audio: string;
    purpose: string;
  };
  /** Actual cut — shown in the Purpose column on storyboard rows. */
  executionVideo?: string;
  executionVideoWidth?: number;
  executionVideoHeight?: number;
  /** Seconds into the clip where playback begins (e.g. when hand leaves frame). */
  executionVideoStart?: number;
};

export type SectionLayout = "contained" | "narrow" | "wide" | "full";

export type SectionDescriptionGroup = {
  heading: string;
  points?: string[];
  entries?: { title: string; description: string }[];
  entriesLayout?: "stack" | "horizontal";
};

export type PortfolioEditorialHero = {
  video: string;
  width: number;
  height: number;
  headline: string;
  tagline: string;
  metadata: string[];
};

export type PortfolioWorkflow = {
  title: string;
  steps: string[];
  image?: {
    src: string;
    width: number;
    height: number;
    alt?: string;
    caption?: string;
  };
};

export type PortfolioSection = {
  title: string;
  description?: string;
  /** Structured notes beneath the section intro — e.g. creative direction briefs. */
  descriptionGroups?: SectionDescriptionGroup[];
  /** Side-by-side text blocks — e.g. problem / concept pair */
  columns?: {
    title: string;
    description?: string;
    descriptionGroups?: SectionDescriptionGroup[];
  }[];
  /** Render media items above section copy instead of below */
  itemsPlacement?: "before" | "after";
  /** Editorial case-study width */
  layout?: SectionLayout;
  /** Side-by-side detail crops vs stacked full-width figures. */
  itemsLayout?: "stack" | "grid" | "grid-3" | "grid-4" | "storyboard";
  /** Image centered with feature copy on left and right */
  featureWrap?: {
    heading?: string;
    image: {
      image: string;
      width: number;
      height: number;
      displayWidth?: number;
    };
    left: { title: string; description: string }[];
    right: { title: string; description: string }[];
  };
  /** @deprecated Use layout — kept for graphic design archives */
  variant?: "banner" | "grid";
  items: PortfolioSectionItem[];
};

export type PortfolioWork = {
  /** URL segment, e.g. "my-project" → /projects/my-project */
  slug: string;
  title: string;
  /** One-line blurb for cards and listing pages */
  summary: string;
  /** Paragraphs shown on the detail page */
  description: string[];
  /** Optional intro block above description — e.g. project overview */
  overview?: {
    title: string;
    text: string;
  };
  /** Optional challenge brief above description */
  challenge?: {
    title: string;
    text: string;
  };
  /** Optional key facts — role, duration, tools */
  snapshot?: {
    title: string;
    items: { label: string; value: string }[];
  };
  /** Full-viewport opener — render, headline, sprint metadata */
  editorialHero?: PortfolioEditorialHero;
  /** Vertical process reveal after the hero */
  workflow?: PortfolioWorkflow;
  year?: string;
  tags?: string[];
  /** Accent color for the home carousel card */
  color?: string;
  /** Projects */
  role?: string;
  /** Paintings, journalism, graphic design */
  medium?: string;
  thumbnail?: string;
  /** How the thumbnail fills its frame — use contain when text must stay fully visible. */
  thumbnailFit?: "cover" | "contain";
  /** Native pixel size for video/image thumbnails — frames the media box exactly. */
  mediaAspect?: { width: number; height: number };
  /** Slight zoom on video thumbnails to hide edge artifacts or tighten framing. */
  thumbnailCrop?: boolean;
  /** Center zoom amount when thumbnailCrop is set (default 1.03). */
  videoCropScale?: number;
  images?: string[];
  sections?: PortfolioSection[];
  /** Full-bleed section flow with natural image sizing */
  detailLayout?: "standard" | "editorial";
  pdfUrl?: string;
  externalUrl?: string;
  /** Journalism archive grouping, e.g. Editorial Cartoons */
  group?: string;
};

export type AboutContent = {
  title: string;
  portrait?: string;
  paragraphs: string[];
  bullets?: string[];
  connect: {
    resume: {
      label: string;
      href: string;
    };
    email: string;
    linkedin: {
      label: string;
      href: string;
    };
  };
};
