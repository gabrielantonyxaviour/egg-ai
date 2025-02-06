export type User = {
    username: string;
    name?: string | null;
    image?: string | null;
    bio?: string | null;
    paused?: boolean | null;
    evm_address?: string | null;
    evm_p_key?: string | null;
    mode: 'TREN' | 'CHAD';
    profit_timeline?: number | null;
    profit_goal?: number | null;
    solana_address?: string | null;
    solana_p_key?: string | null;
    sei_address?: string | null;
    sei_p_key?: string | null;
};