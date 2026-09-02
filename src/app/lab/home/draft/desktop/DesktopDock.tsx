"use client";

import Image from "next/image";

import { bindDesktopHoverTip, useDesktopHoverTip } from "./DesktopHoverTip";

export type DockApp = {
  id: string;
  label: string;
  icon: string;
  hint?: string;
  open: boolean;
  minimized: boolean;
};

export type DockLinkId = "linkedin" | "gmail" | "resume";

export type DockLink = {
  id: DockLinkId;
  label: string;
  hint?: string;
  open?: boolean;
};

type DesktopDockProps = {
  apps: DockApp[];
  links: DockLink[];
  onLaunch: (id: string) => void;
};

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="desktop-dock__svg-icon">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452z"
      />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="desktop-dock__svg-icon">
      <path
        fill="currentColor"
        d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
      />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="desktop-dock__svg-icon">
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        opacity="0.16"
      />
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 0v6h6l-6-6zm-3.5 9.5h7v1.5h-7zm0 3h7v1.5h-7zm0-6H13v1.5h-3.5z"
      />
    </svg>
  );
}

function DockLinkIcon({ id }: { id: DockLinkId }) {
  if (id === "linkedin") return <LinkedInIcon />;
  if (id === "gmail") return <GmailIcon />;
  return <ResumeIcon />;
}

export function DesktopDock({ apps, links, onLaunch }: DesktopDockProps) {
  const hoverTip = useDesktopHoverTip();

  return (
    <nav className="desktop-dock" aria-label="Dock">
      <ul className="desktop-dock__list">
        {apps.map((app) => {
          const tipHandlers = bindDesktopHoverTip(app.hint, hoverTip, false, "dock");
          return (
          <li key={app.id}>
            <button
              type="button"
              className={`desktop-dock__app${app.open && !app.minimized ? " is-running" : ""}`}
              onClick={() => onLaunch(app.id)}
              aria-label={app.label}
            >
              <span
                className="desktop-dock__icon-wrap"
                onMouseEnter={tipHandlers.onMouseEnter}
                onMouseLeave={tipHandlers.onMouseLeave}
                onPointerDown={tipHandlers.onPointerDown}
              >
                <Image
                  src={app.icon}
                  alt=""
                  width={52}
                  height={52}
                  className="desktop-dock__icon"
                  unoptimized
                />
              </span>
              <span className="desktop-dock__label">{app.label}</span>
            </button>
          </li>
          );
        })}
        {links.length > 0 ? <li className="desktop-dock__divider" aria-hidden /> : null}
        {links.map((link) => {
          const tipHandlers = bindDesktopHoverTip(link.hint, hoverTip);
          return (
          <li key={link.id}>
            <button
              type="button"
              className={`desktop-dock__app desktop-dock__app--link${link.open ? " is-running" : ""}`}
              onClick={() => onLaunch(link.id)}
              aria-label={link.label}
              onMouseEnter={tipHandlers.onMouseEnter}
              onMouseLeave={tipHandlers.onMouseLeave}
            >
              <span className="desktop-dock__icon-wrap desktop-dock__icon-wrap--link">
                <DockLinkIcon id={link.id} />
              </span>
              <span className="desktop-dock__label">{link.label}</span>
            </button>
          </li>
          );
        })}
      </ul>
    </nav>
  );
}
