import { Metadata } from "next";
import TrackSelectClient from "@/components/learning/TrackSelectClient";

export const metadata: Metadata = {
  title: "Dooro Wadaadkaaga | Garaad",
  description: "Freelancer, Shaqo, ama Builder — dooro wadaadka ku haboon.",
};

export default function PathPage() {
  return <TrackSelectClient />;
}
