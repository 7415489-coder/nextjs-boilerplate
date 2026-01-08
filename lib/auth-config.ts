import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword } from "./auth";
import { CredentialsSignin } from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new CredentialsSignin("Email and password are required");
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          const user = await getUserByEmail(email);
          if (!user) {
            throw new CredentialsSignin("Invalid email or password");
          }

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) {
            throw new CredentialsSignin("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          // If it's already a CredentialsSignin error, re-throw it
          if (error instanceof CredentialsSignin) {
            throw error;
          }
          // Otherwise, wrap it in a CredentialsSignin error
          throw new CredentialsSignin("An error occurred during authentication");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

// Create NextAuth instance and export handlers and auth function
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

