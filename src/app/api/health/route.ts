import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "miso-phone-db",
    timestamp: new Date().toISOString(),
  });
}