import { SectionLabel, Latin } from "@/components/editorial";
import { getPastoralVideos } from "@/lib/videos";
import { VideoGrid } from "./video-grid";

export async function PastoralMotion() {
  const videos = await getPastoralVideos();
  if (videos.length === 0) return null;

  return (
    <section
      id="motion"
      aria-labelledby="motion-title"
      className="bg-bone px-14 py-[140px] max-lg:px-8 max-md:px-6 max-md:py-24"
    >
      <div className="mx-auto max-w-[1240px]">
        <SectionLabel>
          <Latin>In Actu Pastorali</Latin>
        </SectionLabel>
        <h2
          id="motion-title"
          className="mb-4 mt-6 font-[family-name:var(--font-display)] text-[clamp(40px,4.5vw,72px)] font-medium leading-[1.05] tracking-[-0.015em]"
        >
          Pastoral Activities in <em className="italic text-gold">Motion</em>
        </h2>
        <p className="max-w-[680px] font-[family-name:var(--font-display)] text-[22px] italic leading-[1.55] text-ink-soft">
          Selected homilies, pastoral visits, and sacred liturgies, recorded
          as they unfolded across the Archdiocese.
        </p>

        <VideoGrid videos={videos} />
      </div>
    </section>
  );
}
