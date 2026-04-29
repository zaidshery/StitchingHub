import pino from "pino";

export const logger = pino({
  name: "stitchinghub-api",
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
});
