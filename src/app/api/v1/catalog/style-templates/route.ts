import { NextRequest } from "next/server";
import { ok, withApiHandler } from "@/lib/http/api-response";
import { catalogService } from "@/features/catalog/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () =>
    ok(await catalogService.listStyleTemplates(request.nextUrl.searchParams.get("service"))),
  );
}
