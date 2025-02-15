import { z } from 'zod';
import {
  type AwTool,
  type SupportedLitNetwork,
  NETWORK_CONFIGS,
  NetworkConfig,
} from '@lit-protocol/aw-tool';

import { AwToolSafeInitPolicy, type AwToolSafeInitPolicyType } from './policy';
import { IPFS_CIDS } from './ipfs';

/**
 * Parameters required for the AwToolSafeInit Lit Action.
 * @property {string} pkpEthAddress - The Ethereum address of the PKP.
 * @property {string} signer - an ethereum address that becomes a signer along with the pkp address
 */
export interface AwToolSafeInitLitActionParameters {
  pkpEthAddress: string;
  signer: string;
}

/**
 * Zod schema for validating `AwToolSafeInitLitActionParameters`.
 */
const AwToolSafeInitLitActionSchema = z.object({
  pkpEthAddress: z
    .string()
    .regex(
      /^0x[a-fA-F0-9]{40}$/,
      'Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)'
    ),
  signer: z.string()
});

/**
 * Descriptions of each parameter for the AwToolSafeInit Lit Action.
 * These descriptions are designed to be consumed by LLMs (Language Learning Models) to understand the required parameters.
 */
const AwToolSafeInitLitActionParameterDescriptions = {
  pkpEthAddress:
    'The Ethereum address of the PKP that will be used to perform the action.',
  signer: 'an ethereum address that becomes a signer along with the pkp address'
} as const;

/**
 * Validates the parameters for the AwToolSafeInit Lit Action.
 * @param params - The parameters to validate.
 * @returns `true` if the parameters are valid, or an array of errors if invalid.
 */
const validateAwToolSafeInitParameters = (
  params: unknown
): true | Array<{ param: string; error: string }> => {
  const result = AwToolSafeInitLitActionSchema.safeParse(params);
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
 * Creates a network-specific AwToolSafeInit tool.
 * @param network - The supported Lit network (e.g., `datil-dev`, `datil-test`, `datil`).
 * @param config - The network configuration.
 * @returns A configured `AwTool` instance for the AwToolSafeInit Lit Action.
 */
const createNetworkTool = (
  network: SupportedLitNetwork,
  config: NetworkConfig
): AwTool<AwToolSafeInitLitActionParameters, AwToolSafeInitPolicyType> => ({
  name: 'AwToolSafeInit',
  description: `AwToolSafeInit Tool`,
  ipfsCid: IPFS_CIDS[network].tool,
  defaultPolicyIpfsCid: IPFS_CIDS[network].defaultPolicy,
  parameters: {
    type: {} as AwToolSafeInitLitActionParameters,
    schema: AwToolSafeInitLitActionSchema,
    descriptions: AwToolSafeInitLitActionParameterDescriptions,
    validate: validateAwToolSafeInitParameters,
  },
  policy: AwToolSafeInitPolicy,
});

/**
 * Exports network-specific AwToolSafeInit tools.
 * Each tool is configured for a specific Lit network (e.g., `datil-dev`, `datil-test`, `datil`).
 */
export const AwToolSafeInit = Object.entries(NETWORK_CONFIGS).reduce(
  (acc, [network, config]) => ({
    ...acc,
    [network]: createNetworkTool(network as SupportedLitNetwork, config),
  }),
  {} as Record<
    SupportedLitNetwork,
    AwTool<AwToolSafeInitLitActionParameters, AwToolSafeInitPolicyType>
  >
);