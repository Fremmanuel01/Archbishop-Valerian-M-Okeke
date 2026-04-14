import { Hero } from "@/components/home/hero";
import { DailyReflection } from "@/components/home/daily-reflection";
import { FeaturedLetter } from "@/components/home/featured-letter";
import { PastoralDiary } from "@/components/home/pastoral-diary";
import { PastoralMotion } from "@/components/home/pastoral-motion";
import { PullQuote } from "@/components/home/pull-quote";
import { SiteFooter } from "@/components/home/site-footer";

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />
        <DailyReflection />
        <FeaturedLetter />
        <PastoralDiary />
        <PastoralMotion />
        <PullQuote />
      </main>
      <SiteFooter />
    </>
  );
}
