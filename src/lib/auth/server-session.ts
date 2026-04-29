import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES } from "@/lib/auth/constants";
import { verifyAccessToken, type SessionUserPayload } from "@/lib/auth/tokens";
export async function getServerSessionUser(): Promise<SessionUserPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value;
  if (!accessToken) {
    return null;
  }
  try {
    const payload = await verifyAccessToken(accessToken);
    return {
      sub: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roleName: payload.roleName,
    } satisfies SessionUserPayload;
  } catch {
    return null;
  }
}
