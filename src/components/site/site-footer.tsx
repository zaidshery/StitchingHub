import Link from "next/link";
import { Container } from "@/components/ui/container";
const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/style-gallery", label: "Style gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/policies", label: "Policies" },
  { href: "/track-order", label: "Track order" },
];
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/50 bg-[#2d221d] text-white">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-white/60">
            TailorCraft Studio
          </p>
          <h2 className="font-display text-4xl leading-tight">
            Premium made-to-measure fashion, handled with studio-grade clarity.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-white/72">
            Custom blouse, kurti, lehenga, and occasionwear tailoring with design
            consultation, measurement support, production tracking, and alteration
            care built into one workflow.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/80">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">
              Contact windows
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/80">
              <p>Mon to Sat, 10:00 AM to 8:00 PM</p>
              <p>Studio consultations, video calls, and managed pickup support.</p>
              <p>hello@tailorcraftstudio.local</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
