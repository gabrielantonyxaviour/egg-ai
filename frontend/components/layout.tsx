"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { chain, } from "@/lib/config";
import { useEnvironmentStore } from "./context";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { useToast } from "@/hooks/use-toast";
import { TelegramUser } from "@/types/telegram";
import { TelegramLogin } from "./telegram-login";
import { useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LoginButton } from "@telegram-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleDashedIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const { user, setUser } = useEnvironmentStore((store) => store);
  const { toast } = useToast();
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { data: balance } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const pathname = usePathname();
  const telegramButtonRef = useRef<HTMLButtonElement>(null);

  const handleTelegramResponse = async (user: TelegramUser) => {
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (data.success) {
        setUser(user);
        router.push('/home');
        toast({
          title: "Connected",
          description: "Successfully connected with Telegram",
        });
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      toast({
        title: "Error",
        description: "Failed to connect with Telegram",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="h-screen w-screen">
      <div className="fixed w-screen flex justify-end space-x-4 p-4">
        {isConnected && address != null && balance && (
          <>
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
                  {parseFloat(balance?.formatted).toFixed(2)} {"ETH"}
                </p>
              </Button>
            </div>
          </>
        )}
        {/* <div className="relative bg-black w-[120px] h-[40px] rounded-sm">
          <Button
            ref={telegramButtonRef}
            onClick={(e) => {
              e.preventDefault();
              console.log('Button clicked');
            }}
            className="group absolute -top-[4px] -left-[2px] rounded-sm w-full h-full flex p-5 bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border-[1px] border-black mr-[2px]"
          >
            <Image
              src="/telegram.svg"
              width={30}
              height={30}
              alt="telegram"
              className="rounded-full group-hover:filter group-hover:invert"
            />
            <p>Connect</p>
          </Button>
          <TelegramLogin
            botName="egg_ai_bot"
            onAuth={handleTelegramResponse}
            triggerRef={telegramButtonRef}
          />
         
        </div> */}
        {status == 'loading' ? <CircleDashedIcon className="h-6 w-6 animate-spin" /> : status == 'authenticated' ? <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Avatar>
                <AvatarImage
                  src={session.user?.image ?? "/default.webp"}
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {session.user?.name}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Test 1</DropdownMenuItem>
            <DropdownMenuItem disabled>Test 2</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> : <LoginButton
          showAvatar={true}
          botUsername={'egg_ai_bot'}
          onAuthCallback={(data) => {
            signIn("telegram-login", { callbackUrl: "/" }, data as any);
          }}
        />}
      </div>
      {children}

    </div>
  );
}
