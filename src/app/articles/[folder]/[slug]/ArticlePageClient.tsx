"use client";

import React from 'react';
import ArticleContent from '@/components/ArticleContent';
import { ArticleMetadata, ArticleNavigation } from '@/lib/articles';

interface ArticlePageClientProps {
  metadata: ArticleMetadata;
  content: string;
  navigation: ArticleNavigation;
}

const ArticlePageClient: React.FC<ArticlePageClientProps> = ({ metadata, content, navigation }) => {
  return (
    <ArticleContent metadata={metadata} content={content} navigation={navigation} />
  );
};

export default ArticlePageClient;
