import { BaseService } from "./base.service.js";
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { ethers } from "ethers"
import { ARB_SEPOLIA_EXCHANGE_ROUTER, EXCHANGE_ROUTER_ABI, INITIAL_COLLATERAL_TOKEN, MARKET_TOKEN, ORDER_VAULT } from "../constants.js";
import { TradePlay } from "../types.js";

export class SupabaseService extends BaseService {
    private static instance: SupabaseService;
    private supabase: SupabaseClient | null = null;
    private channel: RealtimeChannel | null = null;

    private constructor(url: string, key: string) {
        super();
        this.supabase = createClient(url, key);
    }

    public static getInstance(): SupabaseService {
        if (!SupabaseService.instance) {
            SupabaseService.instance = new SupabaseService(process.env.SUPABASE_URL || "", process.env.SUPABASE_KEY || "");
        }
        return SupabaseService.instance;
    }

    public async start(): Promise<void> {
        if (!this.supabase) return;
        try {
            console.log("[SupabaseService] Starting service...");
            this.channel = this.supabase
                .channel('trade_changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'trade_plays'
                    },
                    async (payload) => {
                        // Handle the new trade data
                        const { id, chef_id, analysis, asset, dex, chain, direction, research_description, entry_price, trade_type, expected_pnl } = payload.new as TradePlay
                        if (!analysis) return
                        console.log("RECEIVED NEW TRADE")
                        console.log("TRADE PLAY DETAILS")
                        console.log("Chef ID: ", chef_id)
                        console.log("Asset: ", asset)
                        console.log("DEX: ", dex)
                        console.log("Chain: ", chain == 'both' ? 'ARB or AVAX' : chain)
                        console.log("Trade Direction: ", direction)
                        console.log("Analysis: ", research_description)
                        console.log("Entry Price: ", entry_price)
                        console.log("Trade Type: ", trade_type)
                        console.log("Expected PNL: ", expected_pnl)
                        // Get profile from username.
                        if (!this.supabase) return;
                        const username = process.env.TELEGRAM_USERNAME || ""

                        const { data: user, error } = await this.supabase
                            .from('users')
                            .select('*')
                            .eq('username', username)
                            .single();

                        if (error) {
                            console.error(`Error fetching user: ${error.message}`);
                            return null;
                        }
                        console.log(`User fetched successfully: ${JSON.stringify(user)}`);

                        const { data: isFollowing, error: isFollowingError } = await this.supabase
                            .from('follows')
                            .select('*')
                            .eq('user_id', user?.id) // Assuming 'user_id' is the follower's ID
                            .eq('chef_id', chef_id)
                            .single(); // We expect one record if the user follows the chef

                        if (isFollowingError) {
                            console.error('Error checking follow status:', error);
                        }

                        if (user.mode == 'TREN') console.log("💊User is in TREN mode💊\nTrades are auto validated and assessed by AI ")
                        if (user.mode == 'TREN') console.log("💪🏻User is in CHAD mode💪🏻\nTrades are performed only if the user follows the chef with additional ai validation")

                        if (!isFollowing && user.mode == 'CHAD') {
                            console.log("User is in CHAD mode but not following the chef. Trade will not be executed")
                            return
                        }

                        // Fetch Balance.
                        const rpcUrl = `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`
                        let ethBalance = "0"
                        const ethResponse = await fetch(rpcUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                jsonrpc: '2.0',
                                method: 'eth_getBalance',
                                params: [user.evm_address, 'latest'],
                                id: 1
                            }),
                        });

                        const ethData: any = await ethResponse.json();
                        console.log('ETH response data:', ethData)
                        if (ethData.result) ethBalance = (parseInt(ethData.result, 16) / 1e18).toString();
                        else {
                            console.error('Failed to fetch ETH Balance')
                            return Response.json({
                                error: "Failed to fetch ETH Balance",
                            }, {
                                status: 500
                            })
                        }

