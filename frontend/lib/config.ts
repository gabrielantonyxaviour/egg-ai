import { http, createConfig } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const chain = JSON.parse(process.env.NEXT_PUBLIC_IS_PROD || "false") ? arbitrum : arbitrumSepolia;

export const config = JSON.parse(process.env.NEXT_PUBLIC_IS_PROD || "false") ? createConfig({
  chains: [arbitrum],
  connectors: [injected()],
  transports: {
    [arbitrum.id]: http(),
  },
}) : createConfig({
  chains: [arbitrumSepolia],
  connectors: [injected()],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});
