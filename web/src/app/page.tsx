import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { DailyReflection } from "@/components/home/daily-reflection";
import { FeaturedLetter } from "@/components/home/featured-letter";
import { PastoralDiary } from "@/components/home/pastoral-diary";
import { PastoralMotion } from "@/components/home/pastoral-motion";
import { PullQuote } from "@/components/home/pull-quote";
import { SiteFooter } from "@/components/home/site-footer";

export const metadata: Metadata = {
  title: "Most Rev. Valerian M. Okeke — Metropolitan Archbishop of Onitsha",
  description:
    "The pastoral letters, homilies, reflections, and ministry of His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha.",
  openGraph: {
    title: "Most Rev. Valerian M. Okeke — Metropolitan Archbishop of Onitsha",
    description:
      "The pastoral letters, homilies, reflections, and ministry of His Grace Most Rev. Valerian Maduka Okeke.",
    type: "website",
  },
};

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
