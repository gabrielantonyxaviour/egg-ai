import { ethers } from 'ethers';
import { deployments, EXCHANGE_ROUTER_ABI, MARKET_TOKEN_BYTECODE, READER_ABI } from '../constants.mjs';
import dotenv from 'dotenv'

dotenv.config()


async function main(chain) {
    const RPC_URL = `https://${chain}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
    console.log(`RPC URL: ${RPC_URL}`);
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log(`Wallet address: ${wallet.address}`);

    const exchangeRouter = new ethers.Contract(deployments[chain].exchangeRouter, EXCHANGE_ROUTER_ABI, wallet);
    console.log(`Exchange Router address: ${exchangeRouter.address}`);

    const createOrderTx = await exchangeRouter.multicall(
        [
            exchangeRouter.interface.encodeFunctionData("sendWnt", [deployments[chain].orderVault, "500000000000000"]),
            exchangeRouter.interface.encodeFunctionData("createOrder", [
                {
                    addresses: {
                        receiver: wallet.address,  // Your address
                        callbackContract: ethers.constants.AddressZero,
                        uiFeeReceiver: ethers.constants.AddressZero,
                        market: "0xBb532Ab4923C23c2bfA455151B14fec177a34C0D",
                        initialCollateralToken: "0x3321Fd36aEaB0d5CdfD26f4A3A93E2D2aAcCB99f",       // USDC address
                        swapPath: []                        // Empty array as no swaps needed
                    },
                    numbers: {
                        sizeDeltaUsd: "1000000000000000000000000000000",  // Position size of $100 USD
                        initialCollateralDeltaAmount: "246368", // 0.01 ETH as collateral
                        triggerPrice: 0,                    // 0 for market orders
                        acceptablePrice: "637806525538620321327636838", // Max acceptable entry price (adjust based on current price)
                        executionFee: "495000000000000",
                        callbackGasLimit: 0,
                        minOutputAmount: 0,
                        validFromTime: 0
                    },
                    orderType: 2,  // Market order (executes immediately)
                    decreasePositionSwapType: 0,
                    isLong: true,                         // Long position
                    shouldUnwrapNativeToken: true,
                    referralCode: "0x0000000000000000000000000000000000000000000000000000000000000000"
                }
            ]),
        ],
        { value: "500000000000000" }
    );
    console.log(createOrderTx)
}

main('arb-sepolia')
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
