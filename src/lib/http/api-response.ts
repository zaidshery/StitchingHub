import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isApiError } from "@/lib/http/api-error";
import { logger } from "@/lib/logger";

function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, candidate) => {
      if (typeof candidate === "bigint") {
        return candidate.toString();
      }

      return candidate;
    }),
  ) as T;
}

export function ok<T>(data: T, init?: ResponseInit, meta?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: true,
      data: serialize(data),
      ...(meta ? { meta } : {}),
    },
    init,
  );
}

export function created<T>(data: T, meta?: Record<string, unknown>) {
  return ok(data, { status: 201 }, meta);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function errorResponse(error: unknown) {
  if (isApiError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: serialize(error.details),
        },
      },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Input validation failed",
          details: error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  logger.error({ error }, "Unhandled API error");

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    },
    { status: 500 },
  );
}

export async function withApiHandler(
  handler: () => Promise<NextResponse> | NextResponse,
) {
  try {
    return await handler();
  } catch (error) {
    return errorResponse(error);
  }
}

export async function parseJson<T>(
  request: Request,
  schema: { parseAsync: (data: unknown) => Promise<T> },
) {
  const body = await request.json();
  return schema.parseAsync(body);
}

