/**
 * Retrieves token information (decimals, balance, and parsed amount).
 * @param {JsonRpcProvider} provider - The Ethereum provider.
 * @returns {Promise<{ buyToken: { decimals: number, balance: any, amount: any, contract: any }, sellToken: { decimals: number, balance: any, contract: any } }>} Token information.
 */
export async function getTokenInfo(
  provider: any,
  buyToken: string,
  amountIn: any,
  sellToken: string,
  address: string
) {
  console.log('Gathering token info...');
  ethers.utils.getAddress(buyToken);
  ethers.utils.getAddress(sellToken);

  // Check code
  const codeIn = await provider.getCode(sellToken);
  if (codeIn === '0x') {
    throw new Error(`No contract found at ${sellToken}`);
  }
  const codeOut = await provider.getCode(buyToken);
  if (codeOut === '0x') {
    throw new Error(`No contract found at ${buyToken}`);
  }

  const buyTokenterface = new ethers.utils.Interface([
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)',
    'function approve(address,uint256) external returns (bool)',
  ]);
  const buyTokenContract = new ethers.Contract(
    buyToken,
    buyTokenterface,
    provider
  );
  const sellTokenContract = new ethers.Contract(
    sellToken,
    buyTokenterface,
    provider
  );

  // Parallel calls
  const [decimalsIn, decimalsOut] = await Promise.all([
    sellTokenContract.decimals(),
    buyTokenContract.decimals(),
  ]);
  console.log('Token decimals:', decimalsIn, decimalsOut);

  const [balanceIn, balanceOut] = await Promise.all([
    sellTokenContract.balanceOf(address),
    buyTokenContract.balanceOf(address),
  ]);
  console.log(
    'Token balances (in/out):',
    balanceIn.toString(),
    balanceOut.toString()
  );

  const _amountIn = ethers.utils.parseUnits(amountIn, decimalsIn);
  if (_amountIn.gt(balanceIn)) {
    throw new Error('Insufficient sellToken balance');
  }
  return {
    buyToken: {
      decimals: decimalsIn,
      balance: balanceIn,
      contract: buyTokenContract,
    },
    sellToken: {
      decimals: decimalsOut,
      amount: _amountIn,
      balance: balanceOut,
      contract: sellTokenContract,
    },
  };
}
