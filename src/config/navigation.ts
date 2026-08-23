export type NavItem = {
  label: string;
  href: string;
};

/** Main menu — mirrors home page sections. */
export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/#intro" },
  { label: "Work", href: "/#work" },
  { label: "Journalism", href: "/#journalism" },
  { label: "Paintings", href: "/#paintings" },
  { label: "Illustrations", href: "/#illustrations" },
  { label: "Contact", href: "/#contact" },
];

/** Scroll distance (px) at which the white background is fully opaque. */
export const SCROLL_BG_FULL_PX = 320;
