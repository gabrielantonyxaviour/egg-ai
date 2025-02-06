import type { Metadata } from "next";
import Landing from "@/components/landing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const metadata: Metadata = {
  title: "Egg AI | Landing",
  description:
    "An autonomous AI agent that lets you click a button to print money.",
};

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  return <Landing session={session} />;
}
