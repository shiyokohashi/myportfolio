export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Personal Projects", href: "/projects" },
  { label: "Graphic Design", href: "/graphic-design" },
  { label: "Paintings", href: "/paintings" },
  { label: "Journalism", href: "/journalism" },
  { label: "Home", href: "/" },
];

/** Scroll distance (px) at which the white background is fully opaque. */
export const SCROLL_BG_FULL_PX = 320;

/** Scroll distance (px) over which the white overlay fades out into the footer video. */
export const FOOTER_VIDEO_FADE_PX = 720;
