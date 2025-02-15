import { arbitrumSepolia, avalancheFuji, sepolia } from "viem/chains"
import Safe from "@safe-global/protocol-kit";
import { createPublicClient, http } from "viem";

export async function POST(request: Request) {
    const TEST_EVM_PRIVATE_KEY = process.env.TEST_EVM_PRIVATE_KEY as `0x${string}`

    try {
        console.log("Received request to create Safe");
        const { pkpEthAddress, additionalSigner } = await request.json()
        console.log("Request JSON parsed:", { pkpEthAddress, additionalSigner });

        const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer
        console.log("Generated saltNonce:", saltNonce);

        console.log("Initializing Safe on Arbitrum Sepolia");
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
        });

        const safeAddress = await arbSepoliaProtocolKit.getAddress();
        console.log("Safe address on Arbitrum Sepolia:", safeAddress);

        const isArbSepoliaSafeDeployed = await arbSepoliaProtocolKit.isSafeDeployed();
        console.log("Is Safe deployed on Arbitrum Sepolia:", isArbSepoliaSafeDeployed);

        if (!isArbSepoliaSafeDeployed) {
            console.log("Creating deployment transaction for Arbitrum Sepolia");
            const arbSepoliaDeploymentTransaction = await arbSepoliaProtocolKit.createSafeDeploymentTransaction();

            const arbSepoliaSafeClient = await arbSepoliaProtocolKit.getSafeProvider().getExternalSigner();
            console.log("Sending deployment transaction for Arbitrum Sepolia");
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

            console.log("Waiting for transaction receipt on Arbitrum Sepolia");
            await arbSepoliaPublicClient?.waitForTransactionReceipt({
                hash: arbSepoliaTransactionHash as `0x${string}`,
            });
        }

        console.log("Initializing Safe on Avalanche Fuji");
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
        });

        const isAvaxFujiSafeDeployed = await avaxFujiProtocolKit.isSafeDeployed();
        console.log("Is Safe deployed on Avalanche Fuji:", isAvaxFujiSafeDeployed);

        if (!isAvaxFujiSafeDeployed) {
            console.log("Creating deployment transaction for Avalanche Fuji");
            const avaxFujiDeploymentTransaction = await avaxFujiProtocolKit.createSafeDeploymentTransaction();

            const avaxFujiSafeClient = await avaxFujiProtocolKit.getSafeProvider().getExternalSigner();
            console.log("Sending deployment transaction for Avalanche Fuji");
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

            console.log("Waiting for transaction receipt on Avalanche Fuji");
            await avaxFujiPublicClient?.waitForTransactionReceipt({
                hash: avaxFujiTransactionHash as `0x${string}`,
            });
        }

        console.log("Safe creation process completed successfully");
        return Response.json({
            safeAddress: safeAddress,
        });
    } catch (error) {
        console.error("Error during Safe creation process:", error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
