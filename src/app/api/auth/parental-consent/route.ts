import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { parentEmail, parentName, userEmail, userAge } = body;

        // Validate inputs
        if (!parentEmail || !parentName || !userEmail || !userAge) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (userAge >= 13) {
            return NextResponse.json(
                { error: "Parental consent not required for users 13 and older" },
                { status: 400 }
            );
        }

        // TODO: Send email to parent with consent verification link
        // This should:
        // 1. Generate a unique verification token
        // 2. Store it in the database with user info
        // 3. Send email to parent with verification link
        // 4. Link format: /api/auth/verify-parental-consent?token=xxx

        // For now, we'll just log and return success
        console.log("Parental consent request:", {
            parentEmail,
            parentName,
            userEmail,
            userAge,
        });

        // In production, you would:
        // 1. Call your backend API to send the consent email
        // 2. Store the pending consent in the database
        // Example:
        /*
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/parental-consent/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parent_email: parentEmail,
            parent_name: parentName,
            user_email: userEmail,
            user_age: userAge,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to send consent request');
        }
        */

        return NextResponse.json({
            success: true,
            message: "Parental consent request sent successfully",
        });
    } catch (error) {
        console.error("Error sending parental consent:", error);
        return NextResponse.json(
            { error: "Failed to send parental consent request" },
            { status: 500 }
        );
    }
}
