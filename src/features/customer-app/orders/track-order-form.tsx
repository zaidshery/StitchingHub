"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function TrackOrderForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!orderNumber.trim()) {
      return;
    }

    router.push(`/orders/${orderNumber.trim()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-[2rem] border bg-white/85 p-5 shadow-[0_24px_70px_rgba(55,34,23,0.08)] sm:flex-row sm:items-center sm:p-6">
      <input
        value={orderNumber}
        onChange={(event) => setOrderNumber(event.target.value)}
        placeholder="Enter order number, for example TCS-1001"
        className="min-w-0 flex-1 rounded-full border bg-[#fffaf6] px-5 py-3 text-sm text-foreground outline-none focus:border-accent"
      />
      <button type="submit" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
        Track order
      </button>
    </form>
  );
}