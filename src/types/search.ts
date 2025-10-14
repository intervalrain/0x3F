// 搜尋相關的 TypeScript 類型定義

export interface SearchArticle {
  id: string;
  title: string;
  description: string;
  tags: string[];
  folder: string;
  slug: string;
  path: string;
  excerpt: string;
  order: number;
  draft: boolean;
}

export interface SearchIndex {
  articles: SearchArticle[];
}

export interface SearchResult {
  item: SearchArticle;
  score?: number;
  matches?: any[];
}
