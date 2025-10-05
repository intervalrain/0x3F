"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
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
    <AppLayout>
      {() => (
        <ArticleListContent
          folderTitle={folderTitle}
          folderDescription={folderDescription}
          articles={articles}
          folder={folder}
        />
      )}
    </AppLayout>
  );
};

export default FolderPageClient;
