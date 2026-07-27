import type { PortfolioWork } from "@/types/portfolio";

export type PaintingDimensions = {
  widthIn: number;
  heightIn: number;
};

const SKETCH_DEFAULT: PaintingDimensions = { widthIn: 9, heightIn: 12 };

/** Parse physical size from summary text, e.g. "2023 · 30×40 · Oil on canvas". */
export function parsePaintingDimensions(
  summary: string,
): PaintingDimensions | null {
  const match = summary.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;

  return {
    widthIn: Number.parseFloat(match[1]),
    heightIn: Number.parseFloat(match[2]),
  };
}

export function getPaintingDimensions(work: PortfolioWork): PaintingDimensions {
  return parsePaintingDimensions(work.summary) ?? SKETCH_DEFAULT;
}

export function paintingArea({ widthIn, heightIn }: PaintingDimensions): number {
  return widthIn * heightIn;
}

export function isPanorama(dims: PaintingDimensions): boolean {
  return dims.widthIn / dims.heightIn >= 1.75;
}

/** Rows of 1–2 pieces; wide panoramas and large canvases get their own row. */
export function buildPaintingRows(items: PortfolioWork[]): PortfolioWork[][] {
  const rows: PortfolioWork[][] = [];
  let index = 0;

  while (index < items.length) {
    const current = items[index];
    const dims = getPaintingDimensions(current);
    const area = paintingArea(dims);
    const next = items[index + 1];
    const nextDims = next ? getPaintingDimensions(next) : null;

    const solo =
      isPanorama(dims) ||
      area >= 1100 ||
      !next ||
      (nextDims && (isPanorama(nextDims) || paintingArea(nextDims) >= 1100));

    if (solo) {
      rows.push([current]);
      index += 1;
      continue;
    }

    rows.push([current, next]);
    index += 2;
  }

  return rows;
}

/** Column flex weight from canvas width (inches). */
export function paintingFlexWeight(work: PortfolioWork): number {
  return getPaintingDimensions(work).widthIn;
}

/** Solo pieces scale to a fraction of the row based on real width. */
export function soloPaintingWidth(work: PortfolioWork): string {
  const { widthIn } = getPaintingDimensions(work);
  const percent = Math.min(100, Math.max(42, (widthIn / 40) * 88));
  return `${percent}%`;
}
