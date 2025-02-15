import { z } from 'zod';
import { ethers } from 'ethers';

/**
 * Schema for validating a AwToolSafeInit policy.
 * Ensures the policy has the correct structure and valid values.
 */
const policySchema = z.object({
  /** The type of policy, must be `AwToolSafeInit`. */
  type: z.literal('AwToolSafeInit'),

  /** The version of the policy. */
  version: z.string(),

  /** The message must begin with one of these values */
  allowedPrefixes: z.string(),

  /** The exact character length of the address */
  characterLength: z.string()
});

/**
 * Encodes a AwToolSafeInit policy into a format suitable for on-chain storage.
 * @param policy - The AwToolSafeInit policy to encode.
 * @returns The encoded policy as a hex string.
 * @throws If the policy does not conform to the schema.
 */
function encodePolicy(policy: AwToolSafeInitPolicyType): string {
  // Validate the policy against the schema
  policySchema.parse(policy);

  return ethers.utils.defaultAbiCoder.encode(
    ['tuple(string allowedPrefixes, string characterLength)'],
    [policy]
  );
}

/**
 * Decodes a AwToolSafeInit policy from its on-chain encoded format.
 * @param encodedPolicy - The encoded policy as a hex string.
 * @returns The decoded AwToolSafeInit policy.
 * @throws If the encoded policy is invalid or does not conform to the schema.
 */
function decodePolicy(encodedPolicy: string): AwToolSafeInitPolicyType {
  const decoded = ethers.utils.defaultAbiCoder.decode(
    ['tuple(string allowedPrefixes, string characterLength)'],
    encodedPolicy
  )[0];

  const policy: AwToolSafeInitPolicyType = {
    type: 'AwToolSafeInit',
    version: '1.0.0',
    allowedPrefixes: decoded.allowedPrefixes,
    characterLength: decoded.characterLength
  };

  return policySchema.parse(policy);
}

/**
 * Represents the type of a AwToolSafeInit policy, inferred from the schema.
 */
export type AwToolSafeInitPolicyType = z.infer<typeof policySchema>;

/**
 * Utility object for working with AwToolSafeInit policies.
 * Includes the schema, encoding, and decoding functions.
 */
export const AwToolSafeInitPolicy = {
  /** The type of the policy. */
  type: {} as AwToolSafeInitPolicyType,

  /** The version of the policy. */
  version: '1.0.0',

  /** The schema for validating AwToolSafeInit policies. */
  schema: policySchema,

  /** Encodes a AwToolSafeInit policy into a format suitable for on-chain storage. */
  encode: encodePolicy,

  /** Decodes a AwToolSafeInit policy from its on-chain encoded format. */
  decode: decodePolicy,
};