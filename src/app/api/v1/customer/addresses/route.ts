import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { customerProfileService } from "@/features/customer/profile-service";
import { createAddressSchema } from "@/features/customer/schemas";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    return ok(await customerProfileService.listAddresses(user.sub));
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, createAddressSchema);
    return created(await customerProfileService.createAddress(user.sub, input));
  });
}
