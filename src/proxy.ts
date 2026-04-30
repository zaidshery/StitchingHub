import { NextResponse, type NextRequest } from "next/server";

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS = [
  { pattern: /^\/api\/v1\/auth\/(login|register|request-otp|verify-otp)/, limit: 10, windowMs: 60_000 },
  { pattern: /^\/api\/v1\/payments\/verify/, limit: 20, windowMs: 60_000 },
  { pattern: /^\/api\/v1\/webhooks\//, limit: 120, windowMs: 60_000 },
  { pattern: /^\/api\//, limit: 240, windowMs: 60_000 },
];

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip");
  return forwardedFor || realIp || "local";
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

function checkRateLimit(request: NextRequest) {
  const rule = RATE_LIMITS.find((candidate) => candidate.pattern.test(request.nextUrl.pathname));
  if (!rule) {
    return null;
  }

  const now = Date.now();
  const key = `${getClientKey(request)}:${rule.pattern.source}`;
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + rule.windowMs });
    return null;
  }

  bucket.count += 1;

  if (bucket.count <= rule.limit) {
    return null;
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please wait before trying again.",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.ceil((bucket.resetAt - now) / 1000).toString(),
      },
    },
  );
}

export function proxy(request: NextRequest) {
  const rateLimitedResponse = checkRateLimit(request);
  if (rateLimitedResponse) {
    return applySecurityHeaders(rateLimitedResponse);
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
