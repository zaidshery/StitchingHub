import type { ReactNode } from "react";
import { getServerSessionUser } from "@/lib/auth/server-session";
import { SiteFooter } from "@/components/site/site-footer";
import { BottomNavigation, SiteHeader } from "@/components/site/site-header";
type SiteShellProps = {
  children: ReactNode;
};
export async function SiteShell({ children }: SiteShellProps) {
  const user = await getServerSessionUser();
  return (
    <>
      <SiteHeader user={user} />
      <div className="flex-1 pb-20 lg:pb-0">{children}</div>
      <SiteFooter />
      <BottomNavigation user={user} />
    </>
  );
}
