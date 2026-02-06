// Example: How to integrate ParentalConsentDialog into your signup flow
// This is a reference implementation - adapt it to your existing signup component

"use client";

import { useState } from "react";
import { ParentalConsentDialog } from "@/components/auth/ParentalConsentDialog";

export function SignupFormExample() {
    const [showParentalConsent, setShowParentalConsent] = useState(false);
    const [userAge, setUserAge] = useState<number>(0);
    const [userEmail, setUserEmail] = useState("");

    const handleAgeChange = (age: number) => {
        setUserAge(age);

        // If user is under 13, show parental consent dialog
        if (age < 13 && age > 0) {
            setShowParentalConsent(true);
        }
    };

    const handleSignup = async (formData: any) => {
        // Your existing signup logic here

        // If user is under 13, they need parental consent
        if (userAge < 13) {
            setShowParentalConsent(true);
            return;
        }

        // Continue with normal signup
        // ...
    };

    return (
        <>
            {/* Your signup form */}
            <form onSubmit={handleSignup}>
                {/* Email field */}
                <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Email"
                />

                {/* Age field */}
                <input
                    type="number"
                    min="1"
                    max="120"
                    onChange={(e) => handleAgeChange(parseInt(e.target.value))}
                    placeholder="Da'da (Age)"
                />

                {/* Other fields... */}

                <button type="submit">Sign Up</button>
            </form>

            {/* Parental Consent Dialog */}
            <ParentalConsentDialog
                open={showParentalConsent}
                onOpenChange={setShowParentalConsent}
                userAge={userAge}
                userEmail={userEmail}
                onConsentSent={() => {
                    // Handle after consent is sent
                    // You might want to:
                    // 1. Show a success message
                    // 2. Disable the signup form
                    // 3. Redirect to a "waiting for approval" page
                    console.log("Parental consent request sent");
                }}
            />
        </>
    );
}

/*
 * BACKEND INTEGRATION NOTES:
 * 
 * To fully implement parental consent, you need to:
 * 
 * 1. Database Schema:
 *    - Add `age` field to User model
 *    - Add `parental_consent_required` boolean field
 *    - Add `parental_consent_verified` boolean field
 *    - Create ParentalConsent model with:
 *      - user (ForeignKey)
 *      - parent_email
 *      - parent_name
 *      - verification_token (unique)
 *      - verified (boolean)
 *      - created_at
 * 
 * 2. API Endpoints:
 *    - POST /api/parental-consent/ - Send consent email
 *    - GET /api/parental-consent/verify/?token=xxx - Verify consent
 * 
 * 3. Email Template:
 *    Subject: "Parental Consent Required for Garaad Account"
 *    Body should include:
 *    - Child's email
 *    - Explanation of COPPA
 *    - Verification link
 *    - Privacy policy link
 * 
 * 4. User Registration Flow:
 *    - If age < 13:
 *      - Create user account (inactive)
 *      - Set parental_consent_required = true
 *      - Send consent email
 *      - Block login until verified
 *    - If age >= 13:
 *      - Normal registration flow
 */
