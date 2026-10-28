import { ABOUT } from "@/data/about";

export type NavItem = {
  label: string;
  href: string;
};

/** Main site menu — routes to real pages (homepage intro is the only hash link). */
export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/#intro" },
  { label: "Webdev & Apps", href: "/projects" },
  { label: "Branding", href: "/graphic-design" },
  { label: "Paintings", href: "/paintings" },
  { label: "Illustrations", href: "/illustrations" },
  { label: "Cartoons", href: "/journalism" },
  { label: "Contact", href: `mailto:${ABOUT.connect.email}` },
];

/** Scroll distance (px) at which the white background is fully opaque. */
export const SCROLL_BG_FULL_PX = 320;
