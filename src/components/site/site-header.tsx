import Link from "next/link";
import { BrandLogo } from "@/components/site/brand-logo";
import { siteConfig } from "@/lib/config/site";

const mobileCategoryLinks = ["Blouse", "Dress", "Kurti", "Lehenga", "Salwar Suit", "Ready-to-wear Saree", "Skirt", "Top", "Alterations"];

type SiteHeaderProps = {
  user?: {
    firstName: string;
    roleName: string;
  } | null;
};

function BagIcon() {
  return (
    <span className="relative h-7 w-6 rounded-b-md border-[2.5px] border-current">
      <span className="absolute -top-3 left-1/2 h-4 w-3 -translate-x-1/2 rounded-t-full border-[2.5px] border-b-0 border-current" />
    </span>
  );
}

function StoreIcon() {
  return (
    <span className="relative h-8 w-8">
      <span className="absolute inset-x-1 top-1 h-3 rounded-t-md border-2 border-current" />
      <span className="absolute bottom-1 left-1 h-5 w-6 rounded-b-md border-2 border-current" />
      <span className="absolute bottom-0 right-0 grid h-4 w-4 place-items-center rounded-full border-2 border-current bg-white text-[9px] font-bold">
        o
      </span>
    </span>
  );
}

function AccountIcon() {
  return (
    <span className="relative h-8 w-8">
      <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-current" />
      <span className="absolute bottom-0 left-1/2 h-5 w-7 -translate-x-1/2 rounded-t-full border-2 border-current" />
    </span>
  );
}

function PhoneIcon() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full border-[2.5px] border-current text-xl font-semibold leading-none">
      &#9742;
    </span>
  );
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const dashboardHref = user?.roleName === "CUSTOMER" ? "/dashboard" : "/admin/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7dfd4] bg-white/95 shadow-[0_10px_30px_rgba(33,29,26,0.04)] backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:hidden">
        <details className="group relative">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-lg text-[#4b2774] marker:hidden hover:bg-[#f6f0ec]">
            <span className="sr-only">Open categories</span>
            <span className="flex w-7 flex-col gap-1.5">
              <span className="h-0.5 rounded bg-current" />
              <span className="h-0.5 rounded bg-current" />
              <span className="h-0.5 rounded bg-current" />
            </span>
          </summary>
          <div className="absolute left-0 top-14 w-[min(82vw,320px)] rounded-lg border border-[#e7dfd4] bg-white p-3 shadow-[0_18px_48px_rgba(33,29,26,0.14)]">
            <p className="px-2 pb-2 text-sm font-bold text-foreground">Women</p>
            <div className="grid gap-2">
              {mobileCategoryLinks.map((link) => (
                <Link
                  key={link}
                  href="/services"
                  className="rounded-md px-3 py-2 text-sm font-semibold text-[#5f5349] hover:bg-[#f6f0ec] hover:text-accent"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </details>

        <Link href="/" className="flex min-w-0 items-center justify-center gap-3">
          <BrandLogo />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-xl font-bold uppercase leading-none tracking-[0.12em] text-[#c6b46c]">
              {siteConfig.name}
            </span>
            <span className="mt-1 block truncate text-xs uppercase tracking-[0.2em] text-[#7a6d58]">
              Custom stitching
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/track-order"
            aria-label="Orders"
            className="grid h-11 w-11 place-items-center rounded-lg text-foreground hover:bg-[#f6f0ec]"
          >
            <BagIcon />
          </Link>
          <Link
            href="/support"
            aria-label="WhatsApp support"
            className="grid h-11 w-11 place-items-center rounded-lg text-foreground hover:bg-[#f6f0ec]"
          >
            <PhoneIcon />
          </Link>
        </div>
      </div>

      <div className="mx-auto hidden h-[72px] max-w-7xl items-center justify-between gap-6 px-6 lg:flex xl:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <BrandLogo />
          <span className="min-w-0">
            <span className="block truncate text-[16px] font-bold uppercase leading-none tracking-[0.08em] text-[#b5a15a] xl:text-[17px]">
              {siteConfig.name}
            </span>
            <span className="mt-1 block truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a6d58]">
              Custom stitching
            </span>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-2">
          {user ? (
            <Link href={dashboardHref} className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(157,79,58,0.18)] hover:bg-[#874331]">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="rounded-md border border-[#ded3c8] bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-[#fbf8f4]">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(157,79,58,0.18)] hover:bg-[#874331]">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNavigation({ user }: SiteHeaderProps) {
  const accountHref = user ? (user.roleName === "CUSTOMER" ? "/dashboard" : "/admin/dashboard") : "/login";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7dfd4] bg-white shadow-[0_-10px_30px_rgba(33,29,26,0.08)] lg:hidden">
      <div className="grid h-20 grid-cols-5">
        <Link href="/" className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-foreground">
          <BrandLogo size="sm" showLabel={false} />
          Home
        </Link>
        <Link href="/track-order" className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-foreground">
          <span className="relative h-8 w-8">
            <span className="absolute left-1 top-2 h-5 w-6 rotate-[-25deg] rounded-sm border-2 border-current" />
            <span className="absolute left-3 top-0 h-6 w-5 rotate-[25deg] rounded-sm border-2 border-current bg-white" />
          </span>
          Orders
        </Link>
        <Link href="/consultation" className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-foreground">
          <PhoneIcon />
          Call us now!
        </Link>
        <Link href="/services" className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-foreground">
          <StoreIcon />
          Find our store
        </Link>
        <Link href={accountHref} className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-foreground">
          <AccountIcon />
          Account
        </Link>
      </div>
    </nav>
  );
}
