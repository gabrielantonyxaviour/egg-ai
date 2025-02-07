'use client'
import { Button } from "./ui/button";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { useEnvironmentStore } from "./context";
import { useEffect } from "react";
import { CircleDashedIcon } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import generateKeypairs from "@/lib/gen-wallet";
import { User } from "@/types";
import { useRouter } from "next/navigation";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data: session, status } = useSession();
  const { user, setUser, setUserFollows } = useEnvironmentStore((store) => store);
  const { address, isConnected, } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { ready, authenticated, login, user: privyUser, logout } = usePrivy();
  const router = useRouter()
  useEffect(() => {
    console.log('Privy User:', privyUser);

    if (ready && authenticated && privyUser && privyUser.telegram) {
      const { username, firstName, lastName, telegramUserId, photoUrl } = privyUser.telegram;

      (async () => {
        try {
          console.log('Fetching user data for username:', username);
          const response = await fetch(`/api/supabase/get-user?username=${username}`);
          const { user: data } = await response.json();
          console.log('Fetched user data:', data);

          if (data) {
            if (data.image != photoUrl || data.name != firstName + " " + lastName) {
              console.log('Updating user data for:', username);
              setUser({
                ...data,
                name: firstName + " " + lastName,
                image: photoUrl,
              });
              await fetch(`/api/supabase/update-user`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...data,
                  name: firstName + " " + lastName,
                  image: photoUrl,
                }),
              });
              console.log('User data updated successfully');
            } else {
              setUser(data);
              console.log('User data is up-to-date');
            }

            const responseFollows = await fetch(`/api/supabase/get-follows?username=${username}`);
            const { follows, error } = await responseFollows.json();
            if (error) {
              console.error('Error fetching user follows:', error);
            }
            console.log('Fetched user follows:', follows);
            setUserFollows(follows);
          } else {
            console.log('Creating new user for:', username);
            const keypairs = await generateKeypairs();
            const newUser: User = {
              username: username!,
              name: firstName + " " + lastName,
              image: photoUrl,
              paused: null,
              evm_address: keypairs.evm.address,
              evm_p_key: keypairs.evm.privateKey,
              mode: 'TREN',
              profit_timeline: null,
              profit_goal: null,
              solana_address: keypairs.solana.publicKey,
              solana_p_key: keypairs.solana.privateKey
            };
            const response = await fetch(`/api/supabase/create-user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newUser),
            });
            const { user: data } = await response.json();
            setUser(data);
            console.log('New user created successfully:', data);
          }
          // router.push('/home');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      })();

    }
  }, [privyUser]);

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
        <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
          {user ? <Button
            onClick={(e) => {
              logout();
              setUser(null);
            }}
            className="group absolute -top-[4px] -left-[2px] rounded-sm w-full h-full flex p-5 bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border-[1px] border-black mr-[2px]"
          >
            <Image
              src={"/telegram.svg"}
              width={30}
              height={30}
              alt="telegram"
              onError={(e) => {
                e.currentTarget.src = "/telegram.svg";
              }}
              className="rounded-full group-hover:filter group-hover:invert"
            />
            <p>{user.username}</p>
          </Button> : <Button
            disabled={authenticated || (privyUser != undefined && privyUser.telegram != undefined)}
            onClick={(e) => {
              login();
            }}
            className="group absolute -top-[4px] -left-[2px] rounded-sm w-full h-full flex p-5 bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border-[1px] border-black mr-[2px]"
          >
            {
              !ready ? <CircleDashedIcon className="h-6 w-6 animate-spin" /> : <>  <Image
                src="/telegram.svg"
                width={30}
                height={30}
                alt="telegram"
                className="rounded-full group-hover:filter group-hover:invert"
              />
                <p className="sen">Connect</p></>
            }
          </Button>}
        </div>
      </div>
      {children}

    </div>
  );
}
