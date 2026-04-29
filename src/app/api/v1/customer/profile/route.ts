import { NextRequest } from "next/server";
import { ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { customerProfileService } from "@/features/customer/profile-service";
import { updateProfileSchema } from "@/features/customer/schemas";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    return ok(await customerProfileService.getProfile(user.sub));
  });
}

export async function PATCH(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, updateProfileSchema);
    return ok(await customerProfileService.updateProfile(user.sub, input));
  });
}
