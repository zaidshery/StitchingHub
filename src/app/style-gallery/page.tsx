import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalogOverview } from "@/features/customer-app/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Style Gallery",
  description: "Browse custom tailoring reference looks for blouses, kurtis, lehengas, gowns, and alterations.",
};

export default async function StyleGalleryPage() {
  const catalog = await getCatalogOverview();

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Style gallery"
          title="Reference looks to guide your custom order conversation."
          description="Use these direction cards to shortlist silhouettes, neckline ideas, and garment moods before consultation or order planning."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {catalog.styleTemplates.map((style, index) => (
            <div key={style.id} className="overflow-hidden rounded-[2rem] border bg-white/80 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
              <div className="flex aspect-[4/5] items-end bg-[linear-gradient(180deg,rgba(242,229,218,0.8),rgba(198,158,140,0.96))] p-5">
                <div className="rounded-[1.3rem] bg-white/88 px-4 py-3 text-sm font-medium text-foreground shadow-sm">
                  Look {index + 1}
                </div>
              </div>
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">{style.serviceName}</p>
                <h2 className="font-display text-3xl leading-tight">{style.name}</h2>
                <p className="text-sm leading-7 text-muted">
                  {style.description ?? "Tailoring reference for fit, detailing, and occasion styling."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {style.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/services/${style.serviceSlug}`} className="inline-flex rounded-full border bg-white px-4 py-2 text-sm font-semibold text-foreground">
                  View service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
