import { NextRequest } from "next/server";
import { ok, withApiHandler } from "@/lib/http/api-response";
import {
  applySessionCookies,
  issueSessionTokens,
  readRefreshSession,
} from "@/lib/auth/session";
import { authService } from "@/features/auth/service";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const session = await readRefreshSession(request);
    const result = await authService.getSessionUserById(session.sub);
    const response = ok(result);
    applySessionCookies(response, await issueSessionTokens(result.user));
    return response;
  });
}
