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
    name?: string | null;
    bio?: string | null;
    image?: string | null;
    sub_fee?: string | null;

}

export type TradePlay = {
    id?: string;
    created_at?: string;
    chef_id: string;
    dex: string;
    asset: string;
    chain: string;
    direction: string;
    entry_price: number;
    trade_type: 'spot' | 'future';
    take_profit: TakeProfit[];
    stop_loss: number;
    dca: DCA[];
    timeframe: string
    leverage: number;
    image: string;
    status: "ongoing" | "completed";
    pnl_percentage: number | null;
    expected_pnl: number;
    research_description: string;
}

export type TakeProfit = {
    price: number;
    percent: number;
}

export type DCA = {
    price: number;
    percent: number;
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