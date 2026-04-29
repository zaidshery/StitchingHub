"use client";

import { useState, type FormEvent } from "react";
import { postJson } from "@/features/customer-app/api-client";

const measurementFields = [
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "shoulder", label: "Shoulder" },
  { key: "garment_length", label: "Garment length" },
  { key: "sleeve_length", label: "Sleeve length" },
];

type MeasurementProfileFormProps = {
  authenticated: boolean;
};

export function MeasurementProfileForm({ authenticated }: MeasurementProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authenticated) {
      setError("Please sign in first so the measurement profile can be saved to your account.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const values = measurementFields
      .map((field, index) => ({
        key: field.key,
        label: field.label,
        value: String(formData.get(field.key) ?? "").trim(),
        unit: "inch",
        sortOrder: index + 1,
      }))
      .filter((field) => field.value.length > 0);

    try {
      await postJson("/api/v1/customer/measurements", {
        name: formData.get("name"),
        garmentContext: formData.get("garmentContext") || undefined,
        isDefault: formData.get("isDefault") === "on",
        values,
      });
      event.currentTarget.reset();
      setSuccess("Measurement profile saved. You can now reuse it in future orders.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save measurement profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)] sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-muted">
          <span>Profile name</span>
          <input name="name" required placeholder="Classic blouse fit" className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Garment context</span>
          <input name="garmentContext" placeholder="Blouse, kurti, gown..." className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        {measurementFields.map((field) => (
          <label key={field.key} className="space-y-2 text-sm text-muted">
            <span>{field.label}</span>
            <input name={field.key} placeholder="inches" className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
          </label>
        ))}
      </div>

      <label className="flex items-center gap-3 rounded-2xl border bg-[#fffaf6] px-4 py-3 text-sm text-muted">
        <input name="isDefault" type="checkbox" className="h-4 w-4 rounded border-[#d7c3b8] text-accent focus:ring-accent" />
        Mark this as my default measurement profile
      </label>

      {!authenticated ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Sign in to save measurements and reuse them across future orders.
        </div>
      ) : null}
      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button type="submit" disabled={loading} className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Saving..." : "Save measurement profile"}
      </button>
    </form>
  );
}
