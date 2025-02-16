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
    safeAddress: string;
    buyToken: string;
    sellToken: string;
    amount: string;
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
      'assets'
    ]
  );

  let assets: string[] = [];

  for (const parameter of policyParameters) {
    const value = ethers.utils.toUtf8String(parameter.value);

    switch (parameter.name) {
      case 'assets':
        assets = JSON.parse(value);
        assets = assets.map((addr: string) =>
          ethers.utils.getAddress(addr)
        );
        console.log(`Formatted assets: ${assets}`);
        break;
    }
  }
  console.log("Validating assets...");
  if (!assets.includes(toolParameters.sellToken) || !assets.includes(toolParameters.buyToken)) {
    throw new Error(`Asset ${toolParameters.sellToken} or ${toolParameters.buyToken} is not allowed`);
  }
  console.log('Policy parameters validated');
})();