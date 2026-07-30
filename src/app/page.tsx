import { AboutSection } from "@/components/AboutSection";
import { BottomScene } from "@/components/BottomScene";
import { HomePreloads } from "@/components/HomePreloads";
import { SelectedWorksSection } from "@/components/SelectedWorksSection";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <HomePreloads />
      <main
        className={cn(
          "relative z-10 flex min-h-screen flex-col items-center justify-center py-16",
          PAGE_GUTTER,
        )}
      >
        <div className="text-center">
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            Shiyo Ohashi
          </h1>
        </div>

        <a
          href="#about"
          aria-label="Scroll to about section"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 transition-opacity hover:text-white/90"
        >
          <svg
            aria-hidden
            viewBox="0 0 12 12"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 4.5 6 8.5 10 4.5" />
          </svg>
        </a>
      </main>

      <AboutSection />
      <SelectedWorksSection />
      <BottomScene />
    </>
  );
}
