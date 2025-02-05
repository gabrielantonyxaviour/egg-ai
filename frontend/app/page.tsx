import type { Metadata } from "next";
import Landing from "@/components/landing";

export const metadata: Metadata = {
  title: "Egg AI | Landing",
  description:
    "An autonomous AI agent that lets you click a button to print money.",
};

export default function LandingPage() {
  return <Landing />;
}
