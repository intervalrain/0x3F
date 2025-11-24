import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type SubscriptionLevel = 'free' | 'member' | 'premium';

export interface ArticleMetadata {
  title: string;
  order: number;
  description?: string;
  tags?: string[];
  author?: string;
  date?: string;
  draft?: boolean;
  subscription?: SubscriptionLevel; // 'free' = 公開, 'member' = 需登入, 'premium' = 付費會員（未來擴充）
}

export interface ArticleNavigation {
  prev?: {
    title: string;
    path: string;
  };
  next?: {
    title: string;
    path: string;
  };
}

export interface Article {
  slug: string;
  folder: string;
  metadata: ArticleMetadata;
  content: string;
}

export interface ArticleNode {
  title: string;
  path: string;
  order: number;
  children?: ArticleNode[];
  isFolder?: boolean;
  subscription?: SubscriptionLevel;
}

const articlesDirectory = path.join(process.cwd(), 'articles');

/**
 * 讀取單一 markdown 檔案並解析 frontmatter
 */
export function parseMarkdownFile(filePath: string): { metadata: ArticleMetadata; content: string } {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    metadata: data as ArticleMetadata,
    content,
  };
}

/**
 * 獲取特定資料夾的所有文章
 * @param folder 資料夾名稱
 * @param includeDrafts 是否包含草稿，預設為 false
 */
export function getArticlesByFolder(folder: string, includeDrafts = false): Article[] {
  const folderPath = path.join(articlesDirectory, folder);

  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const files = fs.readdirSync(folderPath);
  const articles: Article[] = [];

  for (const file of files) {
    if (file.endsWith('.md') && file !== 'Config.md') {
      const filePath = path.join(folderPath, file);
      const { metadata, content } = parseMarkdownFile(filePath);
      const slug = file.replace(/\.md$/, '');

      // 如果不包含草稿且該文章是草稿，則跳過
      if (!includeDrafts && metadata.draft) {
        continue;
      }

      articles.push({
        slug,
        folder,
        metadata,
        content,
      });
    }
  }

  // 按 order 排序
  return articles.sort((a, b) => a.metadata.order - b.metadata.order);
}

/**
 * 獲取單篇文章
 */
