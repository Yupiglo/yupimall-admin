import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user: {
      id?: string;
      role?: string;
      country?: string;
      supervisorId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    access?: string;
    refresh?: string;
    role?: string;
    country?: string;
    supervisorId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
    role?: string;
    country?: string;
    supervisorId?: string;
  }
}

export async function refreshAccessToken(token: JWT) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}api/v1/auth/refresh-token/`,
      {
        refresh: token.refreshToken,
      }
    );

    return {
      ...token,
      accessToken: response.data.access,
      // Fall back to old refresh token if new one is not returned
      refreshToken: response.data.refresh ?? token.refreshToken,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}api/v1/auth/signin`,
            {
              username: credentials.email,
              password: credentials.password,
            }
          );

          if (response.data.status === 200 && response.data.user.token) {
            // Restriction: Only Super Admin allowed in this panel
            if (response.data.user.role !== 'super_admin') {
              return null;
            }

            return {
              id: response.data.user.id.toString(),
              name: response.data.user.username,
              email: response.data.user.email,
              access: response.data.user.token,
              refresh: response.data.user.token,
              role: response.data.user.role,
              country: response.data.user.country,
              supervisorId: response.data.user.supervisor_id?.toString(),
            };
          }
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          accessToken: user.access,
          refreshToken: user.refresh,
          expiresAt: Date.now() + 5 * 60 * 1000,
          role: user.role,
          country: user.country,
          supervisorId: user.supervisorId,
          user,
        };
      }

      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string;
      if (session.user) {
        session.user.role = token.role as string;
        session.user.country = token.country as string;
        session.user.supervisorId = token.supervisorId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});
