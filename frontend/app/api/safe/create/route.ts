import { arbitrumSepolia, avalancheFuji, sepolia } from "viem/chains"
import Safe from "@safe-global/protocol-kit";
import { createPublicClient, http } from "viem";


export async function POST(request: Request) {
    const TEST_EVM_PRIVATE_KEY = process.env.TEST_EVM_PRIVATE_KEY as `0x${string}`

    try {
        const { pkpEthAddress, additionalSigner } = await request.json()

        const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer

        const arbSepoliaProtocolKit = await Safe.init({
            provider: arbitrumSepolia.rpcUrls.default.http[0],
            signer: TEST_EVM_PRIVATE_KEY,
            predictedSafe: {
                safeAccountConfig: {
                    owners: [pkpEthAddress, additionalSigner],
                    threshold: 1
                },
                safeDeploymentConfig: {
                    saltNonce
                }
            },
        })

        const safeAddress = await arbSepoliaProtocolKit.getAddress();

        const isArbSepoliaSafeDeployed = arbSepoliaProtocolKit.isSafeDeployed()
        if (!isArbSepoliaSafeDeployed) {
            const arbSepoliaDeploymentTransaction =
                await arbSepoliaProtocolKit.createSafeDeploymentTransaction();

            const arbSepoliaSafeClient = await arbSepoliaProtocolKit.getSafeProvider().getExternalSigner();

            const arbSepoliaTransactionHash = await arbSepoliaSafeClient?.sendTransaction({
                to: arbSepoliaDeploymentTransaction.to,
                value: BigInt(arbSepoliaDeploymentTransaction.value),
                data: arbSepoliaDeploymentTransaction.data as `0x${string}`,
                chain: arbitrumSepolia
            });

            const arbSepoliaPublicClient = createPublicClient({
                chain: arbitrumSepolia,
                transport: http(),
            });

            await arbSepoliaPublicClient?.waitForTransactionReceipt({
                hash: arbSepoliaTransactionHash as `0x${string}`,
            });
        }


        const avaxFujiProtocolKit = await Safe.init({
            provider: avalancheFuji.rpcUrls.default.http[0],
            signer: TEST_EVM_PRIVATE_KEY,
            predictedSafe: {
                safeAccountConfig: {
                    owners: [pkpEthAddress, additionalSigner],
                    threshold: 1
                },
                safeDeploymentConfig: {
                    saltNonce
                }
            },
        })
        const isAvaxFujiSafeDeployed = avaxFujiProtocolKit.isSafeDeployed()

        if (!isAvaxFujiSafeDeployed) {
            const avaxFujiDeploymentTransaction =
                await avaxFujiProtocolKit.createSafeDeploymentTransaction();

            const avaxFujiSafeClient = await avaxFujiProtocolKit.getSafeProvider().getExternalSigner();

            const avaxFujiTransactionHash = await avaxFujiSafeClient?.sendTransaction({
                to: avaxFujiDeploymentTransaction.to,
                value: BigInt(avaxFujiDeploymentTransaction.value),
                data: avaxFujiDeploymentTransaction.data as `0x${string}`,
                chain: avalancheFuji
            });

            const avaxFujiPublicClient = createPublicClient({
                chain: avalancheFuji,
                transport: http(),
            });

            await avaxFujiPublicClient?.waitForTransactionReceipt({
                hash: avaxFujiTransactionHash as `0x${string}`,
            });
        }

        return Response.json({
            safeAddress: safeAddress,
        })
    } catch (error) {
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

