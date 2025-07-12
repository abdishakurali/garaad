import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    message: "API is working correctly",
  });
}

export async function POST() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    message: "POST method is working correctly",
  });
}
