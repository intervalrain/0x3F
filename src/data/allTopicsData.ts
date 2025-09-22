// 編譯時導入JSON數據以獲得最佳性能
import { Chapter } from '../types';
import allTopicsJsonData from './allTopicsData.json';

// JSON數據的類型定義
interface JsonProblem {
  id: string;
  topicId: number;
  chapterId: string;
  subsectionId: string;
  number: number; // JSON中是number
  title: string;
  url: string;
  isPremium: boolean;
  difficulty?: number; // 可選字段
  completed: boolean;
}

interface JsonSubsection {
  id: string;
  title: string;
  problems: JsonProblem[];
}

interface JsonChapter {
  id: string;
  title: string;
  subsections: JsonSubsection[];
}

// 型別轉換函數：將JSON中的number轉換為string
function convertJsonToTypedData(jsonData: JsonChapter[][]): Chapter[][] {
  return jsonData.map((topicChapters: JsonChapter[]) =>
    topicChapters.map((chapter: JsonChapter) => ({
      ...chapter,
      subsections: chapter.subsections.map((subsection: JsonSubsection) => ({
        ...subsection,
        problems: subsection.problems.map((problem: JsonProblem) => ({
          ...problem,
          number: problem.number.toString(), // 轉換number為string
          isPremium: problem.isPremium || false,
          difficulty: problem.difficulty, // 保持原樣，可能是undefined
          completedAt: undefined // 設為undefined，因為JSON中沒有這個字段
        }))
      }))
    }))
  );
}

// 將JSON數據轉換為正確的類型
export const allTopicsData: Chapter[][] = convertJsonToTypedData(allTopicsJsonData);

// 導出兼容的格式（以topic ID為索引的對象）
export const allTopicsDataByIndex: { [key: number]: Chapter[] } = {};

// 初始化索引對象（topic ID 從 1 開始，所以索引要 +1）
allTopicsData.forEach((chapters, index) => {
  allTopicsDataByIndex[index + 1] = chapters;
});

// 保持向後兼容性的默認導出
export default allTopicsDataByIndex;