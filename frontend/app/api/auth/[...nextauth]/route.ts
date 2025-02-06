import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { objectToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";
import { fetchOrCreateUser } from "@/lib/supabase";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            image: string;
            email: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "telegram-login",
            name: "Telegram Login",

            credentials: {},
            async authorize(credentials, req) {
                const validator = new AuthDataValidator({
                    botToken: `${process.env.BOT_TOKEN}`,
                });

                const data = objectToAuthDataMap(req.query || {});
                const user = await validator.validate(data);

                if (user.id && user.first_name) {
                    const returned = {
                        id: user.id.toString(),
                        email: user.id.toString(),
                        name: [user.first_name, user.last_name || ""].join(" "),
                        image: user.photo_url,
                    };
                    const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_KEY || "");
                    // TODO: Create user supabase
                    try {
                        await fetchOrCreateUser(returned);
                    } catch {
                        console.log(
                            "Something went wrong while creating the user."
                        );
                    }

                    return returned;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, user, token }) {
            session.user.id = session.user.email;
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };