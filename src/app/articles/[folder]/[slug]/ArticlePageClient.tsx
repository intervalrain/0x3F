"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ArticleContent from '@/components/ArticleContent';
import { ArticleMetadata } from '@/lib/articles';

interface ArticlePageClientProps {
  metadata: ArticleMetadata;
  content: string;
}

const ArticlePageClient: React.FC<ArticlePageClientProps> = ({ metadata, content }) => {
  return (
    <AppLayout>
      {() => (
        <ArticleContent metadata={metadata} content={content} />
      )}
    </AppLayout>
  );
};

export default ArticlePageClient;
