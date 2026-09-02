"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";

import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { cn } from "@/lib/utils";

export type BreadcrumbNavProps = {
  pathname: string;
  lightText?: boolean;
  className?: string;
};

export function BreadcrumbNav({
  pathname,
  lightText = false,
  className,
}: BreadcrumbNavProps) {
  const crumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "max-w-[min(72vw,28rem)] text-sm leading-snug",
        lightText
          ? "text-white/45 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
          : "text-zinc-400/90",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden className="opacity-45">
                  →
                </li>
              ) : null}
              <li
                className={cn(
                  isLast && !lightText && "text-zinc-500",
                  isLast && lightText && "text-white/60",
                )}
              >
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="transition-opacity hover:opacity-70"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined}>
                    {crumb.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
