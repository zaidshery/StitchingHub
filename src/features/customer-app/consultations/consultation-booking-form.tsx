"use client";

import { useState, type FormEvent } from "react";
import { postJson } from "@/features/customer-app/api-client";

type ConsultationBookingFormProps = {
  authenticated: boolean;
  services: Array<{ id: string; name: string }>;
  channels: Array<{ value: string; label: string }>;
};

export function ConsultationBookingForm({
  authenticated,
  services,
  channels,
}: ConsultationBookingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authenticated) {
      setError("Please sign in first so your consultation is linked to your account.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await postJson("/api/v1/customer/consultations", {
        serviceId: formData.get("serviceId") || undefined,
        preferredDate: formData.get("preferredDate"),
        preferredTimeSlot: formData.get("preferredTimeSlot"),
        channel: formData.get("channel"),
        notes: formData.get("notes") || undefined,
      });
      event.currentTarget.reset();
      setSuccess("Consultation booked. The request has been added to your account timeline.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to book consultation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)] sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Service</span>
          <select name="serviceId" className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            <option value="">Choose later during consultation</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Preferred date</span>
          <input name="preferredDate" type="date" required className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Preferred time slot</span>
          <input name="preferredTimeSlot" placeholder="e.g. 18:00-19:00" required className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Consultation channel</span>
          <select name="channel" defaultValue="VIDEO" className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            {channels.map((channel) => (
              <option key={channel.value} value={channel.value}>
                {channel.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Notes</span>
          <textarea name="notes" rows={5} placeholder="Share occasion, design direction, or any fit concerns." className="w-full rounded-[1.5rem] border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
      </div>

      {!authenticated ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Sign in to attach the consultation to your dashboard and receive updates.
        </div>
      ) : null}
      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button type="submit" disabled={loading} className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Submitting..." : "Book consultation"}
      </button>
    </form>
  );
}
