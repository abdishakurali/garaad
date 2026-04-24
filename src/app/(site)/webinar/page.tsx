import { redirect } from "next/navigation";

// Legacy /webinar URL — redirect to the active webinar listing
export default function WebinarPage() {
  redirect("/webinars/freelancing-in-somalia");
}
