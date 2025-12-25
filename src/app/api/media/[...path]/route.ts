import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants";

// Use the same base URL as other services
const API_URL = API_BASE_URL;
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const mediaPath = path.join("/");

    // Get authorization from cookies
    const cookieStore = await cookies();
    const accessToken =
      cookieStore.get("accessToken")?.value ||
      request.cookies.get("accessToken")?.value;

    // Prepare headers for backend request
    const headers: Record<string, string> = {
      "User-Agent": request.headers.get("user-agent") || "",
      Accept: "image/*,*/*",
    };

    // Add authentication if available
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Try the most likely backend patterns
    const possibleUrls = [
      `${API_URL}/api/media/${mediaPath}`, // New Django media endpoint
      `${API_URL}/media/${mediaPath}`, // Django static media
      `${API_URL}/api/auth/serve-media/${mediaPath}`, // Auth-protected endpoint
    ];

    console.log(`🔍 Fetching media for path: ${mediaPath}`);
    console.log(`🔐 Auth available: ${!!accessToken}`);

    // Try each URL pattern
    for (const backendMediaUrl of possibleUrls) {
      console.log(`📡 Trying: ${backendMediaUrl}`);

      try {
        const response = await fetch(backendMediaUrl, {
          method: "GET",
          headers,
        });

        console.log(`📊 Response ${response.status} for ${backendMediaUrl}`);

        if (response.ok) {
          console.log(`✅ SUCCESS! Media found at: ${backendMediaUrl}`);

          const contentType =
            response.headers.get("content-type") || "application/octet-stream";
          const fileBuffer = await response.arrayBuffer();

          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } else if (response.status === 401 || response.status === 403) {
          console.log(
            `🚨 Auth error (${response.status}) at ${backendMediaUrl}`
          );
        }
      } catch (error) {
        console.error(`💥 Error trying ${backendMediaUrl}:`, error);
      }
    }

    // If we get here, none of the URLs worked
    console.error(`❌ Media file not found for path: ${mediaPath}`);

    return NextResponse.json(
      {
        error: "Media file not found",
        message:
          "The backend needs to implement media file serving. Please add a media serving endpoint to your Django backend.",
        details: {
          path: mediaPath,
          triedUrls: possibleUrls,
          hasAuth: !!accessToken,
          backendUrl: API_URL,
        },
        solution: {
          backend: "Add a media serving endpoint to your Django backend",
          frontend:
            "The frontend is correctly configured to proxy media requests",
        },
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("💥 Error serving media file:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
