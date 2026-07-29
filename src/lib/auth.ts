import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

// In a real app, this should be defined globally to avoid multiple instances in development
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@petsaathi.in" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          // If no user is found, but we want to allow a default admin login for the pilot
          if (credentials.email === "admin@petsaathi.in" && credentials.password === "admin123") {
            return {
              id: "dummy-admin-id",
              name: "PetSaathi Admin",
              email: "admin@petsaathi.in",
              role: "ADMIN",
            };
          }
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown).id = token.id as string;
        (session.user as unknown).role = token.role as string;
      }
      return session;
    },
  },
};
