"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { postJson } from "@/features/customer-app/api-client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await postJson(mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register", payload);
      setSuccess(mode === "login" ? "Signed in successfully." : "Account created successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong while submitting the form.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)] sm:p-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted">
          {mode === "login" ? "Customer sign in" : "Customer registration"}
        </p>
        <h1 className="font-display text-4xl leading-tight">
          {mode === "login" ? "Return to your tailoring dashboard." : "Create your tailoring account."}
        </h1>
      </div>

      {mode === "signup" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span>First name</span>
            <input name="firstName" required className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span>Last name</span>
            <input name="lastName" required className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
          </label>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Email</span>
          <input name="email" type="email" required className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        {mode === "signup" ? (
          <label className="space-y-2 text-sm text-muted sm:col-span-2">
            <span>Phone</span>
            <input name="phone" required className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
          </label>
        ) : null}
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Password</span>
          <input name="password" type="password" required minLength={8} className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
      </div>

      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(157,79,58,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting..." : mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="text-sm text-muted">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-accent">
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
