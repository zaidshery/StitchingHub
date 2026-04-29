import type { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/http/api-error";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTH_COOKIE_NAMES,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/lib/auth/constants";
import {
  createAccessToken,
  createRefreshToken,
  type SessionUserPayload,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth/tokens";

export type AuthenticatedUser = SessionUserPayload;

export async function issueSessionTokens(user: SessionUserPayload) {
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(user),
    createRefreshToken(user),
  ]);

  return { accessToken, refreshToken };
}

function readBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.replace("Bearer ", "").trim();
}

export async function getAuthenticatedUser(request: NextRequest) {
  const accessToken =
    request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? readBearerToken(request);

  if (!accessToken) {
    return null;
  }

  const payload = await verifyAccessToken(accessToken);

  return {
    sub: payload.sub,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    roleName: payload.roleName,
  } satisfies AuthenticatedUser;
}

export async function requireAuthenticatedUser(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication is required");
  }

  return user;
}

export async function readRefreshSession(request: NextRequest) {
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value;
  if (!refreshToken) {
    throw new ApiError(401, "INVALID_REFRESH_TOKEN", "Refresh token is missing");
  }

  const payload = await verifyRefreshToken(refreshToken);

  return {
    sub: payload.sub,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    roleName: payload.roleName,
  } satisfies AuthenticatedUser;
}

export function applySessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });

  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
