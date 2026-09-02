import { HomeIntro } from "@/components/HomeIntro";
import { HomeDesktop } from "@/components/HomeDesktop";

export default function Home() {
  return (
    <>
      <HomeDesktop />
      <HomeIntro layout="desktop" />
    </>
  );
}
