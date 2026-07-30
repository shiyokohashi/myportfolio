/** Monotonic origin for entrance animations — set once per page session. */
let pageLoadOriginMs: number | null = null;

export function getPageLoadOriginMs(): number {
  if (pageLoadOriginMs === null) {
    pageLoadOriginMs = performance.now();
  }

  return pageLoadOriginMs;
}
