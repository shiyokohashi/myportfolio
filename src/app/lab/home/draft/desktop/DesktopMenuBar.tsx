"use client";

import { HOME_INTRO } from "@/data/home";

export function DesktopMenuBar() {
  return (
    <header className="desktop-menubar" aria-label="Desktop menu bar">
      <p className="desktop-menubar__brand">{HOME_INTRO.name}</p>
    </header>
  );
}
