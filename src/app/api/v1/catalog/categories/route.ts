import { ok, withApiHandler } from "@/lib/http/api-response";
import { catalogService } from "@/features/catalog/service";

export async function GET() {
  return withApiHandler(async () => ok(await catalogService.listCategories()));
}

