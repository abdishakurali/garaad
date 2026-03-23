import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";

/** Fail fast so pages (community, header CTAs) don’t hang on a dead/slow API. */
const UPSTREAM_TIMEOUT_MS = 4_000;

export async function GET() {
  const url = `${API_BASE}/api/cohorts/challenge-status/`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "upstream_invalid_json" },
        { status: 502 }
      );
    }
    return NextResponse.json(body, { status: res.ok ? 200 : res.status });
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        success: false,
        error: aborted ? "upstream_timeout" : "upstream_failed",
      },
      { status: aborted ? 504 : 502 }
    );
  }
}
