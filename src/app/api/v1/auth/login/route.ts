import { ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { applySessionCookies, issueSessionTokens } from "@/lib/auth/session";
import { authService } from "@/features/auth/service";
import { loginSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJson(request, loginSchema);
    const result = await authService.loginWithPassword(input);
    const response = ok(result);
    applySessionCookies(response, await issueSessionTokens(result.user));
    return response;
  });
}
