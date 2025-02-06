"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { injected } from "wagmi/connectors";
import { getBalance } from "@wagmi/core";
import { config } from "@/lib/config";
// import { EGG_AI_ADDRESS } from "@/lib/constants";
import { useEnvironmentStore } from "./context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { eggAiBalance, setEggAiBalance, setActive, setCompleted } =
  //   useEnvironmentStore((store) => store);
  const { toast } = useToast();
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { data: balance } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="h-screen w-screen">
      <div className="fixed w-screen flex justify-end space-x-4 p-4">
        {isConnected && address != null && balance && (
          <>
            <div className="relative w-[130px] bg-black h-[40px] rounded-sm">
              <Button
                onClick={() => {
                  // window.open(
                  //   "https://arbiscan.io/address/" +
                  //   EGG_AI_ADDRESS,
                  //   "_blank"
                  // );

                  // TODO: Fix this
                }}
                className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#d74b1a] hover:bg-[#d74b1a] border-black mr-[2px]"
              >
                <Image
                  src={"/robin.jpg"}
                  width={25}
                  height={25}
                  alt="robin"
                  className="rounded-full"
                />
                {/* <p> {eggAiBalance.toFixed(2)} RX</p> TODO*/}
              </Button>
            </div>
            <div className="relative w-[130px] bg-black h-[40px] rounded-sm">
              <Button
                onClick={() => {
                  window.open("https://arbiscan.io/", "_blank");
                }}
                className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#d74b1a] hover:bg-[#d74b1a] border-black mr-[2px]"
              >
                <Image
                  src={"/chains/arbitrum.png"}
                  width={25}
                  height={25}
                  alt="arbitrum"
                  className="rounded-full"
                />
                <p>
                  {" "}
                  {parseFloat(balance?.formatted).toFixed(2)} {"EDU"}
                </p>
              </Button>
            </div>
          </>
        )}
        {!isConnected || address == null ? (
          <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
            <Button
              className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border-[1px] border-black mr-[2px]"
              onClick={async () => {
                // await connectAsync({
                //   chainId: arbitrumTestnet.id,
                //   connector: injected(),
                // });
                // await authSdk.signInWithRedirect({
                //   state: "opencampus",
                // });
              }}
            >
              <p> {"Connect Wallet"}</p>
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
                <Button
                  className="absolute -top-[4px] -left-[4px] flex p-5 space-x-2 bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border-[1px] border-black mr-[2px]"
                  onClick={() => {
                    // handleLogout();
                    // disconnect();
                  }}
                >
                  <Image
                    src="/metamask.png"
                    width={30}
                    height={30}
                    alt="metamask"
                    className="rounded-full"
                  />
                  <p>{shortenAddress(address as `0x${string}`)}</p>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px] p-0 m-0 bg-transparent border-0 flex flex-col space-y-2">
              <DropdownMenuItem className="p-0 w-[180px] hover:bg-transparent">
                <Button
                  variant={"destructive"}
                  className="w-full flex p-5 space-x-2 hover:bg-destructive border-[1px] border-black mr-[2px]"
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect Wallet
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {children}
    </div>
  );
}
