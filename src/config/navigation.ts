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
