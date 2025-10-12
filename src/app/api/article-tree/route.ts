import { NextResponse } from 'next/server';
import { getArticleTree } from '@/lib/articles';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/syncPolicy';

export async function GET() {
  try {
    // 檢查是否為 admin
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const includeDrafts = isAdmin(userEmail);

    const tree = getArticleTree(includeDrafts);
    return NextResponse.json({ tree });
  } catch (error) {
    console.error('Failed to get article tree:', error);
    return NextResponse.json({ tree: [] });
  }
}
