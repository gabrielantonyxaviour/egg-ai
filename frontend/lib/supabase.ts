import { User } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUser(username: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

    if (error) return null
    return data
}
export async function createUser({
    username, name, image, evm_address, evm_p_key, sei_address, sei_p_key, solana_address, solana_p_key,
}: {
    username: string;
    name: string;
    image?: string;
    evm_address?: string;
    evm_p_key?: string;
    sei_address?: string;
    sei_p_key?: string;
    solana_address?: string;
    solana_p_key?: string;
}): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, name, image, evm_address, evm_p_key, sei_address, sei_p_key, solana_address, solana_p_key }]).select().single()
    if (error) return null
    return data
}

export async function updateUser({
    username, name, image, evm_address, evm_p_key, sei_address, sei_p_key, solana_address, solana_p_key, bio, mode, profit_goal, profit_timeline, paused
}: {
    username: string;
    name?: string;
    image?: string;
    evm_address?: string;
    evm_p_key?: string;
    sei_address?: string;
    sei_p_key?: string;
    solana_address?: string;
    solana_p_key?: string;
    bio?: string;
    mode?: string;
    profit_goal?: number;
    profit_timeline?: number;
    paused?: boolean;
}): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .update({ name, image, evm_address, evm_p_key, sei_address, sei_p_key, solana_address, solana_p_key, bio, mode, profit_goal, profit_timeline, paused })
        .eq('username', username).select().single()
    if (error) return null
    return data
}