import { getArticlesByFolder, parseMarkdownFile } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/syncPolicy';
import fs from 'fs';
import path from 'path';
import FolderPageClient from './FolderPageClient';

interface FolderPageProps {
  params: Promise<{
    folder: string;
  }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folder } = await params;

  // 檢查資料夾是否存在
  const folderPath = path.join(process.cwd(), 'articles', folder);
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    notFound();
  }

  // 檢查是否為 admin
  let userEmail: string | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    userEmail = session?.user?.email;
  } catch (error) {
    console.warn('Failed to get session, assuming non-admin user:', error);
    userEmail = undefined;
  }
  const includeDrafts = isAdmin(userEmail);

  const articles = getArticlesByFolder(folder, includeDrafts);

  // 讀取 Config.md 獲取資料夾資訊
  const configPath = path.join(process.cwd(), 'articles', folder, 'Config.md');
  let folderTitle = folder;
  let folderDescription = '';

  if (fs.existsSync(configPath)) {
    const { metadata } = parseMarkdownFile(configPath);
    folderTitle = metadata.title || folder;
    folderDescription = metadata.description || '';
  }

  return (
    <FolderPageClient
      folderTitle={folderTitle}
      folderDescription={folderDescription}
      articles={articles}
      folder={folder}
    />
  );
}
