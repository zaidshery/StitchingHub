import { ok, withApiHandler } from "@/lib/http/api-response";
import { ApiError } from "@/lib/http/api-error";
import { catalogService } from "@/features/catalog/service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  return withApiHandler(async () => {
    const { slug } = await context.params;
    const service = await catalogService.getServiceBySlug(slug);
    if (!service) {
      throw new ApiError(404, "SERVICE_NOT_FOUND", "Service was not found");
    }

    return ok(service);
  });
}