export function getArticle(folder: string, slug: string): Article | null {
  const filePath = path.join(articlesDirectory, folder, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { metadata, content } = parseMarkdownFile(filePath);

  return {
    slug,
    folder,
    metadata,
    content,
  };
}

/**
 * 建立文章導航樹
 * @param includeDrafts 是否包含草稿，預設為 false
 */
export function getArticleTree(includeDrafts = false): ArticleNode[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const folders = fs.readdirSync(articlesDirectory)
    .filter(name => {
      const folderPath = path.join(articlesDirectory, name);
      return fs.statSync(folderPath).isDirectory() && !name.startsWith('_');
    })
    .sort(); // 字典序排列

  const tree: ArticleNode[] = [];

  for (const folder of folders) {
    const configPath = path.join(articlesDirectory, folder, 'Config.md');

    // 讀取 Config.md 獲取資料夾標題
    let folderTitle = folder;
    let folderOrder = parseInt(folder) || 0;

    if (fs.existsSync(configPath)) {
      const { metadata } = parseMarkdownFile(configPath);
      folderTitle = metadata.title || folder;
      folderOrder = metadata.order || folderOrder;
    }

    // 獲取資料夾內的所有文章（根據 includeDrafts 決定是否包含草稿）
    const articles = getArticlesByFolder(folder, includeDrafts);
    const children: ArticleNode[] = articles.map(article => ({
      title: article.metadata.title,
      path: `/articles/${folder}/${article.slug}`,
      order: article.metadata.order,
    }));

    // 只有當資料夾有非草稿文章時才加入樹狀結構
    if (children.length > 0 || includeDrafts) {
      tree.push({
        title: folderTitle,
        path: `/articles/${folder}`,
        order: folderOrder,
        isFolder: true,
        children: children.length > 0 ? children : undefined,
      });
    }
  }

  // 按 order 排序
  return tree.sort((a, b) => a.order - b.order);
}

/**
 * 獲取所有文章的路徑（用於生成靜態頁面）
 * @param includeDrafts 是否包含草稿，預設為 true（靜態生成時需要包含所有頁面）
 */
export function getAllArticlePaths(includeDrafts = true): { folder: string; slug: string }[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const folders = fs.readdirSync(articlesDirectory)
    .filter(name => {
      const folderPath = path.join(articlesDirectory, name);
      return fs.statSync(folderPath).isDirectory() && !name.startsWith('_');
    });

  const paths: { folder: string; slug: string }[] = [];

  for (const folder of folders) {
    const articles = getArticlesByFolder(folder, includeDrafts);
    for (const article of articles) {
      paths.push({ folder, slug: article.slug });
    }
  }

  return paths;
}

/**
 * 獲取文章的前後導航資訊
 * @param folder 資料夾名稱
 * @param slug 文章 slug
 * @param includeDrafts 是否包含草稿，預設為 false
 */
export function getArticleNavigation(folder: string, slug: string, includeDrafts = false): ArticleNavigation {
  // 獲取當前資料夾的所有文章
  const articles = getArticlesByFolder(folder, includeDrafts);
  const currentIndex = articles.findIndex(article => article.slug === slug);

  if (currentIndex === -1) {
    return {};
  }

  const navigation: ArticleNavigation = {};

  // 獲取前一篇文章
  if (currentIndex > 0) {
    const prevArticle = articles[currentIndex - 1];
    navigation.prev = {
      title: prevArticle.metadata.title,
      path: `/articles/${folder}/${prevArticle.slug}`,
    };
  }

  // 獲取下一篇文章
  if (currentIndex < articles.length - 1) {
    const nextArticle = articles[currentIndex + 1];
    navigation.next = {
      title: nextArticle.metadata.title,
      path: `/articles/${folder}/${nextArticle.slug}`,
    };
  }

  return navigation;
}

/**
 * 獲取全域文章導航（跨資料夾）
 * @param folder 當前資料夾名稱
 * @param slug 當前文章 slug
 * @param includeDrafts 是否包含草稿，預設為 false
 */
export function getGlobalArticleNavigation(folder: string, slug: string, includeDrafts = false): ArticleNavigation {
  if (!fs.existsSync(articlesDirectory)) {
    return {};
  }

  const folders = fs.readdirSync(articlesDirectory)
    .filter(name => {
      const folderPath = path.join(articlesDirectory, name);
      return fs.statSync(folderPath).isDirectory() && !name.startsWith('_');
    })
    .sort();

  // 收集所有文章（按資料夾順序，再按 order 排序）
  const allArticles: Array<{ folder: string; article: Article }> = [];
  for (const folderName of folders) {
    const articles = getArticlesByFolder(folderName, includeDrafts);
    for (const article of articles) {
      allArticles.push({ folder: folderName, article });
    }
  }

  // 找到當前文章的索引
  const currentIndex = allArticles.findIndex(
    item => item.folder === folder && item.article.slug === slug
  );

  if (currentIndex === -1) {
    return {};
  }

  const navigation: ArticleNavigation = {};

  // 獲取前一篇文章
  if (currentIndex > 0) {
    const prev = allArticles[currentIndex - 1];
    navigation.prev = {
      title: prev.article.metadata.title,
      path: `/articles/${prev.folder}/${prev.article.slug}`,
    };
  }

  // 獲取下一篇文章
  if (currentIndex < allArticles.length - 1) {
    const next = allArticles[currentIndex + 1];
    navigation.next = {
      title: next.article.metadata.title,
      path: `/articles/${next.folder}/${next.article.slug}`,
    };
  }

  return navigation;
}
