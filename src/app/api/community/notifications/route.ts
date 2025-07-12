import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.garaad.org/api/community/";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    const response = await fetch(`${API_BASE}notifications/?${params}`, {
      headers: {
        Authorization: token,
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
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
