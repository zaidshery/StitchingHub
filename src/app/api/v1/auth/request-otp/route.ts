import { ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { authService } from "@/features/auth/service";
import { otpRequestSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJson(request, otpRequestSchema);
    return ok(await authService.requestOtp(input));
  });
}
