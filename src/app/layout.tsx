import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import { ScrollChrome } from "@/components/ScrollChrome";
import { VideoBackground } from "@/components/VideoBackground";
import { HorseSpeedProvider } from "@/contexts/HorseSpeedContext";
import { ScrollRevealProvider } from "@/contexts/ScrollRevealContext";
import { cn } from "@/lib/utils";

import "./globals.css";

/** Editorial display — less overused than Instrument Serif. */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

/** Clean UI / body sans. */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Shiyo Ohashi",
    template: "%s · Shiyo Ohashi",
  },
  description:
    "I build brands, visual identities, and digital experiences. Available for freelance & ongoing creative work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full overflow-x-hidden antialiased",
        newsreader.variable,
        manrope.variable,
      )}
    >
      <body className="relative min-h-full overflow-x-hidden bg-transparent font-sans text-zinc-900 antialiased">
        <HorseSpeedProvider>
          <ScrollRevealProvider>
            <VideoBackground />
            <ScrollChrome />
            {children}
          </ScrollRevealProvider>
        </HorseSpeedProvider>
      </body>
    </html>
  );
}
