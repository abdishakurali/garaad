import { Metadata } from "next";
import TrackDashboardClient from "@/components/learning/TrackDashboardClient";

interface Props {
  params: { trackSlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Wadaadka | Garaad`,
    description: "Dukumentiyadaada usbuucyada iyo horumarka.",
  };
}

export default function TrackDashboardPage({ params }: Props) {
  return <TrackDashboardClient trackSlug={params.trackSlug} />;
}
