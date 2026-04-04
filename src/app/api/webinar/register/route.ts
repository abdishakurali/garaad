import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Proxies webinar signup to the Django API so the browser never calls the API
 * cross-origin (preview URLs like *.vercel.app are not on the API CORS allowlist).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const base = API_BASE_URL.replace(/\/$/, "");
    const response = await fetch(`${base}/api/webinar/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        data = { detail: text };
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (e) {
    console.error("webinar register proxy:", e);
    return NextResponse.json(
      { detail: "Is-diiwaangelinta lama dhammaystirin." },
      { status: 500 }
    );
  }
}
