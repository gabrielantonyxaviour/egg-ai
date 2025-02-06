import { Chef, User } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUser(username: string): Promise<User | null> {
    console.log(`Fetching user with username: ${username}`);
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error) {
        console.error(`Error fetching user: ${error.message}`);
        return null;
    }
    console.log(`User fetched successfully: ${JSON.stringify(data)}`);
    return data;
}


export async function getChef(username: string): Promise<Chef | null> {
    console.log(`Fetching chef with username: ${username}`);

    const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .eq('username', username)
        .single();


    if (error) {
        console.error(`Error fetching chef: ${error.message}`);
        return null;
    }

    console.log(`Chef fetched successfully: ${JSON.stringify(data)}`);
    return data;

}

export async function createChef({
    username, name, bio, image, sub_fee,
}: {
    username: string;
    name: string;
    bio: string;
    image?: string;
    sub_fee?: string;
}): Promise<Chef | null> {
    console.log(`Creating chef with username: ${username}`);
    const { data, error } = await supabase
        .from('chefs')
        .insert([{ username, name, bio, image, sub_fee }])
        .select()
        .single();

    if (error) {
        console.error(`Error creating chef: ${error.message}`);
        return null;
    }
    console.log(`Chef created successfully: ${JSON.stringify(data)}`);
    return data;
}

export async function updateChef({
    username, name, bio, image, sub_fee,
}: {
    username: string;
    name?: string;
    bio?: string;
    image?: string;
    sub_fee?: string;
}): Promise<Chef | null> {
    console.log(`Updating chef with username: ${username}`);
    const { data, error } = await supabase
        .from('chefs')
        .update({ name, bio, image, sub_fee })
        .eq('username', username)
        .select()
        .single();

    if (error) {
        console.error(`Error updating chef: ${error.message}`);
        return null;
    }
    console.log(`Chef updated successfully: ${JSON.stringify(data)}`);
    return data;
}

export async function createUser({
    username, name, image, evm_address, evm_p_key, solana_address, solana_p_key,
}: {
    username: string;
    name: string;
    image?: string;
    evm_address?: string;
    evm_p_key?: string;
    solana_address?: string;
    solana_p_key?: string;
}): Promise<User | null> {
    console.log(`Creating user with username: ${username}`);
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, name, image, evm_address, evm_p_key, solana_address, solana_p_key }])
        .select()
        .single();

    if (error) {
        console.error(`Error creating user: ${error.message}`);
        return null;
    }
    console.log(`User created successfully: ${JSON.stringify(data)}`);
    return data;
}

export async function updateUser({
    username, name, image, evm_address, evm_p_key, solana_address, solana_p_key, mode, profit_goal, profit_timeline, paused
}: {
    username: string;
    name?: string;
    image?: string;
    evm_address?: string;
    evm_p_key?: string;
    solana_address?: string;
    solana_p_key?: string;
    mode?: string;
    profit_goal?: number;
    profit_timeline?: number;
    paused?: boolean;
}): Promise<User | null> {
    console.log(`Updating user with username: ${username}`);
    const { data, error } = await supabase
        .from('users')
        .update({ name, image, evm_address, evm_p_key, solana_address, solana_p_key, mode, profit_goal, profit_timeline, paused })
        .eq('username', username)
        .select()
        .single();

    if (error) {
        console.error(`Error updating user: ${error.message}`);
        return null;
    }
    console.log(`User updated successfully: ${JSON.stringify(data)}`);
    return data;
}