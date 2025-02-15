'use client'
import { Button } from "./ui/button";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";
import { useEnvironmentStore } from "./context";
import { useEffect, useState } from "react";
import { ArrowLeftSquare, } from "lucide-react";
import { useRouter, } from 'next/navigation';
import { ORIGIN, registerWebAuthn, signInWithDiscord, signInWithGoogle } from "@/lib/lit";
import useAuthenticate from "@/hooks/useAuthenticate";
import useAccounts from "@/hooks/useAccounts";
import useSession from "@/hooks/useSession";
import { AUTH_METHOD_TYPE, } from "@lit-protocol/constants";
import ConnectModal from "./lit/conect-modal";
import OnboardingModal from "./lit/onboarding-modal";
import { shortenAddress } from "@/lib/utils";
import { createPublicClient, formatEther, http } from "viem";
import { arbitrumSepolia, avalancheFuji } from "viem/chains";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data: session, status } = useSession();
  const { user, setUser, setUserFollows, setActions, arbPkpBalance, avaxPkpBalance, setCurrentPkpAccount, setCurrentSessionSigs } = useEnvironmentStore((store) => store);
  const { address, isConnected, } = useAccount();
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
    sessionSigs, setSessionSigs,
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
    sessionStorage.setItem('login', showConnectWalletModal == 1 ? "true" : "false");
    await signInWithGoogle(redirectUri);
  }

  async function handleDiscordLogin() {
    sessionStorage.setItem('login', showConnectWalletModal == 1 ? "true" : "false");
    await signInWithDiscord(redirectUri);;
  }

  async function registerWithWebAuthn() {
    const newPKP = await registerWebAuthn();
    if (newPKP) {
      setCurrentAccount(newPKP);
    }
  }

  useEffect(() => {
    try {
      const persistedData = localStorage.getItem('eggai-login');
      if (persistedData) {
        const parsedData = JSON.parse(persistedData);
        // Check if the data hasn't expired
        if (parsedData.expiresAt && new Date(parsedData.expiresAt) > new Date()) {
          setCurrentAccount(parsedData.data.currentAccount)
          setSessionSigs(parsedData.data.sessionSigs)
        } else {
          // Clear expired data
          localStorage.removeItem('eggai-login');
        }
      }
    } catch (error) {
      console.error(`Error loading persisted state for ${'eggai-login'}:`, error);
    }
  }, [])

  useEffect(() => {
    // If user is authenticated, fetch accounts for login and create account for sign up
    if (authMethod) {
      const loginParam = sessionStorage.getItem('login');
      if (!loginParam) return;
      const isLogin = JSON.parse(loginParam);
      console.log("Login parameter:", isLogin);
      if (isLogin) {
        console.log("Fetching accounts with auth method:", authMethod);
        router.replace(window.location.pathname, undefined);
        fetchAccounts(authMethod);
      } else {
        if (authMethod.authMethodType !== AUTH_METHOD_TYPE.WebAuthn) {
          console.log("Creating account with auth method:", authMethod);
          router.replace(window.location.pathname, undefined);
          createAccount(authMethod);
        }
      }
    }
  }, [authMethod, fetchAccounts, createAccount]);

  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);


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
    if (JSON.parse(process.env.NEXT_PUBLIC_IS_VERCEL || "false")) {
      window.location.href = "https://egg-ai-client.ngrok.app";
    }
    (async () => {

      if (currentAccount && sessionSigs) {
        console.log("Logged in with account")
        console.log(JSON.stringify(currentAccount, null, 2));
        const dataToStore = {
          data: {
            currentAccount, sessionSigs
          },
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week expiry
        };
        localStorage.setItem("eggai-login", JSON.stringify(dataToStore));
        setCurrentPkpAccount(currentAccount);
        setCurrentSessionSigs(sessionSigs);
        setLoadingStatus(6)
        try {
          console.log('Fetching user data for pkp with tokenId:', BigInt(currentAccount.tokenId.hex).toString());
          const response = await fetch(`/api/supabase/get-user?username=${BigInt(currentAccount.tokenId.hex).toString()}`);
          const { user: data } = await response.json();
          console.log('Fetched user data:', data);

          if (data) {
            console.log('Setting loading status to 7');
            setLoadingStatus(7);
            console.log('Fetching user follows for:', currentAccount.tokenId.toString());
            const responseFollows = await fetch(`/api/supabase/get-follows?username=${currentAccount.tokenId.toString()}`);
            const { follows, error } = await responseFollows.json();
            if (error) {
              console.error('Error fetching user follows:', error);
            }
            console.log('Fetched user follows:', follows);
            setUserFollows(follows);

            console.log('Fetching user trades for:', currentAccount.tokenId.toString());
            const { trades } = await fetch(`/api/supabase/get-executed-trades?username=${currentAccount.tokenId.toString()}`).then(res => res.json());
            console.log('Fetched user trades:', trades);
            setActions(trades);

            console.log('Setting user data:', data);
            setUser(data);

            console.log('Navigating to /home');
            router.push('/home');
            console.log('Setting loading status to 0');
            setLoadingStatus(0);
            setShowConnectWalletModal(0)
          } else {
            setLoadingStatus(8)
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
      <div className="fixed w-full flex flex-col sm:flex-row justify-end items-end sm:items-center gap-2 sm:gap-4 p-2 sm:p-4 sen">
        {currentAccount != undefined && (
          <><div className="relative w-[150px] bg-black h-10 rounded-sm">
            <Button
              onClick={() => {
                window.open("https://sepolia.arbiscan.io/address/" + currentAccount?.ethAddress, "_blank");
              }}
              className="absolute -top-1 -left-1 w-full h-full flex items-center justify-center space-x-2 bg-[#d74b1a] hover:bg-[#d74b1a] border-black"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={"/chains/arb.png"}
                  width={25}
                  height={25}
                  alt="arbitrum"
                  className="rounded-full"
                />
                <p className="text-xs md:text-sm font-semibold">
                  {parseFloat(arbPkpBalance).toFixed(4)} {"ETH"}
                </p>
              </div>
            </Button>
          </div>
            <div className="relative w-[150px] bg-black h-10 rounded-sm">
              <Button
                onClick={() => {
                  window.open("https://testnet.snowtrace.io/address/" + currentAccount?.ethAddress, "_blank");
                }}
                className="absolute -top-1 -left-1 w-full h-full flex items-center justify-center space-x-2 bg-[#d74b1a] hover:bg-[#d74b1a] border-black"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={"/chains/avax.png"}
                    width={25}
                    height={25}
                    alt="arbitrum"
                    className="rounded-full"
                  />
                  <p className="text-xs md:text-sm font-semibold">
                    {parseFloat(avaxPkpBalance).toFixed(4)} {"AVAX"}
                  </p>
                </div>
              </Button>
            </div></>
        )}
        <div className="relative bg-black w-[180px] h-10 rounded-sm">
          {user ? (
            <Button
              onClick={() => {
                setUser(null);
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border border-black"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={"/lit.jpg"}
                  width={30}
                  height={30}
                  alt="lit"
                  onError={(e) => {
                    e.currentTarget.src = "/lit.jpg";
                  }}
                  className="rounded-full group-hover:filter group-hover:invert"
                />
                <p className="text-sm pl-1 font-semibold">{shortenAddress(user.pkp_address)}</p>
              </div>
            </Button>
          ) : (
            <Button
              onClick={() => {
                // login();
                if (showConnectWalletModal != 0) setShowConnectWalletModal(0);
                else if (loadingStatus != 0) setLoadingStatus(0);
                else
                  setShowConnectWalletModal(1);
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#d74b1a] hover:bg-[#faefe0] hover:text-black border border-black"
            >
              {showConnectWalletModal != 0 || loadingStatus != 0 ? (
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
        loadingStatus != 0 && <OnboardingModal sessionSigs={sessionSigs} currentAccount={currentAccount} loadingStatus={loadingStatus} accounts={accounts} setCurrentAccount={setCurrentAccount} signUp={() => {
          setLoadingStatus(0)
          setShowConnectWalletModal(2)
        }} />
      }
    </div>
  );
}
