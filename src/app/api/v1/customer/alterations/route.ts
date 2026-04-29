import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { alterationRequestSchema } from "@/features/alterations/schemas";
import { alterationService } from "@/features/alterations/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    return ok(await alterationService.list(user.sub));
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, alterationRequestSchema);
    return created(await alterationService.create(user.sub, input));
  });
}
