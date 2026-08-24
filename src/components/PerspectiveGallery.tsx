"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { buildCarouselDeck } from "@/data/cards";
import { getCarouselDisplaySrc } from "@/lib/media";
import { GalleryWalkHorse } from "@/components/GalleryWalkHorse";
import "./PerspectiveGallery.css";

type Side = "left" | "right";

interface GalleryImage {
  id: number;
  src: string;
  href: string;
  title: string;
  side: Side;
  slot: number;
}

type BannerSource = {
  src: string;
  href: string;
  title: string;
};

/** Local plane size of each banner (4:3) before perspective warp */
const SRC_W = 800;
const SRC_H = 600;

/**
 * Extra gap between banners as a fraction of edge banner width.
 * Spacing is in pixels along the guide so left/right stay even and nothing piles up.
 */
const GUTTER = 0.4;
/**
 * Banner width vs full wedge × 4/3 — small enough for clear gutters
 * between consecutive frames along each side.
 */
const SIZE = 0.42;
const AISLE = 0.1;

/** At the side edges, banners span this fraction of the viewport height */
const EDGE_HEIGHT = 0.5;
/** Vanishing point as a fraction of viewport width from the left */
const VP_X = 0.7;

const MIN_PAIR_COUNT = 8;

function bannerSourcesFromPortfolio(): BannerSource[] {
  const sources: BannerSource[] = [];
  for (const card of buildCarouselDeck()) {
    if (!card.href || card.secret) continue;
    const src = getCarouselDisplaySrc(card.thumbnail, card.id);
    if (!src) continue;
    sources.push({ src, href: card.href, title: card.title });
  }
  return sources;
}

function buildGalleryImages(srcs: BannerSource[]): GalleryImage[] {
  const usable =
    srcs.length > 0
      ? srcs
      : Array.from({ length: MIN_PAIR_COUNT * 2 }, (_, i) => ({
          src: `https://picsum.photos/seed/warp${i + 1}/800/600`,
          href: "/projects",
          title: "Projects",
        }));
  const pairCount = Math.max(MIN_PAIR_COUNT, Math.ceil(usable.length / 2));
  return Array.from({ length: pairCount * 2 }, (_, i) => {
    const slot = Math.floor(i / 2);
    const side: Side = i % 2 === 0 ? "left" : "right";
    const banner = usable[i % usable.length];
    return {
      id: i,
      side,
      slot,
      src: banner.src,
      href: banner.href,
      title: banner.title,
    };
  });
}

/** Pixel width of a banner sitting at the page edge (max size on this path) */
function edgeBannerWidth(height: number) {
  return height * EDGE_HEIGHT * (SRC_W / SRC_H) * SIZE;
}

/** Center-to-center distance along the guide — constant in px, both sides */
function spacingPx(height: number) {
  const w = edgeBannerWidth(height);
  return w * (1 + GUTTER);
}

/** Vanishing lines: meet at VP_X, open to EDGE_HEIGHT at the sides.
 *  Past the page edges they continue as parallel rails so banners
 *  slide off cleanly without further rotation/warp. */
function xLines(x: number, width: number, height: number) {
  const vpX = width * VP_X;
  const vpY = height / 2;
  const edgeTop = (height * (1 - EDGE_HEIGHT)) / 2;
  const edgeBot = (height * (1 + EDGE_HEIGHT)) / 2;
  const edgeGap = edgeBot - edgeTop;

  if (x <= 0 || x >= width) {
    return { top: edgeTop, bot: edgeBot, gap: edgeGap };
  }

  const t =
    x <= vpX
      ? vpX <= 0
        ? 1
        : x / vpX
      : width - vpX <= 0
        ? 1
        : (width - x) / (width - vpX);

  const top = edgeTop + t * (vpY - edgeTop);
  const bot = edgeBot + t * (vpY - edgeBot);

  return { top, bot, gap: bot - top };
}

/* —— Homography → CSS matrix3d (rectangle → perspective quad) —— */

function multiply(a: number[], b: number[]) {
  const c = Array(9).fill(0);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        c[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
      }
    }
  }
  return c;
}

function multiplyVec(m: number[], v: number[]) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

function adj(m: number[]) {
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
}

function basisToPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
) {
  const m = [x1, x2, x3, y1, y2, y3, 1, 1, 1];
  const v = multiplyVec(adj(m), [x4, y4, 1]);
  return multiply(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

/** Map local (0,0)–(w,h) rectangle onto destination quad tl→tr→br→bl */
function matrixToQuad(
  w: number,
  h: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
) {
  // Source corners: tl, tr, bl, br → dest: tl, tr, bl, br
  const s = basisToPoints(0, 0, w, 0, 0, h, w, h);
  const d = basisToPoints(x1, y1, x2, y2, x4, y4, x3, y3);
  const t = multiply(d, adj(s));
  const inv = t[8] || 1;
  for (let i = 0; i < 9; i++) t[i] /= inv;

  if (t.some((n) => !Number.isFinite(n))) {
    return "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
  }

  return `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`;
}

/**
 * Perspective banner on one side of the X.
 * `dist` is distance in px from the vanishing point toward that side's edge
 * (and beyond, so banners slide off along the guides without piling up).
 */
function frameLayout(side: Side, dist: number, width: number, height: number) {
  const empty = {
    opacity: 0,
    transform: "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)",
    aabb: { x0: 0, x1: 0 },
  };

  if (width <= 0 || height <= 0 || dist < 4) return empty;

  const vpX = width * VP_X;
  const sign = side === "left" ? -1 : 1;
  const edgeX = side === "left" ? 0 : width;
  const aisleX = vpX - sign * width * AISLE;
  const travel = Math.abs(edgeX - vpX);

  // Position along the guide — continues past the edge for a clean slide-off
  const cx = vpX + sign * dist;

  const midGap = xLines(cx, width, height).gap;
  let frameW = midGap * (SRC_W / SRC_H) * SIZE;

  let x0 = cx - frameW / 2;
  let x1 = cx + frameW / 2;

  // Aisle clamp only while still inside the corridor
  if (dist <= travel) {
    if (side === "left" && x1 > aisleX) {
      x1 = aisleX;
      x0 = x1 - frameW;
    } else if (side === "right" && x0 < aisleX) {
      x0 = aisleX;
      x1 = x0 + frameW;
    }
  }

  frameW = x1 - x0;
  if (frameW < 8) return empty;

  // Fully off-screen — drop with no fade
  if (side === "left" && x1 < 0) return empty;
  if (side === "right" && x0 > width) return empty;

  // Top/bottom stay on the guidelines (parallel rails past the edge)
  const left = xLines(x0, width, height);
  const right = xLines(x1, width, height);

  const transform = matrixToQuad(
    SRC_W,
    SRC_H,
    x0,
    left.top,
    x1,
    right.top,
    x1,
    right.bot,
    x0,
    left.bot,
  );

  // Fade in near the vanishing point only
  const t = travel > 0 ? dist / travel : 1;
  let opacity = 1;
  if (t < 0.08) opacity = Math.max(0, (t - 0.03) / 0.05);

  return {
    opacity,
    transform,
    aabb: { x0: Math.min(x0, x1), x1: Math.max(x0, x1) },
  };
}

function GalleryFrame({
  image,
  camera,
  vw,
  vh,
}: {
  image: GalleryImage;
  camera: MotionValue<number>;
  vw: MotionValue<number>;
  vh: MotionValue<number>;
}) {
  const layout = useTransform([camera, vw, vh], ([c, w, h]) => {
    const sp = spacingPx(h as number);
    const dist = (c as number) - image.slot * sp;
    return frameLayout(image.side, dist, w as number, h as number);
  });

  const opacity = useTransform(layout, (l) => l.opacity);
  const transform = useTransform(layout, (l) => l.transform);

  return (
    <motion.div
      className={`gallery-frame gallery-frame--${image.side}`}
      style={{ opacity, transform }}
    >
      <Link
        href={image.href}
        className="gallery-frame__link"
        aria-label={image.title}
      >
        <img
          src={image.src}
          alt=""
          loading="lazy"
          draggable={false}
          width={SRC_W}
          height={SRC_H}
        />
      </Link>
    </motion.div>
  );
}

export function PerspectiveGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const vw = useMotionValue(0);
  const vh = useMotionValue(0);

  const images = useMemo(
    () => buildGalleryImages(bannerSourcesFromPortfolio()),
    [],
  );
  const pairCount = images.length / 2;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      vw.set(el.clientWidth);
      vh.set(el.clientHeight);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vw, vh]);

  // Mimic sticky: fixed while the tall section fills the viewport.
  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    const syncPin = () => {
      const rect = container.getBoundingClientRect();
      const vhPx = window.innerHeight;
      viewport.classList.remove(
        "gallery-viewport--pinned",
        "gallery-viewport--after",
      );
      if (rect.top <= 0 && rect.bottom >= vhPx) {
        viewport.classList.add("gallery-viewport--pinned");
      } else if (rect.bottom < vhPx) {
        viewport.classList.add("gallery-viewport--after");
      }
    };

    syncPin();
    window.addEventListener("scroll", syncPin, { passive: true });
    window.addEventListener("resize", syncPin, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncPin);
      window.removeEventListener("resize", syncPin);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Camera distance along the guide in px — spacing stays even through exit
  const camera = useTransform([scrollYProgress, vw, vh], ([p, w, h]) => {
    const sp = spacingPx(h as number);
    const vpX = (w as number) * VP_X;
    const maxTravel = Math.max(vpX, (w as number) - vpX);
    const exitPad = edgeBannerWidth(h as number) * 1.2;
    const start = sp * 0.2;
    const end = pairCount * sp + maxTravel + exitPad;
    return start + (p as number) * (end - start);
  });

  return (
    <div ref={containerRef} className="gallery-scroll" id="top">
      <div
        ref={viewportRef}
        className="gallery-viewport"
        aria-label="Perspective project gallery"
      >
        <div className="gallery-world">
          {images.map((image) => (
            <GalleryFrame
              key={image.id}
              image={image}
              camera={camera}
              vw={vw}
              vh={vh}
            />
          ))}
        </div>

        <GalleryWalkHorse
          scrollYProgress={scrollYProgress}
          vw={vw}
          vh={vh}
        />
      </div>
    </div>
  );
}
