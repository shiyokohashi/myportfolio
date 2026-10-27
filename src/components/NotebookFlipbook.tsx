"use client";

import { useCallback, useEffect, useRef } from "react";

import type { PageFlip } from "page-flip";

import { NOTEBOOK, type NotebookPage } from "@/data/notebook";
import { cn } from "@/lib/utils";

import "./NotebookFlipbook.css";

/** Single page proportions; the book stretches to fill its width. */
const PAGE_W = 300;
const PAGE_H = 410;
/** Narrower than two of these and page-flip shows one page at a time. */
const MIN_PAGE_W = 210;
const MAX_PAGE_W = 1400;
/** Small, uneven tilts so glued-in prints don't look machine-placed. */
const TILTS = [-1.2, 0.9, -0.6, 1.1, -0.8];

function PageFace({ page, index }: { page: NotebookPage; index: number }) {
  // No cover, so even indices sit on the left of a spread, odd on the right.
  const side = index % 2 === 0 ? "left" : "right";

  const link = page.href ? (
    // Plain <a>: page-flip forwards clicks on links instead of turning the page.
    <a href={page.href} className="nb-link">
      view project
    </a>
  ) : null;

  if (page.writing) {
    return (
      <div className={cn("nb-leaf nb-paper", `nb-side-${side}`)}>
        <div className="nb-writing">
          {page.writing.map((group, g) => (
            <div key={g} className="nb-writing-group">
              {group.map((line) => {
                const style = { marginLeft: `${line.x * 100}%`, width: `${line.w * 100}%` };
                // eslint-disable-next-line @next/next/no-img-element -- cloned into the flipbook DOM
                const img = <img src={line.image} alt={line.alt} draggable={false} />;
                return line.href ? (
                  <a
                    key={line.image}
                    href={line.href}
                    className="nb-writing-line nb-writing-link"
                    style={style}
                    {...(line.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {img}
                  </a>
                ) : (
                  <div key={line.image} className="nb-writing-line" style={style}>
                    {img}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {link}
      </div>
    );
  }

  if (page.gallery) {
    // Each row fills the width at one shared height; a lone portrait row is capped
    // to the tallest multi-image row so it doesn't swallow the page.
    const sums = page.gallery.map((row) => row.reduce((s, i) => s + i.ratio, 0));
    const cap = Math.max(...page.gallery.map((row, r) => (row.length > 1 ? 1 / sums[r] : 0)));
    let n = 0;
    return (
      <div className={cn("nb-leaf nb-paper", `nb-side-${side}`)}>
        <div className="nb-gallery">
          {page.gallery.map((row, r) => (
            <div
              key={r}
              className="nb-gallery-row"
              style={{
                ["--nb-row-h" as string]: `calc((100cqw - ${row.length - 1} * var(--nb-gap)) * ${Math.min(1 / sums[r], cap || 1)})`,
              }}
            >
              {row.map((item) => {
                const style = { aspectRatio: item.ratio, ["--nb-tilt" as string]: `${TILTS[n++ % TILTS.length]}deg` };
                return item.video ? (
                  // Started by the flipbook once cloned; see startLoops().
                  <video
                    key={item.video}
                    src={item.video}
                    poster={item.image}
                    aria-label={item.alt}
                    preload="none"
                    data-loop
                    className="nb-print nb-gallery-item"
                    style={style}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- cloned into the flipbook DOM
                  <img
                    key={item.image}
                    src={item.image}
                    alt={item.alt}
                    draggable={false}
                    className="nb-print nb-gallery-item"
                    style={style}
                  />
                );
              })}
            </div>
          ))}
        </div>
        {link}
      </div>
    );
  }

  if (page.print) {
    // Sketch on top, finished piece pasted in below it like a printed photo.
    return (
      <div className={cn("nb-leaf nb-paper", `nb-side-${side}`)}>
        <div className="nb-stack">
          {page.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- cloned into the flipbook DOM
            <img src={page.image} alt={page.alt ?? ""} draggable={false} className="nb-stack-sketch" />
          ) : null}
          {page.print.video ? (
            // Started by the flipbook once cloned; see startLoops().
            <video
              src={page.print.video}
              poster={page.print.image}
              aria-label={page.print.alt}
              preload="none"
              data-loop
              className="nb-print"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- cloned into the flipbook DOM
            <img
              src={page.print.image}
              alt={page.print.alt}
              draggable={false}
              className={page.print.style === "ink" ? "nb-print-ink" : "nb-print"}
            />
          )}
        </div>
        {link}
      </div>
    );
  }

  return (
    <div className={cn("nb-leaf nb-paper", `nb-side-${side}`)}>
      {page.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- cloned into the flipbook DOM
        <img
          src={page.image}
          alt={page.alt ?? ""}
          draggable={false}
          className={cn(
            "nb-image",
            page.fit === "cover" && "nb-image--bleed",
            page.align === "top" && "nb-image--top",
          )}
        />
      ) : null}
      {link}
    </div>
  );
}

/**
 * React sets `muted` as a property, which cloneNode drops — so cloned clips are
 * configured and started here instead of relying on autoplay attributes.
 */
function startLoops(root: HTMLElement) {
  for (const video of Array.from(root.querySelectorAll<HTMLVideoElement>("video[data-loop]"))) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.play().catch(() => {});
  }
}

/** Open notebook with draggable page-curl flips (StPageFlip). */
export function NotebookFlipbook({ className }: { className?: string }) {
  const pages: readonly NotebookPage[] =
    NOTEBOOK.pages.length % 2 === 0 ? NOTEBOOK.pages : [...NOTEBOOK.pages, {}];

  const templateRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    const template = templateRef.current;
    const mount = mountRef.current;
    if (!template || !mount) return;

    let cancelled = false;
    // page-flip moves and later removes its host, so it gets a node React doesn't own.
    const host = document.createElement("div");
    host.className = "nb-book";
    for (const child of Array.from(template.children)) host.appendChild(child.cloneNode(true));
    mount.appendChild(host);
    startLoops(host);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("page-flip").then(({ PageFlip }) => {
      if (cancelled) return;
      const flip = new PageFlip(host, {
        width: PAGE_W,
        height: PAGE_H,
        size: "stretch",
        minWidth: MIN_PAGE_W,
        maxWidth: MAX_PAGE_W,
        minHeight: Math.round((MIN_PAGE_W * PAGE_H) / PAGE_W),
        maxHeight: Math.round((MAX_PAGE_W * PAGE_H) / PAGE_W),
        showCover: false,
        drawShadow: true,
        maxShadowOpacity: 0.55,
        flippingTime: reduceMotion ? 300 : 700,
        usePortrait: true,
        mobileScrollSupport: true,
        showPageCorners: true,
        clickEventForward: true,
        autoSize: true,
      });
      flip.loadFromHTML(host.querySelectorAll<HTMLElement>(".nb-leaf"));
      flipRef.current = flip;
    });

    return () => {
      cancelled = true;
      flipRef.current?.destroy();
      flipRef.current = null;
      host.remove();
    };
  }, []);

  const prev = useCallback(() => flipRef.current?.flipPrev(), []);
  const next = useCallback(() => flipRef.current?.flipNext(), []);


  return (
    <div
      className={cn("nb-root", className)}
      role="region"
      aria-roledescription="notebook"
      aria-label={NOTEBOOK.title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div className="nb-stage">
        <div ref={mountRef} className="nb-mount" />
      </div>

      <div ref={templateRef} hidden aria-hidden>
        {pages.map((page, i) => (
          <PageFace key={i} page={page} index={i} />
        ))}
      </div>

    </div>
  );
}
