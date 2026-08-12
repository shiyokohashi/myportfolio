/** Responsive horizontal padding for page sections. */
export const PAGE_GUTTER = "px-[clamp(1.75rem,7vw,6.5rem)] sm:px-[clamp(3rem,10vw,9rem)]";

/** Standard vertical section padding — editorial rhythm. */
export const SECTION_PY = "py-36 sm:py-48 lg:py-56";

/** Tighter vertical padding for lighter sections. */
export const SECTION_PY_COMPACT = "py-24 sm:py-32 lg:py-36";

/** Content max width for works listings. */
export const CONTENT_MAX = "max-w-6xl";

/** Wider max width for the home selected-works grid. */
export const WORKS_MAX = "max-w-[min(1480px,100%)]";

/** Bottom padding on the last home section — clears the fixed horse UI, no footer. */
export const PAGE_END_PB =
  "pb-[clamp(16rem,32vh,22rem)] sm:pb-[clamp(18rem,36vh,24rem)] lg:pb-[clamp(20rem,40vh,28rem)]";

/**
 * Home type scale — keep sizes few and consistent.
 * name: intro brand lockup only — large editorial display
 * display: contact headline
 * section: section h2
 * item: project / service titles
 * body: positioning, blurbs, descriptions
 * meta: roles, nav links, secondary CTAs
 */
export const HOME_TYPE = {
  name: "font-display text-[clamp(3.75rem,12vw,8.5rem)] leading-[0.92] tracking-[-0.04em]",
  display: "font-display text-4xl tracking-tight sm:text-5xl",
  section: "font-display text-3xl tracking-tight sm:text-4xl",
  item: "font-display text-xl tracking-tight sm:text-2xl",
  body: "text-base leading-relaxed",
  meta: "text-sm",
} as const;

/** Shared home grid rhythm — room between cards. */
export const HOME_GRID_GAP =
  "mt-20 grid list-none gap-x-10 gap-y-20 sm:mt-28 sm:gap-x-14 sm:gap-y-28 lg:gap-x-16 lg:gap-y-32";

export const HOME_GRID_GAP_COMPACT =
  "mt-20 grid list-none gap-x-10 gap-y-16 sm:mt-28 sm:gap-x-12 sm:gap-y-24 lg:gap-x-14 lg:gap-y-28";

/** Subtle card media hover — lift + soft shadow; pair with image scale inside. */
export const HOME_CARD_MEDIA =
  "overflow-hidden rounded-lg bg-zinc-100 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-18px_rgba(24,24,27,0.35)]";

export const HOME_CARD_MEDIA_IMG =
  "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]";

/** Same hover treatment, but never crop — for posters with important text. */
export const HOME_CARD_MEDIA_IMG_CONTAIN =
  "object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";