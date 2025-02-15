

/**
 * Returns the rpc url of the chain
 * @param {string} chainId - The chain Id to cget the rpc url from
 * @returns {string} The rpc url of the chain
 */
export const getNetwork = (chainId: string) => {
    let rpcUrl: string;

    switch (chainId) {
        case '43114': // Avalanche C Mainnet
            rpcUrl = "https://1rpc.io/avax/c"
            break;
        case '42161': // Arbitrum
            rpcUrl = "https://arbitrum.llamarpc.com"
            break;
        case '421614': // Arbitrum Testnet
            rpcUrl = "https://sepolia-rollup.arbitrum.io/rpc"
            break;
        case '43113': // Avalanche Fuji Testnet
            rpcUrl = "https://rpc.ankr.com/avalanche_fuji"
            break;
        default:
            throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    console.log(`Using Rpc url: ${rpcUrl}`);

    return {
        rpcUrl
    };
};
