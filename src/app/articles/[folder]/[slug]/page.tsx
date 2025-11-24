import { getArticle, getAllArticlePaths, getGlobalArticleNavigation } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/syncPolicy';
import ArticlePageClient from './ArticlePageClient';
import SubscriptionGate from '@/components/SubscriptionGate';

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
  let userEmail: string | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    userEmail = session?.user?.email;
  } catch (error) {
    console.warn('Failed to get session, assuming non-admin user:', error);
    userEmail = undefined;
  }

  if (article.metadata.draft && !isAdmin(userEmail)) {
    notFound();
  }

  // 檢查訂閱權限
  const subscriptionLevel = article.metadata.subscription || 'free';
  const isLoggedIn = !!userEmail;

  // 如果文章需要會員權限且用戶未登入
  if (subscriptionLevel === 'member' && !isLoggedIn) {
    return <SubscriptionGate articleTitle={article.metadata.title} />;
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
