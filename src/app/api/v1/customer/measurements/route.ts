import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { measurementProfileSchema } from "@/features/measurements/schemas";
import { measurementService } from "@/features/measurements/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    return ok(await measurementService.list(user.sub));
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, measurementProfileSchema);
    return created(await measurementService.create(user.sub, input));
  });
}
