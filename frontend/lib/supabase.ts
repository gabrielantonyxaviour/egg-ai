import { Chef, TradePlay, User } from "@/types";
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
    niche
}: {
    username: string;
    name: string;
    bio: string;
    niche: string[];
    image?: string;
    sub_fee?: string;
}): Promise<Chef | null> {
    console.log(`Creating chef with username: ${username}`);
    const { data, error } = await supabase
        .from('chefs')
        .insert([{ username, name, bio, image, niche, sub_fee }])
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

export async function storeImage(fileName: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage.from('chef_images').upload(fileName, file, {
        contentType: 'image/png',
    });

    if (error) {
        console.error(`Error uploading image: ${error.message}`);
        return '';
    }

    const { data: { publicUrl } } = supabase
        .storage
        .from('chef_images')
        .getPublicUrl(fileName);


    console.log(`Image uploaded successfully: ${publicUrl}`);
    return publicUrl;
}

export async function followChef({
    chef_id, username, confidence_level
}: {
    chef_id: string;
    username: string;
    confidence_level: number;
}) {
    console.log(`${username} is following chef with id: ${chef_id}`);
    const { data, error } = await supabase
        .from('user_follows')
        .upsert({ chef_id, username, confidence_level, last_subscribed_at: new Date() }, { onConflict: 'chef_id,username' })
        .select()
        .single();
    if (error) {
        console.error(`Error creating subscription: ${error.message}`);
        return null;
    }
    console.log(`Chef Followed successfully: ${JSON.stringify(data)}`);
    return data;
}


export async function createPlay({
    chef_id, asset, direction, entry_price, stop_loss, leverage, trade_type, timeframe, status, pnl_percentage, research_description, dex, image, chain, take_profit, dca, expected_pnl
}: TradePlay) {
    console.log(`Chef with chef_id: ${chef_id} is posting a play`);
    const { data, error } = await supabase
        .from('trade_plays')
        .insert({ chef_id, asset, direction, entry_price, stop_loss, leverage, trade_type, timeframe, status, pnl_percentage, research_description, dex, image, chain, take_profit, dca, expected_pnl })
        .select()
        .single();
    if (error) {
        console.error(`Error creating play: ${error.message}`);
        return null;
    }
    console.log(`Play created successfully: ${JSON.stringify(data)}`);
    return data;
}
