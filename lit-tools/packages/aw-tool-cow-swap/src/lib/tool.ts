import { z } from 'zod';
import {
  type AwTool,
  type SupportedLitNetwork,
  NETWORK_CONFIGS,
  NetworkConfig,
} from '@lit-protocol/aw-tool';

import { CowSwapPolicy, type CowSwapPolicyType } from './policy';
import { IPFS_CIDS } from './ipfs';

/**
 * Parameters required for the CowSwap Lit Action.
 * @property {string} pkpEthAddress - The Ethereum address of the PKP.
 * @property {string} safeAddress - The Ethereum address of the safe to use for the transaction.
 * @property {boolean} isBuy - Specifies the type of order (FALSE to sell tokens, TRUE to buy tokens).
 * @property {string} sellToken - The Ethereum contract address of the token you want to sell. Must be a valid Ethereum address starting with 0x.
 * @property {number} sellTokenDecimals - The number of decimal places used by the sell token for amount calculations (e.g. 18 for WETH).
 * @property {string} buyToken - The Ethereum contract address of the token you want to receive. Must be a valid Ethereum address starting with 0x.
 * @property {number} buyTokenDecimals - The number of decimal places used by the buy token for amount calculations (e.g. 18 for COW).
 * @property {string} amount - The quantity of tokens to buy or sell. Scale will be adjusted based on buyTokenDecimals or sellTokenDecimals.
 * @property {string} chainId - The ID of the blockchain network to send the tokens on (e.g. 1 for Ethereum mainnet, 84532 for Base Sepolia).
 * @property {string} rpcUrl - The RPC URL of the blockchain network to connect to (e.g. "https://base-sepolia-rpc.publicnode.com").
 */
export interface CowSwapLitActionParameters {
  pkpEthAddress: string;
  chainId: string;
  rpcUrl: string;
  safeAddress: string;
  sellToken: string;
  buyToken: string;
  amount: string;
}

/**
 * Zod schema for validating `CowSwapLitActionParameters`.
 */
const CowSwapLitActionSchema = z.object({
  pkpEthAddress: z
    .string()
    .regex(
      /^0x[a-fA-F0-9]{40}$/,
      'Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)'
    ),
  safeAddress: z
    .string()
    .regex(
      /^0x[a-fA-F0-9]{40}$/,
      'Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)'
    ),
  sellToken: z.string().regex(
    /^0x[a-fA-F0-9]{40}$/,
    'Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)'
  ),
  buyToken: z.string().regex(
    /^0x[a-fA-F0-9]{40}$/,
    'Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)'
  ),
  amount: z.string(),
  chainId: z.string(),
  rpcUrl: z.string(),
});

/**
 * Descriptions of each parameter for the CowSwap Lit Action.
 * These descriptions are designed to be consumed by LLMs (Language Learning Models) to understand the required parameters.
 */
const CowSwapLitActionParameterDescriptions = {
  pkpEthAddress:
    'The Ethereum address of the PKP that will be used to perform the action.',
  safeAddress:
    'The Ethereum address of the safe to use for the transaction.',
  sellToken: 'The Ethereum contract address of the token you want to sell. Must be a valid Ethereum address starting with 0x.',
  buyToken: 'The Ethereum contract address of the token you want to receive. Must be a valid Ethereum address starting with 0x.',
  amount: 'The quantity of tokens to buy or sell. Scale will be adjusted based on buyTokenDecimals or sellTokenDecimals.',
  chainId:
    'The ID of the blockchain network to send the tokens on (e.g. 1 for Ethereum mainnet, 84532 for Base Sepolia).',
  rpcUrl:
    'The RPC URL of the blockchain network to connect to (e.g. "https://base-sepolia-rpc.publicnode.com").',
} as const;

/**
 * Validates the parameters for the CowSwap Lit Action.
 * @param params - The parameters to validate.
 * @returns `true` if the parameters are valid, or an array of errors if invalid.
 */
const validateCowSwapParameters = (
  params: unknown
): true | Array<{ param: string; error: string }> => {
  const result = CowSwapLitActionSchema.safeParse(params);
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
 * Creates a network-specific CowSwap tool.
 * @param network - The supported Lit network (e.g., `datil-dev`, `datil-test`, `datil`).
 * @param config - The network configuration.
 * @returns A configured `AwTool` instance for the CowSwap Lit Action.
 */
const createNetworkTool = (
  network: SupportedLitNetwork,
  config: NetworkConfig
): AwTool<CowSwapLitActionParameters, CowSwapPolicyType> => ({
  name: 'CowSwap',
  description: `CowSwap Tool`,
  ipfsCid: IPFS_CIDS[network].tool,
  defaultPolicyIpfsCid: IPFS_CIDS[network].defaultPolicy,
  parameters: {
    type: {} as CowSwapLitActionParameters,
    schema: CowSwapLitActionSchema,
    descriptions: CowSwapLitActionParameterDescriptions,
    validate: validateCowSwapParameters,
  },
  policy: CowSwapPolicy,
});

/**
 * Exports network-specific CowSwap tools.
 * Each tool is configured for a specific Lit network (e.g., `datil-dev`, `datil-test`, `datil`).
 */
export const CowSwap = Object.entries(NETWORK_CONFIGS).reduce(
  (acc, [network, config]) => ({
    ...acc,
    [network]: createNetworkTool(network as SupportedLitNetwork, config),
  }),
  {} as Record<
    SupportedLitNetwork,
    AwTool<CowSwapLitActionParameters, CowSwapPolicyType>
  >
);