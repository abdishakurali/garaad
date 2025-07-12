import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.garaad.org/api/community/";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Handle both "Bearer token" and "token" formats
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    const response = await fetch(`${API_BASE}campuses/${params.slug}/join/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error joining campus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
