const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'articles');
const searchIndexPath = path.join(process.cwd(), 'public', 'search-index.json');
const articleTreePath = path.join(process.cwd(), 'public', 'article-tree.json');

/**
 * 生成搜尋索引
 * 掃描 articles 資料夾中的所有 markdown 檔案
 * 提取標題、描述、標籤、內容摘要等資訊
 */
function generateSearchIndex() {
  const searchIndex = [];

  // 讀取 articles 資料夾
  const folders = fs.readdirSync(articlesDir).filter(item => {
    const itemPath = path.join(articlesDir, item);
    return fs.statSync(itemPath).isDirectory() && /^\d+$/.test(item);
  });

  folders.forEach(folder => {
    const folderPath = path.join(articlesDir, folder);
    const files = fs.readdirSync(folderPath).filter(file =>
      file.endsWith('.md') && !file.startsWith('Config')
    );

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      try {
        const { data, content } = matter(fileContent);

        // 提取內容摘要（前 200 字）
        const plainContent = content
          .replace(/```[\s\S]*?```/g, '') // 移除程式碼區塊
          .replace(/#+\s/g, '') // 移除標題符號
          .replace(/\*\*/g, '') // 移除粗體
          .replace(/\*/g, '') // 移除斜體
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除連結，保留文字
          .replace(/\n+/g, ' ') // 換行改為空格
          .trim();

        const excerpt = plainContent.substring(0, 200);

        // 從檔名中提取 slug
        const slug = file.replace('.md', '');

        searchIndex.push({
          id: `${folder}-${slug}`,
          title: data.title || file.replace('.md', ''),
          description: data.description || '',
          tags: data.tags || [],
          folder: folder,
          slug: slug,
          path: `/articles/${folder}/${slug}`,
          excerpt: excerpt,
          order: data.order ?? 999,
          draft: data.draft || false,
        });
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    });
  });

  // 按資料夾和順序排序
  searchIndex.sort((a, b) => {
    if (a.folder !== b.folder) {
      return a.folder.localeCompare(b.folder);
    }
    return a.order - b.order;
  });

  // 確保 public 資料夾存在
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 寫入 JSON 檔案
  fs.writeFileSync(
    searchIndexPath,
    JSON.stringify({ articles: searchIndex }, null, 2),
    'utf-8'
  );

  console.log(`✅ Search index generated: ${searchIndex.length} articles`);
  console.log(`📁 Output: ${searchIndexPath}`);
}

/**
 * 生成文章樹狀結構
 * 用於 Sidebar 顯示
 */
function generateArticleTree() {
  const tree = [];

  // 讀取 articles 資料夾
  const folders = fs.readdirSync(articlesDir).filter(item => {
    const itemPath = path.join(articlesDir, item);
    return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
  }).sort();

  folders.forEach(folder => {
    const folderPath = path.join(articlesDir, folder);
    const configPath = path.join(folderPath, 'Config.md');

    // 讀取 Config.md 獲取資料夾標題
    let folderTitle = folder;
    let folderOrder = parseInt(folder) || 0;

    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const { data } = matter(configContent);
        folderTitle = data.title || folder;
        folderOrder = data.order || folderOrder;
      } catch (error) {
        console.error(`Error parsing Config.md in ${folder}:`, error.message);
      }
    }

    // 獲取資料夾內的所有文章
    const files = fs.readdirSync(folderPath).filter(file =>
      file.endsWith('.md') && !file.startsWith('Config')
    );

    const children = [];

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);

        // 跳過草稿
        if (data.draft) {
          return;
        }

        const slug = file.replace('.md', '');

        children.push({
          title: data.title || slug,
          path: `/articles/${folder}/${slug}`,
          order: data.order ?? 999,
          subscription: data.subscription || 'free',
        });
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    });

    // 按 order 排序子項目
    children.sort((a, b) => a.order - b.order);

    // 只有當資料夾有非草稿文章時才加入樹狀結構
    if (children.length > 0) {
      tree.push({
        title: folderTitle,
        path: `/articles/${folder}`,
        order: folderOrder,
        isFolder: true,
        children: children,
      });
    }
  });

  // 按 order 排序
  tree.sort((a, b) => a.order - b.order);

  // 寫入 JSON 檔案
  fs.writeFileSync(
    articleTreePath,
    JSON.stringify(tree, null, 2),
    'utf-8'
  );

  console.log(`✅ Article tree generated: ${tree.length} folders`);
  console.log(`📁 Output: ${articleTreePath}`);
}

// 執行生成
generateSearchIndex();
generateArticleTree();
