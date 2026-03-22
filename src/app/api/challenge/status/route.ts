import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/cohorts/challenge-status/`, {
      next: { revalidate: 30 },
    });
    const body: unknown = await res.json();
    return NextResponse.json(body, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "upstream_failed" },
      { status: 502 }
    );
  }
}
