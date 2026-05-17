import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const mediaPath = path.join("/");

    // Read the httpOnly cookie server-side to authenticate backend requests
    const cookieStore = await cookies();
    const accessToken =
      cookieStore.get("accessToken")?.value ||
      request.cookies.get("accessToken")?.value;

    const headers: Record<string, string> = {
      "User-Agent": request.headers.get("user-agent") || "",
      Accept: "image/*,*/*",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const possibleUrls = [
      `${API_BASE_URL}/api/media/${mediaPath}`,
      `${API_BASE_URL}/media/${mediaPath}`,
      `${API_BASE_URL}/api/auth/serve-media/${mediaPath}`,
    ];

    for (const url of possibleUrls) {
      try {
        const response = await fetch(url, { method: "GET", headers });

        if (response.ok) {
          const contentType = response.headers.get("content-type") || "application/octet-stream";
          const fileBuffer = await response.arrayBuffer();
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      } catch {
        // Try next URL
      }
    }

    return NextResponse.json({ error: "Media file not found" }, { status: 404 });
  } catch (error) {
    console.error("Error serving media file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
