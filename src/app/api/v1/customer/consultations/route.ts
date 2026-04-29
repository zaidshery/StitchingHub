import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { consultationCreateSchema } from "@/features/consultations/schemas";
import { consultationService } from "@/features/consultations/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    return ok(await consultationService.list(user.sub));
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, consultationCreateSchema);
    return created(await consultationService.create(user.sub, input));
  });
}
