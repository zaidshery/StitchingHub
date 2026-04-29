import { created, parseJson, withApiHandler } from "@/lib/http/api-response";
import { applySessionCookies, issueSessionTokens } from "@/lib/auth/session";
import { authService } from "@/features/auth/service";
import { registerSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJson(request, registerSchema);
    const result = await authService.registerCustomer(input);
    const response = created(result);
    applySessionCookies(response, await issueSessionTokens(result.user));
    return response;
  });
}
