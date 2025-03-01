import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Token",
      credentials: {
        token: { label: "Token", type: "password" },
      },
      async authorize(credentials) {
        // Validate the token against the server-side token
        if (credentials?.token === process.env.SERVER_TOKEN) {
          return { id: "1", name: "Authenticated User" };
        }
        return null; // Invalid token
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };