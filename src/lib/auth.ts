import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "https://api.yupimall.net";
  return url.replace(/\/$/, "");
};

const baseUrl = getBaseUrl();

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
    console.log("AUTH_DEBUG: Refreshing token at", `${baseUrl}/api/v1/auth/refresh-token/`);
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/refresh-token/`,
      {
        refresh: token.refreshToken,
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return {
      ...token,
      accessToken: response.data.access || token.accessToken,
      // Fall back to old refresh token if new one is not returned
      refreshToken: response.data.refresh ?? token.refreshToken,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
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
          console.log("AUTH_DEBUG: Attempting signin for", credentials?.email, "at", `${baseUrl}/api/v1/auth/signin`);

          const response = await axios.post(
            `${baseUrl}/api/v1/auth/signin`,
            {
              username: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          console.log("AUTH_DEBUG: Response status:", response.data.status);

          if (response.data.status === 200 && response.data.user.token) {
            console.log("AUTH_DEBUG: User role:", response.data.user.role);
            // Restriction: Only Admin or Dev allowed in this panel
            if (response.data.user.role !== 'admin' && response.data.user.role !== 'dev') {
              console.log("AUTH_DEBUG: Access denied - role mismatch (expected admin/dev)");
              return null;
            }

            console.log("AUTH_DEBUG: Authentication successful for", response.data.user.username);

            return {
              id: response.data.user.id.toString(),
              name: response.data.user.name || response.data.user.username,
              email: response.data.user.email,
              image: response.data.user.image_url || response.data.user.avatar_url,
              access: response.data.user.token,
              refresh: response.data.user.token,
              role: response.data.user.role,
              country: response.data.user.country,
              supervisorId: response.data.user.supervisor_id?.toString(),
            };
          }
          console.log("AUTH_DEBUG: Authentication failed - Invalid status or missing token");
          return null;
        } catch (error: any) {
          console.error("AUTH_DEBUG: Authorize error:", error.response?.status, error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session: updateData }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.access,
          refreshToken: user.refresh,
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
          name: user.name,
          email: user.email,
          picture: user.image,
          role: user.role,
          country: user.country,
          supervisorId: user.supervisorId,
          image: user.image,
          user,
        };
      }

      if (trigger === "update" && updateData) {
        if (updateData.user?.name) token.name = updateData.user.name;
        if (updateData.user?.image) {
          token.image = updateData.user.image;
          token.picture = updateData.user.image;
        }
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
        session.user.id = ((token as any).user?.id ?? token.sub) as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.country = token.country as string;
        session.user.supervisorId = token.supervisorId as string;
        session.user.image = (token.image || token.picture) as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token.admin`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  trustHost: true,
  secret: (() => {
    const secret = process.env.AUTH_SECRET;
    if (process.env.NODE_ENV === "production" && !secret) {
      throw new Error("AUTH_SECRET is required in production. See docs/SECURITE.md");
    }
    return secret || "default_landing_secret_for_build";
  })(),
});
