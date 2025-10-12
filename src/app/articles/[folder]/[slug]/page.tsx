import { getArticle, getAllArticlePaths, getGlobalArticleNavigation } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/syncPolicy';
import ArticlePageClient from './ArticlePageClient';

interface ArticlePageProps {
  params: Promise<{
    folder: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllArticlePaths();
  return paths.map(({ folder, slug }) => ({
    folder,
    slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { folder, slug } = await params;
  const article = getArticle(folder, slug);

  if (!article) {
    notFound();
  }

  // 檢查是否為 draft，且使用者不是 admin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getServerSession(authOptions) as any;
  const userEmail = session?.user?.email;
  if (article.metadata.draft && !isAdmin(userEmail)) {
    notFound();
  }

  // 獲取文章導航（跨資料夾）
  const includeDrafts = isAdmin(userEmail);
  const navigation = getGlobalArticleNavigation(folder, slug, includeDrafts);

  return (
    <ArticlePageClient
      metadata={article.metadata}
      content={article.content}
      navigation={navigation}
    />
  );
}
