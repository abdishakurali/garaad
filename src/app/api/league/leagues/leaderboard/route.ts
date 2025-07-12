import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get auth token
async function getAuthToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Authorization header required");
  }
  return authHeader;
}

// GET /api/league/leagues/leaderboard/ - Get league leaderboard
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Forward request to backend
    const response = await fetch(
      `${API_URL}/api/league/leagues/leaderboard/?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to fetch leaderboard",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
