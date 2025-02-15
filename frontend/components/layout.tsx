'use client'
import { Button } from "./ui/button";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { useEnvironmentStore } from "./context";
import { useEffect, useState } from "react";
import { ArrowLeftSquare, CircleDashedIcon } from "lucide-react";
import generateKeypairs from "@/lib/gen-wallet";
import { User } from "@/types";
import { useRouter } from 'next/navigation';
import { ORIGIN, registerWebAuthn, signInWithDiscord, signInWithGoogle } from "@/lib/lit";
import useAuthenticate from "@/hooks/useAuthenticate";
import useAccounts from "@/hooks/useAccounts";
import useSession from "@/hooks/useSession";
import { AUTH_METHOD_TYPE } from "@lit-protocol/constants";
import ConnectModal from "./lit/conect-modal";
import OnboardingModal from "./lit/onboarding-modal";
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
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(0);
  const router = useRouter();
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
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    accounts,
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
    console.log("Auth loading", authLoading);
    console.log("Accounts loading", accountsLoading);
    console.log("Session loading", sessionLoading);
    console.log("Auth method", authMethod);
    console.log("Current account", currentAccount);
    console.log("Session sigs", sessionSigs);
    console.log("Accounts", accounts);
    if (authLoading || accountsLoading || sessionLoading) {
      if (authLoading) setLoadingStatus(1);
      if (accountsLoading) setLoadingStatus(2);
      if (sessionLoading) setLoadingStatus(3);
    } else {
      if (loadingStatus != 0) {
        if (authMethod && accounts.length > 0) {
          setLoadingStatus(4);
        }
        else if (authMethod && accounts.length === 0) {
          setLoadingStatus(5);
        }
      }
    }
  }, [authLoading, accountsLoading, sessionLoading])

  useEffect(() => {
    // If user is authenticated, fetch accounts
    if (authMethod) {
      router.replace(window.location.pathname, undefined,);
      fetchAccounts(authMethod);
    }
  }, [authMethod, fetchAccounts]);

  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  useEffect(() => {
    if (JSON.parse(process.env.NEXT_PUBLIC_IS_VERCEL || "false")) {
      window.location.href = "https://egg-ai-client.ngrok.app";
    }
    (async () => {

      if (currentAccount && sessionSigs) {
        console.log("Logged in with account")
        console.log(JSON.stringify(currentAccount, null, 2));

        try {
          console.log('Fetching user data for pkp with tokenId:', currentAccount.tokenId);
          const response = await fetch(`/api/supabase/get-user?username=${currentAccount.tokenId}`);
          const { user: data } = await response.json();
          console.log('Fetched user data:', data);

          if (data) {
            const responseFollows = await fetch(`/api/supabase/get-follows?username=${currentAccount.tokenId}`);
            const { follows, error } = await responseFollows.json();
            if (error) {
              console.error('Error fetching user follows:', error);
            }
            console.log('Fetched user follows:', follows);
            setUserFollows(follows);

            const { trades } = await fetch(`/api/supabase/get-executed-trades?username=${currentAccount.tokenId}`).then(res => res.json());

            console.log('Fetched user trades:', trades);
            setActions(trades);

            setUser(data);
            router.push('/home');
          } else {
            // Display Create user form

            // Ask for name and email

            // Display the pkp address and ask to fund the wallet.
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else if (authMethod && accounts.length > 0) {
        setLoadingStatus(4);

      }
      else if (authMethod && accounts.length === 0) {
        setLoadingStatus(5);

      }
    })();

  }, [currentAccount, sessionSigs]);

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
              onClick={() => {
                // login();
                if (showConnectWalletModal != 0) setShowConnectWalletModal(0);
                else
                  setShowConnectWalletModal(1);
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border border-black"
            >
              {showConnectWalletModal != 0 ? (
                <div className="flex items-center gap-2">
                  <ArrowLeftSquare size={25} />
                  <p className="sen text-sm sm:text-base">Close Auth</p>
                </div>
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
      {showConnectWalletModal != 0 && <ConnectModal mode={showConnectWalletModal} onClose={() => {
        setShowConnectWalletModal(0);
      }} onModeToggle={() => {
        setShowConnectWalletModal(showConnectWalletModal == 1 ? 2 : 1);
      }} handleGoogleLogin={handleGoogleLogin} handleDiscordLogin={handleDiscordLogin}
        authWithEthWallet={authWithEthWallet}
        registerWithWebAuthn={registerWithWebAuthn}
        authWithWebAuthn={authWithWebAuthn}
        authWithStytch={authWithStytch}
        error={error}
      />}
      {
        loadingStatus != 0 && <OnboardingModal loadingStatus={loadingStatus} accounts={accounts} setCurrentAccount={setCurrentAccount} />
      }
    </div>
  );
}
