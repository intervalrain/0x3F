import * as fs from 'fs';
import * as path from 'path';
import { allTopicsData } from '../src/data/allTopicsData';
import { Chapter } from '../src/types';

const topicNames: string[] = [
  '滑動視窗與雙指針',
  '二分搜尋',
  '單調堆疊與單調佇列',
  '網格圖',
  '位元操作',
  '圖論演算法',
  '動態規劃',
  '資料結構',
  '數學演算法',
  '貪婪演算法',
  '鏈結串列、樹與回溯',
  '字串處理'
];

const allChapters = allTopicsData.map((chapters, index) => ({
  name: topicNames[index] || `未知主題${index + 1}`,
  data: chapters
}));

interface ProblemRow {
  topicId: number;
  topicName: string;
  chapterTitle: string;
  subsectionTitle: string;
  problemNumber: string;
  problemTitle: string;
  url: string;
  difficulty?: number;
  isPremium: boolean;
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function exportToCSV() {
  const rows: ProblemRow[] = [];

  allChapters.forEach((topic, topicIndex) => {
    const topicName = topic.name;
    const topicId = topicIndex + 1;

    topic.data.forEach((chapter: Chapter) => {
      chapter.subsections.forEach((subsection) => {
        subsection.problems.forEach((problem) => {
          rows.push({
            topicId,
            topicName,
            chapterTitle: chapter.title,
            subsectionTitle: subsection.title,
            problemNumber: problem.number,
            problemTitle: problem.title,
            url: problem.url,
            difficulty: problem.difficulty,
            isPremium: false // 預設為 false，待後續更新
          });
        });
      });
    });
  });

  // 生成 CSV 內容
  const csvHeader = 'Topic ID,Topic Name,Chapter,Subsection,Problem Number,Problem Title,URL,Difficulty,Is Premium';
  const csvContent = rows.map(row =>
    [
      row.topicId,
      escapeCSV(row.topicName),
      escapeCSV(row.chapterTitle),
      escapeCSV(row.subsectionTitle),
      row.problemNumber,
      escapeCSV(row.problemTitle),
      row.url,
      row.difficulty || '',
      row.isPremium
    ].join(',')
  ).join('\n');

  const fullCSV = csvHeader + '\n' + csvContent;

  // 寫入檔案
  const outputPath = path.join(process.cwd(), 'problems_export.csv');
  fs.writeFileSync(outputPath, fullCSV, 'utf-8');

  console.log(`✅ CSV 檔案已生成: ${outputPath}`);
  console.log(`📊 總共匯出 ${rows.length} 道題目`);

  // 統計資訊
  const topicCounts = new Map<string, number>();
  rows.forEach(row => {
    const count = topicCounts.get(row.topicName) || 0;
    topicCounts.set(row.topicName, count + 1);
  });

  console.log('\n📈 各主題題目數量：');
  topicCounts.forEach((count, topic) => {
    console.log(`   ${topic}: ${count} 題`);
  });
}

exportToCSV();