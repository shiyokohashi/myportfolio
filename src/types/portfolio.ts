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
};

export type SectionLayout = "contained" | "narrow" | "wide" | "full";

export type PortfolioSection = {
  title: string;
  description?: string;
  /** Editorial case-study width */
  layout?: SectionLayout;
  /** Side-by-side detail crops vs stacked full-width figures. */
  itemsLayout?: "stack" | "grid";
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
  year?: string;
  tags?: string[];
  /** Accent color for the home carousel card */
  color?: string;
  /** Projects */
  role?: string;
  /** Paintings, journalism, graphic design */
  medium?: string;
  thumbnail?: string;
  /** Native pixel size for video/image thumbnails — frames the media box exactly. */
  mediaAspect?: { width: number; height: number };
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
