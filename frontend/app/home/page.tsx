import type { Metadata } from "next";
import Home from "@/components/home";

export const metadata: Metadata = {
  title: "Egg AI | Home",
  description:
    "An autonomous AI agent that lets you click a button to print money.",
};

export default function HomePage() {
  return <Home />;
}
