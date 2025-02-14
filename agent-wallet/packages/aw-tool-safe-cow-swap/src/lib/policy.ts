import { z } from 'zod';
import { ethers } from 'ethers';

/**
 * Schema for validating a SafeCowSwap policy.
 * Ensures the policy has the correct structure and valid values.
 */
const policySchema = z.object({
  /** The type of policy, must be `SafeCowSwap`. */
  type: z.literal('SafeCowSwap'),

  /** The version of the policy. */
  version: z.string(),

  /** The buy and sell tokens should be one of these values */
  allowedTokenAddresses: z.array(z.string())
});

/**
 * Encodes a SafeCowSwap policy into a format suitable for on-chain storage.
 * @param policy - The SafeCowSwap policy to encode.
 * @returns The encoded policy as a hex string.
 * @throws If the policy does not conform to the schema.
 */
function encodePolicy(policy: SafeCowSwapPolicyType): string {
  // Validate the policy against the schema
  policySchema.parse(policy);

  return ethers.utils.defaultAbiCoder.encode(
    ['tuple(string[] allowedTokenAddresses)'],
    [policy]
  );
}

/**
 * Decodes a SafeCowSwap policy from its on-chain encoded format.
 * @param encodedPolicy - The encoded policy as a hex string.
 * @returns The decoded SafeCowSwap policy.
 * @throws If the encoded policy is invalid or does not conform to the schema.
 */
function decodePolicy(encodedPolicy: string): SafeCowSwapPolicyType {
  const decoded = ethers.utils.defaultAbiCoder.decode(
    ['tuple(string[] allowedTokenAddresses)'],
    encodedPolicy
  )[0];

  const policy: SafeCowSwapPolicyType = {
    type: 'SafeCowSwap',
    version: '1.0.0',
    allowedTokenAddresses: decoded.allowedTokenAddresses
  };

  return policySchema.parse(policy);
}

/**
 * Represents the type of a SafeCowSwap policy, inferred from the schema.
 */
export type SafeCowSwapPolicyType = z.infer<typeof policySchema>;

/**
 * Utility object for working with SafeCowSwap policies.
 * Includes the schema, encoding, and decoding functions.
 */
export const SafeCowSwapPolicy = {
  /** The type of the policy. */
  type: {} as SafeCowSwapPolicyType,

  /** The version of the policy. */
  version: '1.0.0',

  /** The schema for validating SafeCowSwap policies. */
  schema: policySchema,

  /** Encodes a SafeCowSwap policy into a format suitable for on-chain storage. */
  encode: encodePolicy,

  /** Decodes a SafeCowSwap policy from its on-chain encoded format. */
  decode: decodePolicy,
};