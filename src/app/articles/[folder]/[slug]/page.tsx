import { getArticle, getAllArticlePaths, getGlobalArticleNavigation } from '@/lib/articles';
import { notFound } from 'next/navigation';
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

  // 獲取文章導航（跨資料夾）
  const navigation = getGlobalArticleNavigation(folder, slug);

  return (
    <ArticlePageClient
      metadata={article.metadata}
      content={article.content}
      navigation={navigation}
    />
  );
}
