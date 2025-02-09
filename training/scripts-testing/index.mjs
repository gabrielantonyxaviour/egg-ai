import { ethers } from 'ethers';
require('dotenv').config();

function expandDecimals(n, decimals) {
    return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(decimals));
}

function decimalToFloat(value) {
    return ethers.BigNumber.from(value).mul(ethers.BigNumber.from(10).pow(30));
}


async function main() {
    // Connect to provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Contract instances
    const exchangeRouter = new ethers.Contract(
        process.env.EXCHANGE_ROUTER_ADDRESS,
        EXCHANGE_ROUTER_ABI,
        wallet
    );

    // Configuration
    const config = {
        depositVault: process.env.DEPOSIT_VAULT_ADDRESS,
        orderVault: process.env.ORDER_VAULT_ADDRESS,
        btcUsdMarket: process.env.BTC_USD_MARKET_ADDRESS,
        btcUsdMarketLongToken: process.env.BTC_USD_MARKET_LONG_TOKEN,
        btcUsdMarketShortToken: process.env.BTC_USD_MARKET_SHORT_TOKEN,
        executionFee: expandDecimals(1, 18), // 1 ETH execution fee
        ethDepositAmount: expandDecimals(1, 18), // 1 ETH deposit
        positionSizeUsd: decimalToFloat(10000), // $10,000 position size
        triggerPrice: decimalToFloat(40000), // $40,000 BTC price
        acceptablePrice: decimalToFloat(40100), // $40,100 max acceptable price
    };

    try {
        console.log('Creating deposit...');
        // Create deposit transaction
        const depositTx = await exchangeRouter.multicall(
            [
                exchangeRouter.interface.encodeFunctionData("sendWnt", [
                    config.depositVault,
                    config.ethDepositAmount
                ]),
                exchangeRouter.interface.encodeFunctionData("createDeposit", [
                    {
                        receiver: wallet.address,
                        callbackContract: ethers.constants.AddressZero,
                        uiFeeReceiver: ethers.constants.AddressZero,
                        market: config.btcUsdMarket,
                        initialLongToken: config.btcUsdMarketLongToken,
                        initialShortToken: config.btcUsdMarketShortToken,
                        longTokenSwapPath: [],
                        shortTokenSwapPath: [],
                        minMarketTokens: 0,
                        shouldUnwrapNativeToken: true,
                        executionFee: config.executionFee,
                        callbackGasLimit: 200000
                    }
                ])
            ],
            {
                value: config.ethDepositAmount.add(config.executionFee),
                gasLimit: 2000000
            }
        );

        console.log('Deposit transaction sent:', depositTx.hash);
        await depositTx.wait();
        console.log('Deposit transaction confirmed');

        console.log('Creating order...');
        // Create order transaction
        const orderTx = await exchangeRouter.multicall(
            [
                exchangeRouter.interface.encodeFunctionData("sendWnt", [
                    config.orderVault,
                    config.executionFee
                ]),
                exchangeRouter.interface.encodeFunctionData("createOrder", [
                    {
                        addresses: {
                            receiver: wallet.address,
                            callbackContract: ethers.constants.AddressZero,
                            uiFeeReceiver: ethers.constants.AddressZero,
                            market: config.btcUsdMarket,
                            initialCollateralToken: config.btcUsdMarketLongToken,
                            swapPath: []
                        },
                        numbers: {
                            sizeDeltaUsd: config.positionSizeUsd,
                            initialCollateralDeltaAmount: 0,
                            triggerPrice: config.triggerPrice,
                            acceptablePrice: config.acceptablePrice,
                            executionFee: config.executionFee,
                            callbackGasLimit: 200000,
                            minOutputAmount: 0,
                            validFromTime: 0
                        },
                        orderType: 3, // LimitIncrease
                        decreasePositionSwapType: 2, // SwapCollateralTokenToPnlToken
                        isLong: true,
                        shouldUnwrapNativeToken: true,
                        referralCode: ethers.constants.HashZero
                    }
                ])
            ],
            {
                value: config.executionFee,
                gasLimit: 2000000
            }
        );

        console.log('Order transaction sent:', orderTx.hash);
        await orderTx.wait();
        console.log('Order transaction confirmed');

    } catch (error) {
        console.error('Error:', error);
    }
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });