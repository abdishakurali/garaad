import { redirect } from "next/navigation";

// This intermediate screen has been removed. All post-signup/verification
// flows now send users directly to the first course (momentum-first UX).
export default function PostVerificationChoicePage() {
  redirect("/courses/freelancing");
}
