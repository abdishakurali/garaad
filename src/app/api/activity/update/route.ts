import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

const API_URL = API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    // Forward the request to the backend
    if (!API_URL) {
      console.error("API_URL is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(`${API_URL}/api/activity/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      // Safely parse error JSON
      const errorData = await response.json().catch(() => ({}));
      console.warn(`Upstream activity update failed: ${response.status}`, errorData);
      return NextResponse.json(
        { error: errorData.message || "Activity update failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Activity update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
