import {
  fetchToolPolicyFromRegistry,
  getPkpInfo,
  getPkpToolRegistryContract,
  NETWORK_CONFIG,
} from '@lit-protocol/aw-tool';

// import {
//   SwapAdvancedSettings,
//   TradeParameters,
//   TradingSdk,
//   SupportedChainId,
//   OrderKind,
//   SigningScheme,
// } from "@cowprotocol/cow-sdk";
import Safe from "@safe-global/protocol-kit"
import { createLitProvider } from './utils/lit-provider';
import { getTokenInfo } from './utils/get-token-info';
// import { getGasData } from './utils/get-gas-data';

declare global {
  // Required Inputs
  const params: {
    pkpEthAddress: string;
    safeAddress: string;
    sellToken: string;
    buyToken: string;
    amount: string;
    chainId: string;
    rpcUrl: string;
  };
}

(async () => {
  try {
    console.log(`Using Lit Network: ${LIT_NETWORK}`);
    console.log(
      `Using PKP Tool Registry Address: ${PKP_TOOL_REGISTRY_ADDRESS}`
    );
    console.log(
      `Using Pubkey Router Address: ${NETWORK_CONFIG[LIT_NETWORK as keyof typeof NETWORK_CONFIG]
        .pubkeyRouterAddress
      }`
    );
    const provider = new ethers.providers.JsonRpcProvider(params.rpcUrl);
    const delegateeAddress = ethers.utils.getAddress(LitAuth.authSigAddress);
    const toolIpfsCid = LitAuth.actionIpfsIds[0];
    const pkpToolRegistryContract = await getPkpToolRegistryContract(
      PKP_TOOL_REGISTRY_ADDRESS
    );
    const pkp = await getPkpInfo(params.pkpEthAddress);
    const litProvider = createLitProvider(params.rpcUrl, pkp.publicKey);
    const tokenInfo = await getTokenInfo(
      provider,
      params.buyToken,
      params.amount,
      params.sellToken,
      params.safeAddress
    )

    const toolPolicy = await fetchToolPolicyFromRegistry(
      pkpToolRegistryContract,
      pkp.tokenId,
      delegateeAddress,
      toolIpfsCid
    );

    if (
      toolPolicy.enabled &&
      toolPolicy.policyIpfsCid !== undefined &&
      toolPolicy.policyIpfsCid !== '0x' &&
      toolPolicy.policyIpfsCid !== ''
    ) {
      console.log(`Executing policy ${toolPolicy.policyIpfsCid}`);
      await Lit.Actions.call({
        ipfsId: toolPolicy.policyIpfsCid,
        params: {
          parentToolIpfsCid: toolIpfsCid,
          pkpToolRegistryContractAddress: PKP_TOOL_REGISTRY_ADDRESS,
          pkpTokenId: pkp.tokenId,
          delegateeAddress,
          toolParameters: {
            safeAddress: params.safeAddress,
            buyToken: params.buyToken,
            sellToken: params.sellToken,
            amount: tokenInfo.buyToken.amount.toString(),
          },
        },
      });
    } else {
      console.log(
        `No policy found for tool ${toolIpfsCid} on PKP ${pkp.tokenId} for delegatee ${delegateeAddress}`
      );
    }

    const safe = await Safe.init(
      {
        provider: litProvider,
        signer: pkp.ethAddress,
        safeAddress: params.safeAddress,
      }
    )
    // const gasData = await getGasData(provider, pkp.ethAddress);
    const storeInterface = new ethers.utils.Interface([
      'function store(uint256)',
      'function retrieve() view returns (uint256)',
    ]);
    // const storeContract = new ethers.Contract('0x891ff4ebB5Db6ad420b721C28cc847dD9389F2F4', storeInterface, provider)
    // const gasLimit = (await storeContract.estimateGas.store(1, { from: pkp.ethAddress })).mul(120).div(100)

    const txData = storeInterface.encodeFunctionData('store', [1]);
    // const storeTx = {
    //   to: '0x891ff4ebB5Db6ad420b721C28cc847dD9389F2F4',
    //   value: "0x0",
    //   data: txData,
    // gasLimit: gasLimit.toHexString(),
    // maxFeePerGas: gasData.maxFeePerGas,
    // maxPriorityFeePerGas: gasData.maxPriorityFeePerGas,
    // nonce: gasData.nonce,
    // chainId: params.chainId,
    // type: 2,
    //   operationType: 0
    // }

    const storeTx = {
      to: '0x891ff4ebB5Db6ad420b721C28cc847dD9389F2F4',
      value: "0x0",
      data: txData,
      operationType: 0
    }

    let safeTx = await safe.createTransaction({
      transactions: [storeTx], onlyCalls: true,
    })

    safeTx = await safe.signTransaction(safeTx)

    const safeTxHash = await safe.executeTransaction(safeTx)
    console.log(safeTxHash)

    Lit.Actions.setResponse({
      response: JSON.stringify({
        status: 'success',
        safeTxHash
      }),
    });
    // const provider = new ethers.providers.JsonRpcProvider(params.rpcUrl);
    // const signer = new VoidSigner(params.pkpEthAddress, provider);
    // // Add your tool execution logic here
    // const traderParams = {
    //   chainId: parseInt(params.chainId) as SupportedChainId,
    //   signer: signer,
    //   appCode: "egg-ai",
    // };
    // const cowSdk = new TradingSdk(traderParams, { enableLogging: false });

    // const parameters: TradeParameters = {
    //   kind: params.isBuy ? OrderKind.BUY : OrderKind.SELL,
    //   sellToken: params.sellToken,
    //   sellTokenDecimals: params.sellTokenDecimals,
    //   buyToken: params.buyToken,
    //   buyTokenDecimals: params.buyTokenDecimals,
    //   amount: params.amount
    // }
    // const advancedParameters: SwapAdvancedSettings = {
    //   quoteRequest: {
    //     signingScheme: SigningScheme.PRESIGN,
    //   },
    // };
    // const orderId = await cowSdk.postSwapOrder(parameters, advancedParameters);
    // console.log(`Order ID: [${orderId}]`);

    // // Get pre-sign transaction
    // const preSignTransaction = await cowSdk.getPreSignTransaction({
    //   orderId,
    //   account: params.pkpEthAddress,
    // });


    // Lit.Actions.setResponse({
    //   response: JSON.stringify({
    //     response: 'Success!',
    //     status: 'success',
    //   }),
    // });
  } catch (err: any) {
    console.error('Error:', err);
    Lit.Actions.setResponse({
      response: JSON.stringify({
        status: 'error',
        error: err.message || String(err),
      }),
    });
  }
})();