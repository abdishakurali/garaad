import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.garaad.org/api/community/";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    const response = await fetch(`${API_BASE}posts/?${params}`, {
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
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const response = await fetch(`${API_BASE}posts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("External API error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
        requestBody: body,
      });
      return NextResponse.json(
        {
          ...errorData,
          details: {
            status: response.status,
            statusText: response.statusText,
            requestBody: body,
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
