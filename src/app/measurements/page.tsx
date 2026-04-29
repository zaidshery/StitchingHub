import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { measurementChecklist } from "@/features/customer-app/content";
import { getDashboardSnapshot } from "@/features/customer-app/data";
import { MeasurementProfileForm } from "@/features/customer-app/measurements/measurement-profile-form";
import { formatDate, formatStatus } from "@/features/customer-app/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Measurement Profiles",
  description: "Save, review, and reuse garment measurement profiles across your custom tailoring orders.",
};

export default async function MeasurementsPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <main className="pb-20 pt-10">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Measurements"
            title="Save fit details once and reuse them with confidence."
            description="Measurement profiles reduce repeat friction and make future blouse, kurti, lehenga, or dress orders much faster to prepare."
          />

          <div className="rounded-[2rem] border bg-[#2a211d] p-7 text-white shadow-[0_24px_70px_rgba(55,34,23,0.14)]">
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">Measurement checklist</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-white/80">
              {measurementChecklist.map((tip) => (
                <p key={tip}>{tip}</p>
              ))}
            </div>
            {!snapshot.authenticated ? (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/8 p-4 text-sm text-white/82">
                Create an account or sign in to save profiles to your customer record. <Link href="/login" className="font-semibold text-white">Sign in</Link>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 rounded-[2rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <h2 className="font-display text-3xl">Saved profiles</h2>
            {snapshot.measurements.length ? (
              snapshot.measurements.map((profile) => (
                <div key={profile.id} className="rounded-[1.6rem] border bg-[#fffaf6] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{profile.name}</p>
                      <p className="text-sm text-muted">
                        {profile.garmentContext ?? "General profile"} · {formatStatus(profile.status)}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      {profile.isDefault ? "Default" : "Saved"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.values.map((value) => (
                      <span key={value.id} className="rounded-full border bg-white px-3 py-1 text-xs text-muted">
                        {value.label}: {value.value} {value.unit}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">
                    Updated {formatDate(profile.updatedAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.6rem] border border-dashed bg-[#fffaf6] p-5 text-sm leading-7 text-muted">
                No measurement profiles are saved yet. Use the form to create your first reusable fit profile.
              </div>
            )}
          </div>
        </div>

        <MeasurementProfileForm authenticated={snapshot.authenticated} />
      </Container>
    </main>
  );
}
