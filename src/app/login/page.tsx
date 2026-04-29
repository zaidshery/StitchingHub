import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AuthForm } from "@/features/customer-app/auth/auth-form";

export const metadata: Metadata = {
  title: "Customer Sign In",
  description: "Sign in to view orders, save measurement profiles, and manage consultations.",
};

export default function LoginPage() {
  return (
    <main className="pb-20 pt-10">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5 rounded-[2rem] border bg-[#2a211d] p-7 text-white shadow-[0_24px_70px_rgba(55,34,23,0.14)]">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Welcome back</p>
          <h1 className="font-display text-5xl leading-tight">Continue your tailoring journey.</h1>
          <p className="text-sm leading-7 text-white/80">
            Sign in to track orders, save measurements, review consultations, and request alterations against delivered garments.
          </p>
        </div>
        <AuthForm mode="login" />
      </Container>
    </main>
  );
}
