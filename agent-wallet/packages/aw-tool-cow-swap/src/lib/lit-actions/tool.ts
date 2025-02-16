import {
  fetchToolPolicyFromRegistry,
  getPkpInfo,
  getPkpToolRegistryContract,
  NETWORK_CONFIG,
} from '@lit-protocol/aw-tool';
import {
  SwapAdvancedSettings,
  TradeParameters,
  TradingSdk,
  SupportedChainId,
  OrderKind,
  SigningScheme,
} from "@cowprotocol/cow-sdk";
import Safe from "@safe-global/protocol-kit"
import { createLitProvider } from './utils/lit-provider';
import { getTokenInfo } from './utils/get-token-info';
import { constants } from "../../constants"
import { VoidSigner } from "@ethersproject/abstract-signer";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createPublicClient, http } from 'viem';
import { sepolia, arbitrum } from "viem/chains"

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

    const traderParams = {
      chainId: parseInt(params.chainId) as SupportedChainId,
      signer: new VoidSigner(
        params.safeAddress,
        new JsonRpcProvider(params.rpcUrl)
      ),
      appCode: "egg-ai",
    };
    const cowSdk = new TradingSdk(traderParams, { enableLogging: false });

    const parameters: TradeParameters = {
      kind: OrderKind.BUY,
      sellToken: params.sellToken,
      sellTokenDecimals: tokenInfo.sellToken.decimals,
      buyToken: params.buyToken,
      buyTokenDecimals: tokenInfo.buyToken.decimals,
      amount: params.amount,
    };

    const advancedParameters: SwapAdvancedSettings = {
      quoteRequest: {
        signingScheme: SigningScheme.PRESIGN,
      },
    };

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
            amount: tokenInfo.sellToken.amount.toString(),
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

    const publicClient = createPublicClient({
      chain: params.chainId == "11155111" ? sepolia : arbitrum,
      transport: http(params.rpcUrl),
    });
    const tokenInterface = new ethers.utils.Interface([
      'function approve(address spender, uint256 amount) external returns (bool)',
    ]);

    const txData = tokenInterface.encodeFunctionData('approve', [constants[params.chainId].GPv2VaultRelayer, tokenInfo.sellToken.amount]);
    const approveTx = {
      to: params.sellToken,
      value: "0x0",
      data: txData,
      operationType: 0
    }

    let safeTx = await safe.createTransaction({
      transactions: [approveTx], onlyCalls: true,
    })

    safeTx = await safe.signTransaction(safeTx)

    const { hash: safeApproveTxHash } = await safe.executeTransaction(safeTx)
    console.log("Approve Transaction ")
    console.log(safeApproveTxHash)

    await publicClient.waitForTransactionReceipt({
      hash: safeApproveTxHash as `0x${string}`,
    });

    const orderId = await cowSdk.postSwapOrder(parameters, advancedParameters);
    console.log(`Order ID: [${orderId}]`);

    const preSignTransaction = await cowSdk.getPreSignTransaction({
      orderId,
      account: params.safeAddress,
    });

    const safePreSignTx = {
      to: preSignTransaction.to,
      value: preSignTransaction.value,
      data: preSignTransaction.data,
      operationType: 0,
    };

    let presignSafeTx = await safe.createTransaction({
      transactions: [safePreSignTx],
      onlyCalls: true,
    });
    presignSafeTx = await safe.signTransaction(presignSafeTx);

    const { hash: safePresignTxHash } = await safe.executeTransaction(presignSafeTx);
    console.log("Presign Transaction ")
    console.log(safePresignTxHash)

    await publicClient.waitForTransactionReceipt({
      hash: safePresignTxHash as `0x${string}`,
    });

    Lit.Actions.setResponse({
      response: JSON.stringify({
        status: 'success',
        approveTx: safeApproveTxHash,
        presignTx: safePresignTxHash
      }),
    });

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