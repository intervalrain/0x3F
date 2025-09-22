"use client";

import React, { useState } from 'react';
import { topics } from '../data/topics';
import { TopicProgress } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { allTopicsDataByIndex } from '../data/allTopicsData';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: (props: {
    activeTab: string | number;
    topicProgress: TopicProgress[];
    setTopicProgress: React.Dispatch<React.SetStateAction<TopicProgress[]>>;
  }) => React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string | number>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // 資料版本，當我們更新資料結構時增加這個版本號
  const DATA_VERSION = "3.0.0";
  const OLD_STORAGE_KEY = "leetcode-tracker-progress";
  const NEW_STORAGE_KEY = "leetcode-tracker-progress-v3";

  // Helper function: 將舊格式轉換為新格式
  const migrateOldDataToNewFormat = (oldData: any[]): TopicProgress[] => {
    console.log("開始遷移舊資料格式...");

    return topics.map((topic) => {
      const oldTopicData = oldData.find((tp: any) => tp.topicId === topic.id);
      const baseChapters = allTopicsDataByIndex[topic.id - 1] || [];

      if (!oldTopicData) {
        // 沒有舊資料，直接使用新格式
        return {
          topicId: topic.id,
          problems: [],
          chapters: baseChapters,
        };
      }

      // 將舊的 problems 完成狀態合併到新的 chapters 結構
      const migratedChapters = baseChapters.map(chapter => ({
        ...chapter,
        subsections: chapter.subsections.map(subsection => ({
          ...subsection,
          problems: subsection.problems.map(problem => {
            // 在舊資料中尋找相同的題目（透過 number 或 id 比對）
            const oldProblem = oldTopicData.problems?.find((op: any) =>
              op.number?.toString() === problem.number.toString() ||
              op.id === problem.id
            );

            if (oldProblem && oldProblem.completed) {
              console.log(`遷移題目 ${problem.number}: ${problem.title} - 已完成`);
              return {
                ...problem,
                completed: true,
                completedAt: oldProblem.completedAt || new Date().toISOString(),
              };
            }
            return problem;
          }),
        })),
      }));

      // 處理舊資料中可能存在的章節級別的 problems
      let migratedOldFormatProblems: any[] = [];
      if (oldTopicData.chapters) {
        oldTopicData.chapters.forEach((oldChapter: any) => {
          oldChapter.subsections?.forEach((oldSubsection: any) => {
            oldSubsection.problems?.forEach((oldProblem: any) => {
              if (oldProblem.completed) {
                // 嘗試在新結構中找到對應的題目並標記為完成
                migratedChapters.forEach(newChapter => {
                  newChapter.subsections.forEach(newSubsection => {
                    const matchingProblem = newSubsection.problems.find(p =>
                      p.number?.toString() === oldProblem.number?.toString() ||
                      p.id === oldProblem.id
                    );
                    if (matchingProblem && !matchingProblem.completed) {
                      matchingProblem.completed = true;
                      matchingProblem.completedAt = oldProblem.completedAt || new Date().toISOString();
                      console.log(`從章節遷移題目 ${matchingProblem.number}: ${matchingProblem.title} - 已完成`);
                    }
                  });
                });
              }
            });
          });
        });
      }

      return {
        topicId: topic.id,
        problems: oldTopicData.problems || [],
        chapters: migratedChapters,
      };
    });
  };

  const getInitialData = () => {
    const defaultData = topics.map((topic) => ({
      topicId: topic.id,
      problems: [],
      chapters: allTopicsDataByIndex[topic.id - 1] || [],
    }));

    if (typeof window === "undefined") {
      return defaultData;
    }

    const storedVersion = localStorage.getItem("leetcode-tracker-version");

    // 檢查是否需要執行遷移
    const oldFormatData = localStorage.getItem(OLD_STORAGE_KEY);
    const newFormatData = localStorage.getItem(NEW_STORAGE_KEY);

    // 如果已經有新格式資料且版本正確，直接返回
    if (newFormatData && storedVersion === DATA_VERSION) {
      try {
        console.log("載入現有的新格式資料");
        return JSON.parse(newFormatData);
      } catch (error) {
        console.error("解析新格式資料失敗:", error);
        return defaultData;
      }
    }

    // 如果有舊格式資料但沒有新格式資料，執行遷移
    if (oldFormatData && !newFormatData) {
      try {
        console.log("發現舊格式資料，開始遷移...");
        const oldData = JSON.parse(oldFormatData);
        const migratedData = migrateOldDataToNewFormat(oldData);

        // 儲存遷移後的資料到新 key
        localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(migratedData));
        localStorage.setItem("leetcode-tracker-version", DATA_VERSION);

        // 備份並刪除舊資料
        const backupKey = `leetcode-tracker-progress-backup-${new Date().toISOString().split('T')[0]}`;
        localStorage.setItem(backupKey, oldFormatData);
        localStorage.removeItem(OLD_STORAGE_KEY);

        console.log(`資料遷移完成！新資料已儲存，舊資料已備份到 ${backupKey}`);
        return migratedData;
      } catch (error) {
        console.error("資料遷移失敗:", error);
        return defaultData;
      }
    }

    // 沒有任何現有資料，建立新的預設資料
    console.log("建立新的預設資料");
    localStorage.setItem("leetcode-tracker-version", DATA_VERSION);
    return defaultData;
  };

  const [topicProgress, setTopicProgress] = useLocalStorage<TopicProgress[]>(
    NEW_STORAGE_KEY,
    getInitialData()
  );

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>0x3F LeetCode 刷題追蹤器 (LeetCode Problem Tracker)</h1>
      </header>
      
      <div className="app-container">
        <Sidebar
          topics={topics}
          topicProgress={topicProgress}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCollapseChange={setSidebarCollapsed}
        />
        
        <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {children({ activeTab, topicProgress, setTopicProgress })}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;