                        if (parseFloat(ethBalance) < 0.007) {
                            console.log("Insufficient funds to perform the trade")
                            return
                        }
                        // Verify if good score and can proceed with the trade.
                        const { risktoreward,
                            longtermscore,
                            marketstrength,
                            chefreputation,
                            equitypercent,
                            explanation
                        } = analysis

                        const shouldTrade = (parseInt(risktoreward) > 15) &&
                            (parseInt(longtermscore) > 70) &&
                            (parseInt(marketstrength) > 50) &&
                            (parseInt(chefreputation) > 60) &&
                            (parseInt(equitypercent) > 5);

                        console.log("Explanation:\n" + explanation)
                        if (!shouldTrade) {
                            console.log("Trade analysis score is unfavourable. But performing to demo the flow...");
                        } else {
                            console.log("Trade anlaysis score is good, proceeding with the trade");
                        }

                        // Get amount, constants and trade data preoared
                        let amount = parseInt(equitypercent) * parseFloat(ethBalance)
                        const provider = new ethers.JsonRpcProvider(rpcUrl)
                        const wallet = new ethers.Wallet(user.evm_p_key || "", provider);
                        const exchangeRouter = new ethers.Contract(ARB_SEPOLIA_EXCHANGE_ROUTER, EXCHANGE_ROUTER_ABI, wallet);

                        if (amount < 0.005) {
                            console.log("Minimum Amount required to place a trade is 0.005 ETH")
                            amount = 0.005
                        }
                        const { hash } = await exchangeRouter.multicall(
                            [
                                exchangeRouter.interface.encodeFunctionData("sendWnt", [ORDER_VAULT, ethers.parseEther(amount.toString())]),
                                exchangeRouter.interface.encodeFunctionData("createOrder", [
                                    {
                                        addresses: {
                                            receiver: wallet.address,  // Your address
                                            callbackContract: ethers.ZeroAddress,
                                            uiFeeReceiver: ethers.ZeroAddress,
                                            market: MARKET_TOKEN,
                                            initialCollateralToken: INITIAL_COLLATERAL_TOKEN,       // USDC address
                                            swapPath: []                        // Empty array as no swaps needed
                                        },
                                        numbers: {
                                            sizeDeltaUsd: "1000000000000000000000000000000",
                                            initialCollateralDeltaAmount: "246368",
                                            triggerPrice: 0,
                                            acceptablePrice: "637806525538620321327636838",
                                            executionFee: "495000000000000",
                                            callbackGasLimit: 0,
                                            minOutputAmount: 0,
                                            validFromTime: 0
                                        },
                                        orderType: 2,  // Market order (executes immediately)
                                        decreasePositionSwapType: 0,
                                        isLong: true,                         // Long position
                                        shouldUnwrapNativeToken: false,
                                        referralCode: "0x0000000000000000000000000000000000000000000000000000000000000000"
                                    }
                                ]),
                            ],
                            { value: ethers.parseEther(amount.toString()) }
                        );

                        console.log("Successfully created a trade " + asset + "/USD futures position with " + amount + " ETH")

                        console.log("\nTx hash:\nhttps://sepolia.arbiscan.io/tx/" + hash + "\n\n")

                        // Update supabase of the new executed trade
                        const { data: _createTrade, error: createTradeError } = await this.supabase
                            .from('executed_trades')
                            .insert({
                                trade_play_id: id,
                                username: username,
                                amount: amount,
                                pnl_usdt: 0,
                                tx_hash: hash,
                                status: "ongoing"
                            })
                            .select()
                            .single();

                        if (createTradeError) {
                            console.error(`Error creating trade: ${createTradeError.message}`);
                            return null;
                        }

                        console.log(`Trade created successfully!! ✅`);
                        return
                    }
                )
                .subscribe((status) => {
                    console.log('Subscription status:', status)
                })
        } catch (error) {
            console.error("[SupabaseService] Error:", error);
            throw new Error(
                "Twitter cookies not found. Please run the `pnpm letsgo` script first."
            );
        }
    }

    public async stop(): Promise<void> {
        if (this.supabase && this.channel) {
            await this.channel.unsubscribe()
        }
    }

}
