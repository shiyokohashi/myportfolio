"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAV_ITEMS } from "@/config/navigation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

function isNavItemActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  if (href === pathname) return true;
  return href !== "/" && pathname.startsWith(`${href}/`);
}

function SiteNav({
  pathname,
  lightText = false,
}: {
  pathname: string;
  lightText?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="flex flex-col items-end text-right">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-nav-menu"
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "text-sm transition-opacity hover:opacity-70",
          lightText
            ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]"
            : "text-zinc-900",
        )}
      >
        {open ? "Close" : "Menu"}
      </button>

      <nav
        id="site-nav-menu"
        aria-label="Main"
        aria-hidden={!open}
        inert={open ? undefined : true}
        className={cn(
          "flex w-full flex-col items-end",
          "transition-[opacity,transform,margin] duration-200 ease-out",
          open
            ? "pointer-events-auto mt-4 translate-y-0 gap-3 opacity-100"
            : "pointer-events-none mt-0 h-0 gap-0 overflow-hidden opacity-0",
        )}
      >
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = isNavItemActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={cn(
                "block whitespace-nowrap text-right text-sm leading-none transition-opacity hover:opacity-70",
                lightText
                  ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]"
                  : "text-zinc-900",
                isActive && "underline underline-offset-4",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Home: white backdrop reveals on scroll; compact nav stays top-right.
 * Other pages: fixed white background with the same nav treatment.
 */
export function ScrollChrome() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { backgroundOpacity, footerVideoReveal } = useScrollReveal();

  const whiteOverlayStyle =
    isHome && footerVideoReveal > 0
      ? {
          opacity: 1,
          WebkitMaskImage: `linear-gradient(to bottom, #000 0%, #000 ${Math.max(0, (1 - footerVideoReveal) * 100 - 14)}%, transparent ${Math.min(100, (1 - footerVideoReveal) * 100 + 56)}%)`,
          maskImage: `linear-gradient(to bottom, #000 0%, #000 ${Math.max(0, (1 - footerVideoReveal) * 100 - 14)}%, transparent ${Math.min(100, (1 - footerVideoReveal) * 100 + 56)}%)`,
        }
      : { opacity: backgroundOpacity };

  return (
    <>
      {!isHome ? <div aria-hidden className="fixed inset-0 z-0 bg-white" /> : null}

      {isHome ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-30 bg-white"
          style={whiteOverlayStyle}
        />
      ) : null}

      <header className="fixed right-0 top-0 z-[100] p-[clamp(1.25rem,4vw,2rem)] text-right">
        <SiteNav
          pathname={pathname}
          lightText={
            isHome && backgroundOpacity < 0.35 && footerVideoReveal < 0.75
          }
        />
      </header>
    </>
  );
}
