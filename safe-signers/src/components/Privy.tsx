import privyLogo from '@/assets/privy_logo.png'
import { EIP1193Provider, PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import Image from 'next/image'
import Safe, { Eip1193Provider } from "@safe-global/protocol-kit";
import { useEffect, useState } from 'react'
import { WalletClient, createPublicClient, createWalletClient, custom, http } from 'viem'
import { arbitrumSepolia, avalancheFuji, sepolia } from 'viem/chains'

// Get the APP_ID from the Privy dashboard.
const APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID

function PrivyApp() {
  const { login, logout, ready, authenticated } = usePrivy()
  const { ready: readyWallets, wallets } = useWallets()
  const [provider, setProvider] = useState<WalletClient | null>(null)
  const [signer, setSigner] = useState<string | null>(null)
  const aiAgentAddress = process.env.AGENT_ADDRESS as string
  useEffect(() => {
    const init = async () => {
      if (!APP_ID) return

      if (ready && authenticated && readyWallets && wallets.length > 0) {
        const ethereumProvider = await wallets[0].getEthereumProvider()
        const client = createWalletClient({
          chain: arbitrumSepolia,
          transport: custom(ethereumProvider)
        })

        setProvider(client)
        setSigner(wallets[0].address)
      }
    }
    init()
  }, [ready, authenticated, readyWallets, wallets])

  useEffect(() => {
    (async function () {

    })()
  }, [provider, signer])

  const connect = async () => {
    try {
      login()
    } catch (error) {
      console.error(error)
    }
  }

  const disconnect = async () => {
    logout()

    setProvider(null)
    setSigner(null)
  }

  const unloggedInView = <button onClick={connect}>Connect</button>

  const loggedInView = <button onClick={disconnect}>Disconnect</button>

  return (
    <div className="card">
      <div className="title">
        <Image src={privyLogo} alt="Magic" height="30" />
        <h2>Privy</h2>
      </div>
      <pre>{signer || 'Not connected'}</pre>
      {signer ? loggedInView : unloggedInView}
      <button
        style={{
          marginLeft: "10px",
        }} onClick={async () => {
          if (provider && signer) {
            console.log('Provider:', provider)
            console.log('Signer:', signer)
            const protocolKit = await Safe.init({
              provider: provider as Eip1193Provider,
              predictedSafe: {
                safeAccountConfig: {
                  owners: [signer, aiAgentAddress],
                  threshold: 1
                },
                safeDeploymentConfig: {
                  saltNonce: '1242342'
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
              chain: arbitrumSepolia,
            });
            console.log('Transaction hash:', transactionHash)

            if (!transactionHash) {
              console.log('Transaction failed')
              return;
            }
            const publicClient = createPublicClient({
              chain: arbitrumSepolia,
              transport: http(),
            });

            console.log('Waiting for transaction receipt...')

            const receipt = await publicClient?.waitForTransactionReceipt({
              hash: transactionHash as any,
            });

            console.log('Transaction receipt received')
            console.log(receipt)
            console.log(`A new Safe multisig was successfully deployed on Arbitrum Sepolia. You can see it live at https://app.safe.global/home?safe=sep:${safeAddress}. The saltNonce used was 1234.`);
          } else {
            console.log('Provider or signer not available')
          }
        }}>Deploy Safe</button>
    </div>
  )
}

export default function PrivyComponent() {
  if (!APP_ID) {
    return (
      <div className="card">
        <div className="title">
          <Image src={privyLogo} alt="Magic" height="30" />
          <h2>Privy</h2>
        </div>
        <pre>Not configured</pre>
      </div>
    )
  }

  return (
    <PrivyProvider
      appId={APP_ID}
      config={{
        defaultChain: arbitrumSepolia,
        supportedChains: [arbitrumSepolia, avalancheFuji],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets' // defaults to 'off'
        }
      }}
    >
      <PrivyApp />
    </PrivyProvider>
  )
}
