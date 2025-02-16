import { z } from 'zod';
import { ethers } from 'ethers';

/**
 * Schema for validating a CowSwap policy.
 * Ensures the policy has the correct structure and valid values.
 */
const policySchema = z.object({
  /** The type of policy, must be `CowSwap`. */
  type: z.literal('CowSwap'),

  /** The version of the policy. */
  version: z.string(),

  /** List of assets that are supported by Egg AI for Cow Swap */
  assets: z.array(z.string())
});

/**
 * Encodes a CowSwap policy into a format suitable for on-chain storage.
 * @param policy - The CowSwap policy to encode.
 * @returns The encoded policy as a hex string.
 * @throws If the policy does not conform to the schema.
 */
function encodePolicy(policy: CowSwapPolicyType): string {
  // Validate the policy against the schema
  policySchema.parse(policy);

  return ethers.utils.defaultAbiCoder.encode(
    ['tuple(string[] assets)'],
    [policy]
  );
}

/**
 * Decodes a CowSwap policy from its on-chain encoded format.
 * @param encodedPolicy - The encoded policy as a hex string.
 * @returns The decoded CowSwap policy.
 * @throws If the encoded policy is invalid or does not conform to the schema.
 */
function decodePolicy(encodedPolicy: string): CowSwapPolicyType {
  const decoded = ethers.utils.defaultAbiCoder.decode(
    ['tuple(string[] assets)'],
    encodedPolicy
  )[0];

  const policy: CowSwapPolicyType = {
    type: 'CowSwap',
    version: '1.0.0',
    assets: decoded.assets
  };

  return policySchema.parse(policy);
}

/**
 * Represents the type of a CowSwap policy, inferred from the schema.
 */
export type CowSwapPolicyType = z.infer<typeof policySchema>;

/**
 * Utility object for working with CowSwap policies.
 * Includes the schema, encoding, and decoding functions.
 */
export const CowSwapPolicy = {
  /** The type of the policy. */
  type: {} as CowSwapPolicyType,

  /** The version of the policy. */
  version: '1.0.0',

  /** The schema for validating CowSwap policies. */
  schema: policySchema,

  /** Encodes a CowSwap policy into a format suitable for on-chain storage. */
  encode: encodePolicy,

  /** Decodes a CowSwap policy from its on-chain encoded format. */
  decode: decodePolicy,
};