import {
  checkLitAuthAddressIsDelegatee,
  getPkpToolRegistryContract,
  getPolicyParameters,
} from '@lit-protocol/aw-tool';

declare global {
  // Required Inputs
  const parentToolIpfsCid: string;
  const pkpToolRegistryContractAddress: string;
  const pkpTokenId: string;
  const delegateeAddress: string;
  const toolParameters: {
    signer: string;
    isTestnet: boolean;
  };
}

(async () => {
  const pkpToolRegistryContract = await getPkpToolRegistryContract(
    pkpToolRegistryContractAddress
  );

  const isDelegatee = await checkLitAuthAddressIsDelegatee(
    pkpToolRegistryContract,
    pkpTokenId
  );
  if (!isDelegatee) {
    throw new Error(
      `Session signer ${ethers.utils.getAddress(
        LitAuth.authSigAddress
      )} is not a delegatee for PKP ${pkpTokenId}`
    );
  }

  // Get policy parameters
  const policyParameters = await getPolicyParameters(
    pkpToolRegistryContract,
    pkpTokenId,
    parentToolIpfsCid,
    delegateeAddress,
    [
      'allowedPrefixes',
      'characterLength'
    ]
  );

  console.log(
    `Retrieved policy parameters: ${JSON.stringify(policyParameters)}`
  );

  // Add your policy validation logic here using policyParameters
  let allowedPrefixes: string;
  let characterLength: string;
  for (const parameter of policyParameters) {
    const value = ethers.utils.toUtf8String(parameter.value);
    switch (parameter.name) {
      case 'allowedPrefixes':
        allowedPrefixes = value;
        if (!toolParameters.signer.startsWith(allowedPrefixes)) {
          throw new Error(`Signer ${toolParameters.signer} does not start with allowed prefix ${allowedPrefixes}`);
        }
        console.log(`Formatted allowedPrefixes: ${allowedPrefixes}`);
        break;
      case 'characterLength':
        characterLength = value;
        if (toolParameters.signer.length !== parseInt(characterLength)) {
          throw new Error(`Signer ${toolParameters.signer} does not have character length of ${characterLength}`);
        }
        console.log(`Formatted characterLength: ${characterLength}`);
        break;
    }
  }
})();