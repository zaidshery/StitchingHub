"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/features/customer-app/format";

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
};

export function CustomOrderPlanner({ services }: CustomOrderPlannerProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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

  if (!selectedService) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)] sm:p-8">
        <label className="space-y-2 text-sm text-muted">
          <span>Garment service</span>
          <select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setSelectedOptions([]); }} className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-[1.75rem] border bg-[#fffaf6] p-5">
          <h3 className="font-display text-2xl">{selectedService.name}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{selectedService.shortDescription}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Optional add-ons</p>
          <div className="grid gap-3">
            {selectedService.options.map((option) => (
              <label key={option.id} className="flex items-start justify-between gap-4 rounded-2xl border bg-[#fffaf6] px-4 py-4 text-sm text-muted">
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
            <select className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
              <option>I have fabric</option>
              <option>I need fabric</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span>Measurement path</span>
            <select className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
              <option>Use saved measurements</option>
              <option>Submit measurements</option>
              <option>Book consultation</option>
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-5 rounded-[2rem] border bg-[#2d221d] p-6 text-white shadow-[0_24px_70px_rgba(55,34,23,0.16)] sm:p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">Estimate summary</p>
          <h3 className="mt-3 font-display text-4xl leading-tight">{formatCurrency(estimate, selectedService.currencyCode)}</h3>
          <p className="mt-3 text-sm leading-7 text-white/75">
            Booking amount starts at {formatCurrency(selectedService.bookingAmount, selectedService.currencyCode)}. Final pricing can shift with fabric, complexity, finishing, or consultation-led changes.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-5">
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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/consultation" className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#2d221d]">
            Book consultation
          </Link>
          <Link href="/signup" className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
