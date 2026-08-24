"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { NAV_ITEMS } from "@/config/navigation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

function isNavItemActive(pathname: string, href: string, hash: string): boolean {
  if (href.startsWith("/#")) {
    if (pathname !== "/") return false;
    return hash === href.slice(1);
  }
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
  const [hash, setHash] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const openMenu = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setOpen(false);
    }, 120);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-end text-right"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-nav-menu"
        aria-haspopup="true"
        onFocus={openMenu}
        className={cn(
          "text-sm font-medium tracking-[-0.01em] transition-opacity hover:opacity-70",
          lightText
            ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]"
            : "text-zinc-900",
        )}
      >
        Menu
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
          const isActive = isNavItemActive(pathname, href, hash);

          return (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={cn(
                "block whitespace-nowrap text-right text-sm font-medium leading-none tracking-[-0.01em] transition-opacity hover:opacity-70",
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
  const { lightNav } = useScrollReveal();
  const lightText = isHome && lightNav;

  return (
    <>
      {!isHome ? <div aria-hidden className="fixed inset-0 z-0 bg-white" /> : null}

      <BreadcrumbNav
        pathname={pathname}
        lightText={lightText}
        className="fixed left-0 top-0 z-[100] max-w-[min(72vw,28rem)] p-[clamp(1.25rem,4vw,2rem)]"
      />

      <header className="fixed right-0 top-0 z-[100] p-[clamp(1.25rem,4vw,2rem)] text-right">
        <SiteNav key={pathname} pathname={pathname} lightText={lightText} />
      </header>
    </>
  );
}
