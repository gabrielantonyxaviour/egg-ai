"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { chain, config } from "@/lib/config";
import { PrivyProvider } from '@privy-io/react-auth';
export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#c49963',
          logo: 'https://monkfish-relevant-lively.ngrok-free.app/egg.png',
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
        loginMethods: ['telegram'],
        defaultChain: chain,

      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
