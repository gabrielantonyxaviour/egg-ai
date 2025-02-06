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