export const AUTH_COOKIE_NAMES = {
  accessToken: "stitchinghub_access_token",
  refreshToken: "stitchinghub_refresh_token",
} as const;

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
