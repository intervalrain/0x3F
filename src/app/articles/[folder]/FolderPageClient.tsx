"use client";

import React from 'react';
import ArticleListContent from '@/components/ArticleListContent';
import { Article } from '@/lib/articles';

interface FolderPageClientProps {
  folderTitle: string;
  folderDescription: string;
  articles: Article[];
  folder: string;
}

const FolderPageClient: React.FC<FolderPageClientProps> = ({
  folderTitle,
  folderDescription,
  articles,
  folder
}) => {
  return (
    <ArticleListContent
      folderTitle={folderTitle}
      folderDescription={folderDescription}
      articles={articles}
      folder={folder}
    />
  );
};

export default FolderPageClient;
