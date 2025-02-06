import { User } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


export const fetchOrCreateUser = async ({ id, email, name, image }: {
    id: string;
    email: string;
    name: string;
    image: string | undefined;
}) => {
    // Try fetching the user
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", id)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user.");
    }

    // If user exists, return it
    if (data) return data;

    // If user does not exist, create it
    const userData: User = {
        username: id,
        name: name,
        image: image,
        mode: "TREN",
        profit_goal: 0,
        profit_timeline: 0,
    };

    const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert(userData)
        .select()
        .single();

    if (insertError) {
        console.error("Error creating user:", insertError.message);
        throw new Error("Failed to create user.");
    }

    return newUser;
};
