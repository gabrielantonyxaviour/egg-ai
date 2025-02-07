export type User = {
    username: string;
    name?: string | null;
    image?: string | null;
    paused?: boolean | null;
    evm_address?: string | null;
    evm_p_key?: string | null;
    mode: 'TREN' | 'CHAD';
    profit_timeline?: number | null;
    profit_goal?: number | null;
    solana_address?: string | null;
    solana_p_key?: string | null;
};


export type Chef = {
    id: string;
    username: string;
    name: string | null;
    bio: string | null;
    image: string | null;
    sub_fee: number | null;
    niche: string | null;
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
    created_at?: string;
    chef_id: string;
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
    pnl_percentage: string | null;
    expected_pnl: string;
    research_description: string;
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
    created_at: string;
    username: string;
    price: number;
    amount: number;
    pnl_usdt: number;
    status: "ongoing" | "completed";
}