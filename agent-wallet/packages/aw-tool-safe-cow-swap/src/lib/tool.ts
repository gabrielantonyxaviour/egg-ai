import { z } from 'zod';
import {
  type AwTool,
  type SupportedLitNetwork,
  NETWORK_CONFIGS,
  NetworkConfig,
} from '@lit-protocol/aw-tool';

import { SafeCowSwapPolicy, type SafeCowSwapPolicyType } from './policy';
import { IPFS_CIDS } from './ipfs';

/**
 * Parameters required for the SafeCowSwap Lit Action.
 * @property {string} pkpEthAddress - The Ethereum address of the PKP.
 * @property {string} kind - Choose between BUY or SELL 
 * @property {string} sellToken - The Ethereum contract address of the ERC20 token you want to sell.
 * @property {number} sellTokenDecimals - The decimals of the sell token asset
 * @property {string} buyToken - The Ethereum contract address of the ERC20 token you want to buy.
 * @property {number} buyTokenDecimals - The decimals of the buy token asset
 * @property {number} amount - The amount of tokens you want to sell
 */
export interface SafeCowSwapLitActionParameters {
  pkpEthAddress: string;
  kind: string;
  sellToken: string;
  sellTokenDecimals: number;
  buyToken: string;
  buyTokenDecimals: number;
  amount: number;
}

/**
 * Zod schema for validating `SafeCowSwapLitActionParameters`.
 */
const SafeCowSwapLitActionSchema = z.object({
  pkpEthAddress: z
    .string()
    .regex(
      /^0x[a-fA-F0-9]{40}$/,
      'Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)'
    ),
  kind: z.string(),
  sellToken: z.string(),
  sellTokenDecimals: z.number(),
  buyToken: z.string(),
  buyTokenDecimals: z.number(),
  amount: z.number()
});

/**
 * Descriptions of each parameter for the SafeCowSwap Lit Action.
 * These descriptions are designed to be consumed by LLMs (Language Learning Models) to understand the required parameters.
 */
const SafeCowSwapLitActionParameterDescriptions = {
  pkpEthAddress:
    'The Ethereum address of the PKP that will be used to perform the action.',
  kind: 'Choose between BUY or SELL ',
  sellToken: 'The Ethereum contract address of the ERC20 token you want to sell.',
  sellTokenDecimals: 'The decimals of the sell token asset',
  buyToken: 'The Ethereum contract address of the ERC20 token you want to buy.',
  buyTokenDecimals: 'The decimals of the buy token asset',
  amount: 'The amount of tokens you want to sell'
} as const;

/**
 * Validates the parameters for the SafeCowSwap Lit Action.
 * @param params - The parameters to validate.
 * @returns `true` if the parameters are valid, or an array of errors if invalid.
 */
const validateSafeCowSwapParameters = (
  params: unknown
): true | Array<{ param: string; error: string }> => {
  const result = SafeCowSwapLitActionSchema.safeParse(params);
  if (result.success) {
    return true;
  }

  // Map validation errors to a more user-friendly format
  return result.error.issues.map((issue) => ({
    param: issue.path[0] as string,
    error: issue.message,
  }));
};

/**
 * Creates a network-specific SafeCowSwap tool.
 * @param network - The supported Lit network (e.g., `datil-dev`, `datil-test`, `datil`).
 * @param config - The network configuration.
 * @returns A configured `AwTool` instance for the SafeCowSwap Lit Action.
 */
const createNetworkTool = (
  network: SupportedLitNetwork,
  config: NetworkConfig
): AwTool<SafeCowSwapLitActionParameters, SafeCowSwapPolicyType> => ({
  name: 'SafeCowSwap',
  description: `SafeCowSwap Tool`,
  ipfsCid: IPFS_CIDS[network].tool,
  defaultPolicyIpfsCid: IPFS_CIDS[network].defaultPolicy,
  parameters: {
    type: {} as SafeCowSwapLitActionParameters,
    schema: SafeCowSwapLitActionSchema,
    descriptions: SafeCowSwapLitActionParameterDescriptions,
    validate: validateSafeCowSwapParameters,
  },
  policy: SafeCowSwapPolicy,
});

/**
 * Exports network-specific SafeCowSwap tools.
 * Each tool is configured for a specific Lit network (e.g., `datil-dev`, `datil-test`, `datil`).
 */
export const SafeCowSwap = Object.entries(NETWORK_CONFIGS).reduce(
  (acc, [network, config]) => ({
    ...acc,
    [network]: createNetworkTool(network as SupportedLitNetwork, config),
  }),
  {} as Record<
    SupportedLitNetwork,
    AwTool<SafeCowSwapLitActionParameters, SafeCowSwapPolicyType>
  >
);