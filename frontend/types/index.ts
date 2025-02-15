export type User = {
    id: string;
    name: string;
    paused: boolean;
    mode: 'TREN' | 'CHAD';
    agent_url: string;
    pkp_address: string;
    safe_address: string;
    profit_goal?: number | null;
    profit_timeline?: number | null;
    email?: string | null;
};

export type Chef = {
    id: string;
    user_id: string;
    name: string;
    bio: string;
    image: string;
    sub_fee: number;
    niche: string[];
    total_subscribers: number;
    avg_pnl_percentage: number;
    avg_calls_per_day: number;
}
export interface AssetData {
    [ticker: string]: {
        arb: string | null;
        avax: string | null;
    };
}
export type TradePlay = {
    id?: string;
    created_at: string;
    chef_id: string;
    chef?: Chef;
    dex: string;
    asset: string;
    chain: string;
    direction: string;
    entry_price: string;
    trade_type: 'spot' | 'future';
    take_profit: TakeProfit[];
    stop_loss: string;
    dca: DCA[];
    timeframe: string
    leverage: string;
    image: string;
    status: "pending" | "ongoing" | "completed";
    pnl_percentage?: string;
    expected_pnl: string;
    research_description: string;
    analysis?: Analysis;
}

export type Analysis = {
    risktoreward: string;
    longtermscore: string;
    marketstrength: string;
    chefreputation: string;
    equitypercent: string;
    explanation: string;
}

export type TakeProfit = {
    price: string;
    percentage: string;
}

export type DCA = {
    price: string;
    percentage: string;
}

export type ExecutedTrade = {
    id: string;
    trade_play_id: string;
    trade_play: TradePlay;
    created_at: string;
    user_id: string;
    amount: number;
    pnl_usdt: number;
    tx_hash: string;
    status: "ongoing" | "completed";
}