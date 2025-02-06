export interface User {
    username: string;
    name?: string;
    image?: string;
    bio?: string;
    paused?: boolean;
    address?: string;
    p_key?: string;
    mode?: "TREN" | "CHAD";
    profit_timeline?: number;
    profit_goal?: number;
}