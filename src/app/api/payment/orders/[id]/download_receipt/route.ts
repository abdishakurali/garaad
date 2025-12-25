import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants";

const API_URL = API_BASE_URL;

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

// Helper function to get user from cookies
async function getCurrentUser() {
  const cookieStore = await cookies();
  const userStr = cookieStore.get("user")?.value;
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user from cookies:", error);
    return null;
  }
}

// GET /api/payment/orders/[id]/download_receipt/ - Download receipt as HTML
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthToken();
    const user = await getCurrentUser();

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Forward request to backend
    const response = await fetch(
      `${API_URL}/api/payment/orders/${id}/download_receipt/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: "Order not found",
            message:
              "Dalashadan lama helin ama adigu ma lihid fasax aad u dajiniso rasiidka",
          },
          { status: 404 }
        );
      }

      if (response.status === 400) {
        return NextResponse.json(
          {
            success: false,
            error: "Receipt not available",
            message:
              "Rasiidka kaliya waa la dajin karaa dalashada dhammaystiran",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to generate receipt",
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Check if the response is HTML
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("text/html")) {
      // Return HTML response for download
      const htmlContent = await response.text();

      return new NextResponse(htmlContent, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="receipt-${id}.html"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } else {
      // Handle other content types (like PDF in the future)
      const contentBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(contentBuffer);

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="receipt-${id}.pdf"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }
  } catch (error) {
    console.error("Receipt download error:", error);
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
