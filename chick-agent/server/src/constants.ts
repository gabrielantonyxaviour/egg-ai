export const arbDeployments = {
    exchangeRouter: "",

}

export const avaxDeployments = {
    exchangeRouter: "",

}

export const arbSepoliaDeployments = {
    exchangeRouter: "",

}


export const avaxFujiDeployments = {
    exchangeRouter: "",
}
export const ARB_SEPOLIA_EXCHANGE_ROUTER = "0xbbb774b00102e2866677b9d238b2Ee489779E532";
export const WRAPPED_NATIVE_TOKEN = "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73";
export const USDC_TOKEN = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
export const ORDER_VAULT = "0xD2A2044f62D7cD77470AC237408f9f59AcB5965E"
export const MARKET_TOKEN = "0xBb532Ab4923C23c2bfA455151B14fec177a34C0D"
export const INITIAL_COLLATERAL_TOKEN = "0x3321Fd36aEaB0d5CdfD26f4A3A93E2D2aAcCB99f"
export const EXCHANGE_ROUTER_ABI = [
    {
        "inputs": [
            {
                "internalType": "bytes[]",
                "name": "data",
                "type": "bytes[]"
            }
        ],
        "name": "multicall",
        "outputs": [
            {
                "internalType": "bytes[]",
                "name": "results",
                "type": "bytes[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "sendWnt",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "callbackContract",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "uiFeeReceiver",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "market",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "initialLongToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "initialShortToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "longTokenSwapPath",
                        "type": "address[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "shortTokenSwapPath",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minMarketTokens",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "shouldUnwrapNativeToken",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "executionFee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "callbackGasLimit",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DepositUtils.CreateDepositParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "createDeposit",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "receiver",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "callbackContract",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "uiFeeReceiver",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "market",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "initialCollateralToken",
                                "type": "address"
                            },
                            {
                                "internalType": "address[]",
                                "name": "swapPath",
                                "type": "address[]"
                            }
                        ],
                        "internalType": "struct IBaseOrderUtils.CreateOrderParamsAddresses",
                        "name": "addresses",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "sizeDeltaUsd",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "initialCollateralDeltaAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "triggerPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "acceptablePrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "executionFee",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "callbackGasLimit",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "minOutputAmount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct IBaseOrderUtils.CreateOrderParamsNumbers",
                        "name": "numbers",
                        "type": "tuple"
                    },
                    {
                        "internalType": "enum Order.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum Order.DecreasePositionSwapType",
                        "name": "decreasePositionSwapType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "isLong",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "shouldUnwrapNativeToken",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "referralCode",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct IBaseOrderUtils.CreateOrderParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "createOrder",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
];