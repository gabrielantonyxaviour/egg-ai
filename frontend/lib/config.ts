import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { arbitrumTestnet } from "./utils";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [arbitrumTestnet],
  connectors: [injected()],
  transports: {
    [arbitrumTestnet.id]: http(),
  },
});
