import { NextRequest, NextResponse } from "next/server";

const GARAAD_API_BASE = process.env.GARAAD_API_BASE || "https://api.garaad.org";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    // Get auth token from request headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    // Proxy request to external API
    const response = await fetch(
      `${GARAAD_API_BASE}/api/community/trending/tags/?period=${period}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Failed to fetch trending tags",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
