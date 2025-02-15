import { AuthCallbackParams, IRelayPKP, SessionSigs } from '@lit-protocol/types';
import { ethers, providers } from 'ethers';
import { useState } from 'react';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { useRouter } from 'next/router';
import { sepolia, useDisconnect } from 'wagmi';
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { getPkpToolRegistryContract, litNodeClient } from '../utils/lit';
import useAccounts from '../hooks/useAccounts';
import { AUTH_METHOD_SCOPE, LIT_ABILITY, LIT_NETWORK, LIT_RESOURCE_PREFIX } from '@lit-protocol/constants';
import Safe, { Eip1193Provider } from "@safe-global/protocol-kit";
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { LitActionResource } from '@lit-protocol/auth-helpers';
import useAuthenticate from '../hooks/useAuthenticate';

interface DashboardProps {
  currentAccount: IRelayPKP;
  sessionSigs: SessionSigs;
}

export default function Dashboard({
  currentAccount,
  sessionSigs,
}: DashboardProps) {
  const [message, setMessage] = useState<string>('Free the web!');
  const [signature, setSignature] = useState<string>();
  const [recoveredAddress, setRecoveredAddress] = useState<string>();
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { disconnectAsync } = useDisconnect();
  const router = useRouter();
  const { authMethod } = useAuthenticate()
  /**
   * Sign a message with current PKP
   */
  async function signMessageWithPKP() {
    setLoading(true);

    try {
      await litNodeClient.connect();

      const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: sessionSigs,
        pkpPubKey: currentAccount.publicKey,
        litNodeClient: litNodeClient,
      });
      await pkpWallet.init();

      const signature = await pkpWallet.signMessage(message);
      setSignature(signature);

      // Get the address associated with the signature created by signing the message
      const recoveredAddr = ethers.utils.verifyMessage(message, signature);
      setRecoveredAddress(recoveredAddr);

      // Check if the address associated with the signature is the same as the current PKP
      const verified =
        currentAccount.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();
      setVerified(verified);
    } catch (err) {
      console.error(err);
      setError(err);
    }

    setLoading(false);
  }

  async function delegateOwnership(delegatee: string) {
    await litNodeClient.connect();

    const pkpWallet = new PKPEthersWallet({
      controllerSessionSigs: sessionSigs,
      pkpPubKey: currentAccount.publicKey,
      litNodeClient: litNodeClient,
    });
    await pkpWallet.init();

    const toolRegistryContract = getPkpToolRegistryContract({
      rpcUrl: "https://yellowstone-rpc.litprotocol.com",
      contractAddress: '0x2707eabb60D262024F8738455811a338B0ECd3EC',
    }, pkpWallet)
    console.log("Tool Registry Contract")
    console.log(toolRegistryContract.address)
    console.log("Tx Params")
    console.log([
      currentAccount.tokenId
      , [currentAccount.ethAddress]
    ])
    const tx = await toolRegistryContract.addDelegatees(
      currentAccount.tokenId
      , [currentAccount.ethAddress], {
      gasLimit: 300000
    }
    )
    console.log(tx)
    const txReceipt = await tx.wait()
    console.log("Delegate Ownwership Receipt: ", txReceipt)
  }

  async function registerToolsToPKP(toolIpfsCids: string[]) {
    await litNodeClient.connect();

    const pkpWallet = new PKPEthersWallet({
      controllerSessionSigs: sessionSigs,
      pkpPubKey: currentAccount.publicKey,
      litNodeClient: litNodeClient,
    });
    await pkpWallet.init();

    console.log("PKP Wallet initialized");

    const litContracts = new LitContracts({
      signer: pkpWallet,
      network: LIT_NETWORK.DatilDev,
      debug: false,
    });
    await litContracts.connect();

    console.log("Lit Contracts connected");
    const addPermittedActionTxOne = await litContracts.addPermittedAction({
      ipfsId: toolIpfsCids[0],
      authMethodScopes: [AUTH_METHOD_SCOPE.SignAnything],
      pkpTokenId: currentAccount.tokenId,
    });

    console.log("First permitted action added:", addPermittedActionTxOne);

    const addPermittedActionTxTwo = await litContracts.addPermittedAction({
      ipfsId: toolIpfsCids[1],
      authMethodScopes: [AUTH_METHOD_SCOPE.SignAnything],
      pkpTokenId: currentAccount.tokenId,
    });

    console.log("Second permitted action added:", addPermittedActionTxTwo);

    const toolRegistryContract = getPkpToolRegistryContract({
      rpcUrl: "https://yellowstone-rpc.litprotocol.com",
      contractAddress: '0x2707eabb60D262024F8738455811a338B0ECd3EC',
    }, pkpWallet);

    console.log("Tool Registry Contract initialized");
    console.log("Tool Registry Contract address:", toolRegistryContract.address);
    console.log("Tx Params:", {
      tokenId: currentAccount.tokenId,
      toolIpfsCids: toolIpfsCids,
      enabled: true,
    });

    const tx = await toolRegistryContract.registerTools(
      currentAccount.tokenId,
      toolIpfsCids,
      true, {
      gasLimit: 600000
    }
    );

    console.log("Transaction sent:", tx);

    console.log(tx)
    const txReceipt = await tx.wait()
    console.log("Register tools for PKP Receipt: ", txReceipt)
  }

  async function permitToolsForDelegatee(delegatee: string, toolIpfsCids: string[]) {
    await litNodeClient.connect();

    const pkpWallet = new PKPEthersWallet({
      controllerSessionSigs: sessionSigs,
      pkpPubKey: currentAccount.publicKey,
      litNodeClient: litNodeClient,
    });
    await pkpWallet.init();

    console.log("PKP Wallet initialized");

    const toolRegistryContract = getPkpToolRegistryContract({
      rpcUrl: "https://yellowstone-rpc.litprotocol.com",
      contractAddress: '0x2707eabb60D262024F8738455811a338B0ECd3EC',
    }, pkpWallet);

    console.log("Tool Registry Contract initialized");
    console.log("Tool Registry Contract address:", toolRegistryContract.address);
    console.log("Tx Params:", {
      tokenId: currentAccount.tokenId,
      toolIpfsCids: toolIpfsCids,
      delegatee: [delegatee],
    });

    // console.log(await toolRegistryContract.getAllRegisteredTools(currentAccount.tokenId))

    const tx = await toolRegistryContract.permitToolsForDelegatees(
      currentAccount.tokenId,
      [toolIpfsCids[1]],
      [delegatee], {
      gasLimit: 500000
    });

    console.log("Transaction sent:", tx);

    const txReceipt = await tx.wait()
    console.log("permit tools for delegatees Receipt: ", txReceipt)
  }

  async function createSafe(anotherOwner: string) {
    const sessionKeyPair = litNodeClient.getSessionKey();
    const authNeededCallback = async (params: AuthCallbackParams) => {
      const response = await litNodeClient.signSessionKey({
        sessionKey: sessionKeyPair,
        statement: params.statement,
        authMethods: [authMethod],
        pkpPublicKey: currentAccount.publicKey,
        expiration: params.expiration,
        resources: params.resources,
        chainId: 1,
      });
      return response.authSig;
    };
    const provider = new providers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    );
    await litNodeClient.connect();
    console.log({
      pkpPubKey: currentAccount.publicKey,
      provider,
      rpc: "https://eth-sepolia.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      litNodeClient: litNodeClient,
      authContext: {
        getSessionSigsProps: {
          chain: 'ethereum',
          expiration: new Date(Date.now() + 60_000 * 60).toISOString(),
          resourceAbilityRequests: [
            {
              resource: new LitActionResource("*"),
              ability: LIT_ABILITY.PKPSigning,
            },
          ],
          authNeededCallback,
        },
      }
    })
    const pkpWallet = new PKPEthersWallet({
      pkpPubKey: currentAccount.publicKey,
      provider,
      rpc: "https://eth-sepolia.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      litNodeClient: litNodeClient,
      authContext: {
        getSessionSigsProps: {
          chain: 'ethereum',
          expiration: new Date(Date.now() + 60_000 * 60).toISOString(),
          resourceAbilityRequests: [
            {
              resource: new LitActionResource("*"),
              ability: LIT_ABILITY.PKPSigning,
            },
          ],
          authNeededCallback,
        },
      }
    });
    await pkpWallet.init();
    console.log("Provider:", pkpWallet.provider);
    console.log("Chain ID:", await pkpWallet.provider.getNetwork());
    const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer
    console.log("PKP Wallet initialized");
    const protocolKit = await Safe.init({
      provider: pkpWallet,
      predictedSafe: {
        safeAccountConfig: {
          owners: [currentAccount.ethAddress, anotherOwner],
          threshold: 1
        },
        safeDeploymentConfig: {
          saltNonce
        }
      },
    })

    console.log('ProtocolKit initialized:', protocolKit)
    const safeAddress = await protocolKit.getAddress()
    console.log("Safe address: ", safeAddress)
    const deploymentTransaction =
      await protocolKit.createSafeDeploymentTransaction();
    console.log('Deployment transaction:', deploymentTransaction)
    const safeClient = await protocolKit.getSafeProvider().getExternalSigner();
    console.log('Safe client:', safeClient)

    const transactionHash = await safeClient?.sendTransaction({
      to: deploymentTransaction.to as `0x${string}`,
      value: BigInt(deploymentTransaction.value),
      data: deploymentTransaction.data as `0x${string}`,
      chain: sepolia,
      type: 'eip1559',
      maxFeePerGas: BigInt('50000000000'), // 50 gwei
      maxPriorityFeePerGas: BigInt('1500000000'), // 1.5 gwei
      kzg: undefined,
      account: safeClient.account
    });

    console.log('Transaction hash:', transactionHash)

    if (!transactionHash) {
      console.log('Transaction failed')
      return;
    }
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    console.log('Waiting for transaction receipt...')

    const receipt = await publicClient?.waitForTransactionReceipt({
      hash: transactionHash as any,
    });

    console.log('Transaction receipt received')
    console.log(receipt)
  }

  async function handleLogout() {
    try {
      await disconnectAsync();
    } catch (err) { }
    localStorage.removeItem('lit-wallet-sig');
    router.reload();
  }

  return (
    <div className="container">
      <div className="logout-container">
        <button className="btn btn--link" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h1>Ready for the open web</h1>
      <div className="details-card">
        <p>My address: {currentAccount.ethAddress.toLowerCase()}</p>
      </div>
      <div className="divider"></div>
      <div className="message-card">
        <p>Test out your wallet by signing this message:</p>
        <p className="message-card__prompt">{message}</p>
        <button
          onClick={signMessageWithPKP}
          disabled={loading}
          className={`btn ${signature ? (verified ? 'btn--success' : 'btn--error') : ''
            } ${loading && 'btn--loading'}`}
        >
          {signature ? (
            verified ? (
              <span>Verified ✓</span>
            ) : (
              <span>Failed x</span>
            )
          ) : (
            <span>Sign message</span>
          )}
        </button>
        <button
          onClick={async () => {
            try {
              console.log("Delegating Ownership to the agent wallet")
              await delegateOwnership("0x8f4D293136341ba554CbFfF899287826b5BA6a96")
            } catch (e) {
              console.log("Error: ", e)
            }
          }}
          className={`btn `}
        >
          <span>Delegate Ownership</span>
        </button>
        <button
          onClick={async () => {
            try {
              console.log("Configuring Lit Actions to the agent wallet")
              await registerToolsToPKP(["QmSQoeqPcfzx2mPUtv3YKqWrdSpQQ4RX5QtiuUkSmp4Uah", "QmU4Yc4itJZ8iMUu4av53kqaqJAQtxfBZynLC31yjeuPSj"])
            } catch (e) {
              console.log("Error: ", e)
            }
          }}
          className={`btn `}
        >
          <span>Register Tools</span>
        </button>
        <button
          onClick={async () => {
            try {
              console.log("Permitting Tools for the agent wallet")
              await permitToolsForDelegatee("0x9Fc7F5ef77DFe529E11546662E91174a412a3E11", ["QmSQoeqPcfzx2mPUtv3YKqWrdSpQQ4RX5QtiuUkSmp4Uah", "QmU4Yc4itJZ8iMUu4av53kqaqJAQtxfBZynLC31yjeuPSj"])
            } catch (e) {
              console.log("Error: ", e)
            }
          }}
          className={`btn `}
        >
          <span>Permit Tools For Agent Wallet</span>
        </button>
        <button
          onClick={async () => {
            try {
              console.log("Create multi sig safe for user and lit wallet")

              await createSafe("0x8f4D293136341ba554CbFfF899287826b5BA6a96")
            } catch (e) {
              console.log("Error: ", e)
            }
          }}
          className={`btn `}
        >
          <span>Create SAFE</span>
        </button>
      </div>
    </div>
  );
}
