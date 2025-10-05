import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMetadata {
  title: string;
  order: number;
  description?: string;
  tags?: string[];
  author?: string;
  date?: string;
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
 */
export function getArticlesByFolder(folder: string): Article[] {
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
 */
export function getArticleTree(): ArticleNode[] {
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

    // 獲取資料夾內的所有文章
    const articles = getArticlesByFolder(folder);
    const children: ArticleNode[] = articles.map(article => ({
      title: article.metadata.title,
      path: `/articles/${folder}/${article.slug}`,
      order: article.metadata.order,
    }));

    tree.push({
      title: folderTitle,
      path: `/articles/${folder}`,
      order: folderOrder,
      isFolder: true,
      children: children.length > 0 ? children : undefined,
    });
  }

  // 按 order 排序
  return tree.sort((a, b) => a.order - b.order);
}

/**
 * 獲取所有文章的路徑（用於生成靜態頁面）
 */
export function getAllArticlePaths(): { folder: string; slug: string }[] {
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
    const articles = getArticlesByFolder(folder);
    for (const article of articles) {
      paths.push({ folder, slug: article.slug });
    }
  }

  return paths;
}
