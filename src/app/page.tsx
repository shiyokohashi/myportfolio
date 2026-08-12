import { BottomScene } from "@/components/BottomScene";
import { HomeContact } from "@/components/HomeContact";
import { HomeIllustrations } from "@/components/HomeIllustrations";
import { HomeIntro } from "@/components/HomeIntro";
import { HomeJournalism } from "@/components/HomeJournalism";
import { HomePaintings } from "@/components/HomePaintings";
import { HomeSelectedWork } from "@/components/HomeSelectedWork";
import { HomeServices } from "@/components/HomeServices";
import { HomePreloads } from "@/components/HomePreloads";

export default function Home() {
  return (
    <>
      <HomePreloads />

      <main
        id="top"
        aria-label="Interactive project selection"
        className="relative z-10 min-h-screen"
      />
      <BottomScene />

      <a
        href="#intro"
        aria-label="Scroll to intro"
        className="scroll-hint-arrow fixed inset-x-0 bottom-6 z-[9999] flex justify-center text-white/70"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6 8 11 13 6" />
        </svg>
      </a>

      <HomeIntro />
      <HomeSelectedWork />
      <HomeServices />

      {/* Soft break — commercial work above, craft below */}
      <div className="relative z-40 border-t border-zinc-200/80 bg-zinc-50">
        <HomeJournalism />
        <HomePaintings />
        <HomeIllustrations />
      </div>

      <HomeContact />
    </>
  );
}
