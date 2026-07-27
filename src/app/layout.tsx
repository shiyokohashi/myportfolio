import type { Metadata } from "next";

import { ScrollChrome } from "@/components/ScrollChrome";
import { VideoBackground } from "@/components/VideoBackground";
import { HorseSpeedProvider } from "@/contexts/HorseSpeedContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-x-hidden antialiased">
      <body className="relative min-h-full overflow-x-hidden bg-transparent font-sans text-zinc-900">
        <HorseSpeedProvider>
          <VideoBackground />
          <ScrollChrome />
          {children}
        </HorseSpeedProvider>
      </body>
    </html>
  );
}
