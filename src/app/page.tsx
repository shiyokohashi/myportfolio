import { AboutSection } from "@/components/AboutSection";
import { BottomScene } from "@/components/BottomScene";
import { SelectedWorksSection } from "@/components/SelectedWorksSection";
import { SiteFooter } from "@/components/SiteFooter";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <main className={cn("relative z-10 flex min-h-screen items-center justify-center py-16", PAGE_GUTTER)}>
        <div className="text-center">
          <h1 className="font-display text-4xl tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            Shiyo Ohashi
          </h1>
        </div>
      </main>

      <AboutSection />
      <SelectedWorksSection />
      <SiteFooter />
      <BottomScene />
    </>
  );
}
