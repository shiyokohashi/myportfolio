"use client";

import { ABOUT } from "@/data/about";

const RESUME_PDF_VIEWER_SRC = `${ABOUT.connect.resume.href}#navpanes=0&view=FitH`;

export function ResumeWindowContents() {
  return (
    <embed
      type="application/pdf"
      title={ABOUT.connect.resume.label}
      className="desktop-window__pdf"
      src={RESUME_PDF_VIEWER_SRC}
    />
  );
}
