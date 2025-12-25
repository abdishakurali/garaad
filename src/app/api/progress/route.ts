import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

const API_URL = API_BASE_URL;

// Helper function to get auth token
async function getAuthToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Authorization header required");
  }
  return authHeader;
}

// GET /api/progress/ - Get user's progress data
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Forward request to backend
    const response = await fetch(`${API_URL}/api/progress/?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to fetch progress data",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Progress data error:", error);
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
