"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import type { customerProfileService } from "@/features/customer/profile-service";
import type { measurementService } from "@/features/measurements/service";
import { formatCurrency } from "@/features/customer-app/format";
import { postJson } from "@/features/customer-app/api-client";

type PlannerService = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  startingPrice: number;
  bookingAmount: number;
  currencyCode: string;
  options: Array<{
    id: string;
    name: string;
    optionType: string;
    priceDelta: number;
  }>;
  styleTemplates: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
};

type CustomOrderPlannerProps = {
  services: PlannerService[];
  authenticated: boolean;
  addresses: Awaited<ReturnType<typeof customerProfileService.listAddresses>>;
  measurements: Awaited<ReturnType<typeof measurementService.list>>;
  degraded?: boolean;
};

type CreatedAddress = {
  id: string;
};

type CreatedOrder = {
  order: {
    orderNumber: string;
  };
};

export function CustomOrderPlanner({
  services,
  authenticated,
  addresses,
  measurements,
  degraded,
}: CustomOrderPlannerProps) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [addressMode, setAddressMode] = useState(addresses.length ? "existing" : "new");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) ?? services[0],
    [serviceId, services],
  );

  const estimate = useMemo(() => {
    if (!selectedService) {
      return 0;
    }

    return selectedService.startingPrice + selectedOptions.reduce((sum, optionId) => {
      const option = selectedService.options.find((candidate) => candidate.id === optionId);
      return sum + (option?.priceDelta ?? 0);
    }, 0);
  }, [selectedOptions, selectedService]);

  function toggleOption(optionId: string) {
    setSelectedOptions((current) =>
      current.includes(optionId)
        ? current.filter((candidate) => candidate !== optionId)
        : [...current, optionId],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authenticated) {
      setError("Please sign in or create an account before placing a custom order.");
      return;
    }

    if (degraded) {
      setError("Live catalog or account data is unavailable, so checkout is paused for this local session.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    let addressId = String(formData.get("addressId") ?? "");

    try {
      if (addressMode === "new" || !addressId) {
        const address = await postJson<CreatedAddress>("/api/v1/customer/addresses", {
          label: formData.get("label"),
          recipientName: formData.get("recipientName"),
          phone: formData.get("phone"),
          line1: formData.get("line1"),
          line2: formData.get("line2") || undefined,
          city: formData.get("city"),
          state: formData.get("state"),
          postalCode: formData.get("postalCode"),
          country: formData.get("country") || "India",
          isDefault: formData.get("isDefault") === "on",
        });
        addressId = address.id;
      }

      const created = await postJson<CreatedOrder>("/api/v1/customer/orders", {
        addressId,
        billingAddressId: addressId,
        pickupAddressId: formData.get("fabricSourceType") === "CUSTOMER_PROVIDED" ? addressId : undefined,
        fabricSourceType: formData.get("fabricSourceType"),
        paymentMode: formData.get("paymentMode"),
        items: [
          {
            serviceId,
            quantity: 1,
            selectedOptions,
            styleTemplateId: formData.get("styleTemplateId") || undefined,
            measurementProfileId: formData.get("measurementProfileId") || undefined,
            customNotes: formData.get("customNotes") || undefined,
            referenceUploads: [],
          },
        ],
      });

      setSuccess(`Order ${created.order.orderNumber} created. Opening the tracking page.`);
      router.push(`/orders/${created.order.orderNumber}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create the order.");
    } finally {
      setLoading(false);
    }
  }

  if (!selectedService) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5 rounded-lg border bg-white/85 p-5 shadow-[0_18px_45px_rgba(55,34,23,0.08)] sm:p-6">
        <label className="space-y-2 text-sm text-muted">
          <span>Garment service</span>
          <select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setSelectedOptions([]); }} className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-lg border bg-[#fffaf6] p-5">
          <h3 className="font-display text-2xl">{selectedService.name}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{selectedService.shortDescription}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Optional add-ons</p>
          <div className="grid gap-3">
            {selectedService.options.map((option) => (
              <label key={option.id} className="flex items-start justify-between gap-4 rounded-lg border bg-[#fffaf6] px-4 py-4 text-sm text-muted">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{option.name}</p>
                  <p>{option.optionType.replaceAll("_", " ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">+ {formatCurrency(option.priceDelta, selectedService.currencyCode)}</span>
                  <input type="checkbox" checked={selectedOptions.includes(option.id)} onChange={() => toggleOption(option.id)} className="h-4 w-4 rounded border-[#d7c3b8] text-accent focus:ring-accent" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span>Fabric flow</span>
            <select name="fabricSourceType" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
              <option value="CUSTOMER_PROVIDED">I have fabric</option>
              <option value="PLATFORM_ASSISTED">I need fabric</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span>Measurement path</span>
            <select name="measurementProfileId" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
              <option value="">Add measurements later</option>
              {measurements.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span>Style reference</span>
            <select name="styleTemplateId" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
              <option value="">No style selected</option>
              {selectedService.styleTemplates.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span>Payment mode</span>
            <select name="paymentMode" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
              <option value="BOOKING_AMOUNT">Pay booking amount</option>
              <option value="FULL_AMOUNT">Pay full amount</option>
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm text-muted">
          <span>Design notes</span>
          <textarea name="customNotes" rows={4} placeholder="Mention neckline, sleeve, fit, occasion, fabric notes, or urgency." className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>

        <div className="space-y-4 rounded-lg border bg-[#fffaf6] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Delivery address</p>
            {addresses.length ? (
              <div className="flex rounded-lg border bg-white p-1 text-xs font-semibold">
                <button type="button" onClick={() => setAddressMode("existing")} className={`rounded-md px-3 py-1.5 ${addressMode === "existing" ? "bg-accent text-white" : "text-muted"}`}>
                  Saved
                </button>
                <button type="button" onClick={() => setAddressMode("new")} className={`rounded-md px-3 py-1.5 ${addressMode === "new" ? "bg-accent text-white" : "text-muted"}`}>
                  New
                </button>
              </div>
            ) : null}
          </div>

          {addressMode === "existing" && addresses.length ? (
            <select name="addressId" className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent">
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.label} - {address.line1}, {address.city} {address.postalCode}
                </option>
              ))}
            </select>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-muted">
                <span>Label</span>
                <input name="label" placeholder="Home" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span>Recipient</span>
                <input name="recipientName" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span>Phone</span>
                <input name="phone" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span>Postal code</span>
                <input name="postalCode" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted sm:col-span-2">
                <span>Address line 1</span>
                <input name="line1" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted sm:col-span-2">
                <span>Address line 2</span>
                <input name="line2" className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span>City</span>
                <input name="city" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span>State</span>
                <input name="state" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="space-y-2 text-sm text-muted">
                <span>Country</span>
                <input name="country" defaultValue="India" required={addressMode === "new"} className="w-full rounded-lg border bg-white px-4 py-3 text-foreground outline-none focus:border-accent" />
              </label>
              <label className="flex items-center gap-3 self-end rounded-lg border bg-white px-4 py-3 text-sm text-muted">
                <input name="isDefault" type="checkbox" className="h-4 w-4 rounded border-[#d7c3b8] text-accent focus:ring-accent" />
                Save as default
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5 rounded-lg border bg-[#2d221d] p-5 text-white shadow-[0_18px_45px_rgba(55,34,23,0.16)] sm:p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">Estimate summary</p>
          <h3 className="mt-3 font-display text-4xl leading-tight">{formatCurrency(estimate, selectedService.currencyCode)}</h3>
          <p className="mt-3 text-sm leading-7 text-white/75">
            Booking amount starts at {formatCurrency(selectedService.bookingAmount, selectedService.currencyCode)}. Final pricing can shift with fabric, complexity, finishing, or consultation-led changes.
          </p>
        </div>

        <div className="rounded-lg border border-white/15 bg-white/8 p-5">
          <p className="text-sm uppercase tracking-[0.22em] text-white/60">Style direction</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/80">
            {selectedService.styleTemplates.map((style) => (
              <div key={style.id}>
                <p className="font-semibold text-white">{style.name}</p>
                <p>{style.description ?? "Reference-ready styling concept for this service."}</p>
              </div>
            ))}
          </div>
        </div>

        {!authenticated ? (
          <div className="rounded-lg border border-white/15 bg-white/8 px-4 py-3 text-sm leading-6 text-white/75">
            Sign in to place a custom order. You can still use the planner for estimates.
          </div>
        ) : null}
        {degraded ? (
          <div className="rounded-lg border border-amber-200/30 bg-amber-200/10 px-4 py-3 text-sm leading-6 text-amber-50">
            Live checkout data is unavailable in this session. Estimate mode remains available.
          </div>
        ) : null}
        {success ? <div className="rounded-lg border border-emerald-200/30 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-50">{success}</div> : null}
        {error ? <div className="rounded-lg border border-rose-200/30 bg-rose-200/10 px-4 py-3 text-sm text-rose-50">{error}</div> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={!authenticated || loading || Boolean(degraded)} className="inline-flex flex-1 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#2d221d] disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating..." : "Create order"}
          </button>
          <Link href={authenticated ? "/consultation" : "/signup"} className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white">
            {authenticated ? "Book consultation" : "Create account"}
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/measurements" className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white">
            Measurements
          </Link>
          <Link href="/support" className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white">
            Support
          </Link>
        </div>
      </div>
    </form>
  );
}
