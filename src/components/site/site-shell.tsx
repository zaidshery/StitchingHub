import type { ReactNode } from "react";
import { getServerSessionUser } from "@/lib/auth/server-session";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
type SiteShellProps = {
  children: ReactNode;
};
export async function SiteShell({ children }: SiteShellProps) {
  const user = await getServerSessionUser();
  return (
    <>
      <SiteHeader user={user} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
