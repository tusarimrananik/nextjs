import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"
import { connectToDatabase } from "./lib/db";
import User from "./models/User";



const providers: Provider[] = [
    Credentials({
        credentials: { accessToken: { label: "Access Token", type: "text" } },
        authorize: async (credentials) => {
            // Add validation
            if (!credentials?.accessToken) return null;

            try {
                await connectToDatabase();
                const user = await User.findOne({ accessToken: credentials.accessToken });
                return user ? {
                    id: user._id.toString(),
                    name: user.userName,
                    balance: user.balance,
                    numberOfOperations: user.numberOfOperations
                } : null;
            } catch (error) {
                console.error("Authentication error:", error);
                return null;
            }
        },
    }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers,
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.balance = user.balance;
                token.numberOfOperations = user.numberOfOperations;
            }
            return token;
        },
        async session({ session, token }) {
            // Add custom fields to client session
            if (token) {
                session.user.id = token.sub!;
                session.user.balance = token.balance as number;
                session.user.numberOfOperations = token.numberOfOperations as number;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
});