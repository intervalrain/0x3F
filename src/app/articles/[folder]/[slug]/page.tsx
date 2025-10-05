import { getArticle, getAllArticlePaths } from '@/lib/articles';
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

  return (
    <ArticlePageClient
      metadata={article.metadata}
      content={article.content}
    />
  );
}
