import Link from "next/link";
import { Container } from "@/components/ui/container";
const navigation = [
  { href: "/services", label: "Services" },
  { href: "/style-gallery", label: "Style gallery" },
  { href: "/custom-order", label: "Custom order" },
  { href: "/consultation", label: "Consultation" },
  { href: "/measurements", label: "Measurements" },
  { href: "/track-order", label: "Track order" },
];
type SiteHeaderProps = {
  user?: {
    firstName: string;
    roleName: string;
  } | null;
};
export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[#faf3eb]/85 backdrop-blur-xl">
      <Container className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f241f] text-sm font-semibold tracking-[0.25em] text-white">
              TC
            </div>
            <div>
              <p className="font-display text-2xl leading-none text-foreground">
                TailorCraft Studio
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                Custom tailoring platform
              </p>
            </div>
          </Link>
          <Link
            href="/consultation"
            className="inline-flex rounded-full border border-[#d6c3b6] bg-white px-4 py-2 text-sm font-semibold text-foreground lg:hidden"
          >
            Book now
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted hover:bg-white/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden rounded-full border border-[#d7c3b8] bg-white/80 px-4 py-2 text-sm text-muted lg:block">
                Signed in as <span className="font-semibold text-foreground">{user.firstName}</span>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(157,79,58,0.22)]"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-[#d7c3b8] bg-white px-5 py-2.5 text-sm font-semibold text-foreground lg:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(157,79,58,0.22)]"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
