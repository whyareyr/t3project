import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import crypto from "crypto";

// Initialize Prisma Client
const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials not provided");
        }

        const { email, password } = credentials;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        // Check if user exists
        if (!user) {
          throw new Error("User not found");
        }

        // Compare password
        const isValidPassword =
          user.password && (await compare(password, user.password));
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // After successful login, create a session in the database manually
        const sessionToken = crypto.randomBytes(32).toString("hex");

        await prisma.session.create({
          data: {
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 din
            sessionToken: sessionToken,
          },
        });

        return { id: user.id.toString(), email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    updateAge: 30 * 24 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
