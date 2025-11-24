import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  hasGitHub?: boolean;
  githubUsername?: string | null;
}

interface ExtendedSession {
  user?: ExtendedUser;
}

// 這個 API 用於生成 GitHub OAuth 連結
// 已登入的 Google 用戶可以通過這個連結綁定 GitHub 帳號
export async function GET() {
  const session = await getServerSession(authOptions) as ExtendedSession | null;

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "請先登入" },
      { status: 401 }
    );
  }

  // 檢查是否已綁定 GitHub
  if (session.user.hasGitHub) {
    return NextResponse.json(
      { error: "已綁定 GitHub 帳號", githubUsername: session.user.githubUsername },
      { status: 400 }
    );
  }

  // 生成 GitHub OAuth URL
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/github`;
  const scope = "read:user";
  const state = Buffer.from(JSON.stringify({
    action: "link",
    userId: session.user.id
  })).toString("base64");

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

  return NextResponse.json({ url: githubAuthUrl });
}
