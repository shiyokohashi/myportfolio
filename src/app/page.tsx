import { HomeContact } from "@/components/HomeContact";
import { HomeIllustrations } from "@/components/HomeIllustrations";
import { HomeIntro } from "@/components/HomeIntro";
import { HomeJournalism } from "@/components/HomeJournalism";
import { HomePaintings } from "@/components/HomePaintings";
import { HomeSelectedWork } from "@/components/HomeSelectedWork";
import { HomePreloads } from "@/components/HomePreloads";
import { HorseCorridorHero } from "@/components/HorseCorridorHero";

export default function Home() {
  return (
    <>
      <HomePreloads />

      <HorseCorridorHero />

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
