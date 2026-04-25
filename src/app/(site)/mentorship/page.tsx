import { Metadata } from "next";
import { MentorshipContent } from "./mentorship-content";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  title: "Isdiiwi / Assessment — Garaad",
  description:
    "Ballamarso anshexinaad la tixgeliyo oo kugu habboon heerkaaga. Ku laabo macallin ama koox isbarbaro ah si aad u hesho taageero shakhsiga.",
  alternates: { canonical: `${SITE_URL}/mentorship` },
};

export default function MentorshipPage() {
  return <MentorshipContent />;
}