import { NextRequest } from "next/server";
import { ok, withApiHandler } from "@/lib/http/api-response";
import { catalogService } from "@/features/catalog/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const filters = {
      category: request.nextUrl.searchParams.get("category"),
      featured: request.nextUrl.searchParams.get("featured") === "true",
      search: request.nextUrl.searchParams.get("search"),
    };

    return ok(await catalogService.listServices(filters));
  });
}
