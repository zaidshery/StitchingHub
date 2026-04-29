import { noContent, withApiHandler } from "@/lib/http/api-response";
import { clearSessionCookies } from "@/lib/auth/session";

export async function POST() {
  return withApiHandler(async () => {
    const response = noContent();
    clearSessionCookies(response);
    return response;
  });
}
