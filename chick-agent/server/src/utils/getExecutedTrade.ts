import { createClient } from "@supabase/supabase-js";
import { ExecutedTrade } from "../types.js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


export async function fetchExecutedTrade(
    id: string
): Promise<ExecutedTrade | undefined> {
    const { data, error } = await supabase
        .from('executed_trades')
        .select(`
      *,
      trade_play:trade_plays(
        *,
        chef:chefs(
          username
        )
      )
      `)
        .eq('id', id).single()

    if (error) {
        throw new Error(`Error fetching executed trades: ${error.message}`)
        return undefined
    }

    return data as ExecutedTrade
}
