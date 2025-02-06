"use client";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

export default function Landing({ session }: { session: Session | null }) {
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex flex-col justify-center pt-2">
      <div className="relative bg-black w-[700px] h-[50%] rounded-xl mx-auto">
        <div className="absolute flex flex-col justify-center -top-[4px] -left-[4px] bg-[#faefe0] w-[700px] mx-auto h-full rounded-xl border-[1px] border-black">
          <div className="flex justify-between items-center p-2"></div>
          <div className="bg-[#faefe0] w-full flex justify-center items-center rounded-xl py-12">
            <Image src={"/egg.png"} alt="hero" width={300} height={300} />

          </div>
          <p className="text-center pt-2 font-bold text-xl sen tracking-wide">
            EggAI
          </p>
          <p className="text-center text-xs sen ">
            An autonomous AI agent that prints you money by clicking a button.
          </p>
          <div className="flex justify-center py-4 space-x-2 ">
            <Button
              variant={"outline"}
              className="rounded-sm bg-transparent border-0 hover:bg-transparent hover:border-2 hover:border-black hover:font-bold"
              onClick={() => {
                router.push("/home");
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
