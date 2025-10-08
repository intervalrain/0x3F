import { NextResponse } from 'next/server';
import { getArticleTree } from '@/lib/articles';

export async function GET() {
  try {
    const tree = getArticleTree();
    return NextResponse.json(tree);
  } catch (error) {
    console.error('Failed to get article tree:', error);
    return NextResponse.json([], { status: 500 });
  }
}
