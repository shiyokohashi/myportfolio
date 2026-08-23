import { BottomScene } from "@/components/BottomScene";
import { HomeContact } from "@/components/HomeContact";
import { HomeIllustrations } from "@/components/HomeIllustrations";
import { HomeIntro } from "@/components/HomeIntro";
import { HomeJournalism } from "@/components/HomeJournalism";
import { HomePaintings } from "@/components/HomePaintings";
import { HomeSelectedWork } from "@/components/HomeSelectedWork";
import { HomePreloads } from "@/components/HomePreloads";
import { ScrollHintArrow } from "@/components/ScrollHintArrow";

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

      <ScrollHintArrow />

      <HomeIntro />
      <HomeSelectedWork />

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
