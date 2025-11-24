/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;

        // 查詢用戶是否已綁定 GitHub
        const githubAccount = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: "github",
          },
        });

        session.user.hasGitHub = !!githubAccount;
        session.user.githubUsername = githubAccount?.providerAccountId || null;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // 確保總是重定向到當前應用
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    // 處理帳號連結：允許同一個 email 綁定多個 provider
    async signIn({ user, account }: any) {
      if (!user.email) return true;

      // 檢查是否已存在同 email 的用戶
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (existingUser && account) {
        // 檢查此 provider 是否已綁定
        const existingAccount = existingUser.accounts.find(
          (acc: any) => acc.provider === account.provider
        );

        if (!existingAccount) {
          // 綁定新的 provider 到現有用戶
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
} as any;