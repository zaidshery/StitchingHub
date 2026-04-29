import { ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { applySessionCookies, issueSessionTokens } from "@/lib/auth/session";
import { authService } from "@/features/auth/service";
import { otpVerifySchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJson(request, otpVerifySchema);
    const result = await authService.verifyOtp(input);
    const response = ok(result);
    applySessionCookies(response, await issueSessionTokens(result.user));
    return response;
  });
}
