import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AuthForm } from "@/features/customer-app/auth/auth-form";

export const metadata: Metadata = {
  title: "Create Customer Account",
  description: "Create a customer account to book consultations, save measurements, and manage custom tailoring orders.",
};

export default function SignupPage() {
  return (
    <main className="pb-20 pt-10">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5 rounded-[2rem] border bg-[#2a211d] p-7 text-white shadow-[0_24px_70px_rgba(55,34,23,0.14)]">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">New customer</p>
          <h1 className="font-display text-5xl leading-tight">Set up your tailoring account.</h1>
          <p className="text-sm leading-7 text-white/80">
            Your account stores addresses, consultations, measurements, and tailoring order history so repeat bookings become faster and clearer.
          </p>
        </div>
        <AuthForm mode="signup" />
      </Container>
    </main>
  );
}
