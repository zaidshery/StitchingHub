import { jwtVerify, SignJWT } from "jose";
import { env } from "@/lib/env";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/lib/auth/constants";

export type SessionTokenType = "access" | "refresh";

export type SessionUserPayload = {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
};

type SessionTokenPayload = SessionUserPayload & {
  tokenType: SessionTokenType;
};

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

async function signToken(
  payload: SessionUserPayload,
  tokenType: SessionTokenType,
  ttlSeconds: number,
  secret: Uint8Array,
) {
  return new SignJWT({ ...payload, tokenType })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secret);
}

export async function createAccessToken(payload: SessionUserPayload) {
  return signToken(payload, "access", ACCESS_TOKEN_TTL_SECONDS, accessSecret);
}

export async function createRefreshToken(payload: SessionUserPayload) {
  return signToken(payload, "refresh", REFRESH_TOKEN_TTL_SECONDS, refreshSecret);
}

async function verifyToken(token: string, secret: Uint8Array, expectedType: SessionTokenType) {
  const verified = await jwtVerify<SessionTokenPayload>(token, secret);
  if (verified.payload.tokenType !== expectedType) {
    throw new Error("Invalid token type");
  }

  return verified.payload;
}

export async function verifyAccessToken(token: string) {
  return verifyToken(token, accessSecret, "access");
}

export async function verifyRefreshToken(token: string) {
  return verifyToken(token, refreshSecret, "refresh");
}
