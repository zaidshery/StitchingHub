import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config/site";

export function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: siteConfig.name,
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
}
