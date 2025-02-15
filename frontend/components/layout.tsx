'use client'
import { Button } from "./ui/button";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { useEnvironmentStore } from "./context";
import { useEffect, useState } from "react";
import { CircleDashedIcon } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import generateKeypairs from "@/lib/gen-wallet";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { ORIGIN, registerWebAuthn, signInWithDiscord, signInWithGoogle } from "@/lib/lit";
import useAuthenticate from "@/hooks/useAuthenticate";
import useAccounts from "@/hooks/useAccounts";
import useSession from "@/hooks/useSession";
import { AUTH_METHOD_TYPE } from "@lit-protocol/constants";
import ConnectModal from "./conect-modal";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data: session, status } = useSession();
  const { user, setUser, setUserFollows, setActions } = useEnvironmentStore((store) => store);
  const { address, isConnected, } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
  const { ready, authenticated, login, user: privyUser, logout, getAccessToken } = usePrivy();
  const router = useRouter()
  const redirectUri = ORIGIN;

  const {
    authMethod,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
  const {
    createAccount,
    setCurrentAccount,
    currentAccount,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();

  const error = authError || accountsError || sessionError;
  if (error) {
    if (authError) {
      console.error('Auth error:', authError);
    }

    if (accountsError) {
      console.error('Accounts error:', accountsError);
    }

    if (sessionError) {
      console.error('Session error:', sessionError);
    }
  }

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
  }

  async function handleDiscordLogin() {
    await signInWithDiscord(redirectUri);
  }

  async function registerWithWebAuthn() {
    const newPKP = await registerWebAuthn();
    if (newPKP) {
      setCurrentAccount(newPKP);
    }
  }

  useEffect(() => {
    // If user is authenticated and has at least one account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);
  useEffect(() => {
    if (JSON.parse(process.env.NEXT_PUBLIC_IS_VERCEL || "false")) {
      window.location.href = "https://egg-ai-client.ngrok.app";
    }
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

            const { trades } = await fetch(`/api/supabase/get-executed-trades?username=${username}`).then(res => res.json());

            console.log('Fetched user trades:', trades);
            setActions(trades);
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
    <div className="min-h-screen w-full">
      <div className="fixed w-full flex flex-col sm:flex-row justify-end items-end sm:items-center gap-2 sm:gap-4 p-2 sm:p-4">
        {isConnected && address != null && balance && (
          <div className="relative w-[130px] bg-black h-10 rounded-sm">
            <Button
              onClick={() => {
                window.open("https://arbiscan.io/", "_blank");
              }}
              className="absolute -top-1 -left-1 w-full h-full flex items-center justify-center space-x-2 bg-[#d74b1a] hover:bg-[#d74b1a] border-black"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={"/chains/arbitrum.png"}
                  width={25}
                  height={25}
                  alt="arbitrum"
                  className="rounded-full"
                />
                <p className="text-sm sm:text-base">
                  {parseFloat(balance?.formatted).toFixed(2)} {"ETH"}
                </p>
              </div>
            </Button>
          </div>
        )}

        <div className="relative bg-black w-[160px] h-10 rounded-sm">
          {user ? (
            <Button
              onClick={() => {
                logout();
                setUser(null);
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border border-black"
            >
              <div className="flex items-center gap-2">
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
                <p className="text-sm sm:text-base truncate max-w-20">{user.username}</p>
              </div>
            </Button>
          ) : (
            <Button
              disabled={showConnectWalletModal}
              onClick={() => {
                // login();
                setShowConnectWalletModal(true);
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border border-black"
            >
              {showConnectWalletModal ? (
                <CircleDashedIcon className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src="/lit.jpg"
                    width={25}
                    height={25}
                    alt="lit"
                    className="rounded-full group-hover:filter group-hover:invert"
                  />
                  <p className="sen text-sm sm:text-base">Connect</p>
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
      {children}
      {showConnectWalletModal && <ConnectModal isOpen={showConnectWalletModal} onClose={() => {
        setShowConnectWalletModal(false);
      }} />}
    </div>
  );
}
