"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
} from '@mui/material';
import { topics } from '../data/topics';
import { TopicProgress } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { allTopicsDataByIndex } from '../data/allTopicsData';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useProgressSync } from '../hooks/useProgressSync';
import SyncConflictModal from './SyncConflictModal';
import { ArticleNode } from '../lib/articles';
import Footer from './Footer';
import Header from './Header';
import { useLayout } from '../contexts/LayoutContext';

interface AppLayoutProps {
  children: (props: {
    activeTab: string | number;
    topicProgress: TopicProgress[];
    setTopicProgress: React.Dispatch<React.SetStateAction<TopicProgress[]>>;
  }) => React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string | number>("home");
  const [isClient, setIsClient] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState<{ local: TopicProgress[], cloud: TopicProgress[] } | null>(null);
  const [articleTree, setArticleTree] = useState<ArticleNode[]>([]);

  // Context hooks
  const { setMobileDrawerOpen } = useLayout();

  // Auth hooks
  const { isAuthenticated, fetchCloudProgress, syncToCloud, mergeProgress } = useAuth();
  
  // 資料版本，當我們更新資料結構時增加這個版本號
  const DATA_VERSION = "3.1.0";
  const OLD_STORAGE_KEY = "leetcode-tracker-progress";
  const NEW_STORAGE_KEY = "leetcode-tracker-progress-v3";

  // Helper function: 將舊格式轉換為新格式
  const migrateOldDataToNewFormat = (oldData: TopicProgress[]): TopicProgress[] => {
    console.log("🔄 開始遷移舊資料格式...");

    return topics.map((topic) => {
      const oldTopicData = oldData.find((tp) => tp.topicId === topic.id);
      const baseChapters = allTopicsDataByIndex[topic.id] || []; // 直接使用 topic.id

      if (!oldTopicData) {
        // 沒有舊資料，直接使用新格式
        return {
          topicId: topic.id,
          problems: [],
          chapters: baseChapters,
        };
      }

      let completedCount = 0;

      // 將舊的 problems 完成狀態合併到新的 chapters 結構
      const migratedChapters = baseChapters.map(chapter => ({
        ...chapter,
        subsections: chapter.subsections.map(subsection => ({
          ...subsection,
          problems: subsection.problems.map(problem => {
            // 在舊資料中尋找相同的題目（透過 number 或 id 比對）
            const oldProblem = oldTopicData.problems?.find((op) =>
              op.number?.toString() === problem.number.toString() ||
              op.id === problem.id
            );

            if (oldProblem && oldProblem.completed) {
              completedCount++;
              console.log(`✅ 遷移題目 ${problem.number}: ${problem.title} - 已完成`);
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
      if (oldTopicData.chapters) {
        oldTopicData.chapters.forEach((oldChapter) => {
          oldChapter.subsections?.forEach((oldSubsection) => {
            oldSubsection.problems?.forEach((oldProblem) => {
              if (oldProblem.completed) {
                // 嘗試在新結構中找到對應的題目並標記為完成
                migratedChapters.forEach(newChapter => {
                  newChapter.subsections.forEach(newSubsection => {
                    const matchingProblem = newSubsection.problems.find(p =>
                      p.number?.toString() === oldProblem.number?.toString() ||
                      p.id === oldProblem.id
                    );
                    if (matchingProblem && !matchingProblem.completed) {
                      completedCount++;
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

      console.log(`Topic ${topic.id} 遷移完成:`, { completedProblems: completedCount });

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
      chapters: allTopicsDataByIndex[topic.id] || [], // 直接使用 topic.id
    }));

    // SSR 時直接返回預設資料，避免 hydration 錯誤
    if (typeof window === "undefined") {
      return defaultData;
    }

    const storedVersion = localStorage.getItem("leetcode-tracker-version");
    const oldFormatData = localStorage.getItem(OLD_STORAGE_KEY);
    const newFormatData = localStorage.getItem(NEW_STORAGE_KEY);

    // 如果已經有新格式資料且版本正確，直接返回
    if (newFormatData && storedVersion === DATA_VERSION) {
      try {
        return JSON.parse(newFormatData);
      } catch (error) {
        console.error("❌ 解析新格式資料失敗:", error);
        return defaultData;
      }
    }

    // 如果有舊格式資料且版本不匹配，執行遷移
    if (oldFormatData && storedVersion !== DATA_VERSION) {
      try {
        console.log("🔄 發現舊格式資料，開始遷移...");
        const oldData = JSON.parse(oldFormatData);
        const migratedData = migrateOldDataToNewFormat(oldData);

        // 儲存遷移後的資料到新 key
        localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(migratedData));
        localStorage.setItem("leetcode-tracker-version", DATA_VERSION);

        // 備份並刪除舊資料
        const backupKey = `leetcode-tracker-progress-backup-${new Date().toISOString().split('T')[0]}`;
        localStorage.setItem(backupKey, oldFormatData);
        localStorage.removeItem(OLD_STORAGE_KEY);

        console.log(`✅ 資料遷移完成！新資料已儲存，舊資料已備份到 ${backupKey}`);
        console.log("Migrated data preview:", {
          topics: migratedData.length,
          firstTopic: migratedData[0]
        });
        return migratedData;
      } catch (error) {
        console.error("❌ 資料遷移失敗:", error);
        return defaultData;
      }
    }

    // 沒有任何現有資料，建立新的預設資料
    console.log("🆕 建立新的預設資料");
    localStorage.setItem("leetcode-tracker-version", DATA_VERSION);
    return defaultData;
  };

  // 標記客戶端已載入，避免 SSR hydration 錯誤
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 載入文章樹狀結構
  useEffect(() => {
    if (isClient) {
      fetch('/api/articles/tree')
        .then(res => res.json())
        .then(data => setArticleTree(data))
        .catch(err => console.error('Failed to load article tree:', err));
    }
  }, [isClient]);

  // 從 URL 參數讀取 tab
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        // 嘗試將 tab 轉換為數字（topic ID）或使用字串（dashboard/analytics）
        const tabValue = !isNaN(Number(tabParam)) ? Number(tabParam) : tabParam;
        setActiveTab(tabValue);
      }
    }
  }, [isClient]);

  const [topicProgress, setTopicProgress] = useLocalStorage<TopicProgress[]>(
    NEW_STORAGE_KEY,
    getInitialData()
  );

  // 使用進度同步 hook
  const { isSyncing } = useProgressSync(topicProgress, {
    enabled: isAuthenticated,
  });

  // 登入後的初始同步（只執行一次）
  const handleInitialSync = useCallback(async (currentTopicProgress: TopicProgress[]) => {
    if (!isAuthenticated || !isClient) return;

    console.log("Starting initial sync...");
    try {
        const cloudData = await fetchCloudProgress();
        console.log("Cloud data:", cloudData);

        if (!cloudData || cloudData.length === 0) {
          // 雲端無資料，上傳本地資料
          console.log("No cloud data, uploading local progress...");
          const result = await syncToCloud(currentTopicProgress);
          console.log("Upload result:", result);
        } else {
          // 檢查版本差異 - 如果是舊版本資料，強制使用本地資料
          const cloudVersions = cloudData.map((d: { version?: string }) => d.version).filter(Boolean);
          const hasOldVersion = cloudVersions.some((v: string) => v !== "3.1.0");

          if (hasOldVersion) {
            console.log("Detected old version data in cloud, forcing local sync...");
            await syncToCloud(currentTopicProgress, true); // 強制覆蓋
            return;
          }

          // 使用雙重哈希來高效比較完成的題目集合
          const calculateDataHash = (data: TopicProgress[], label: string): { hash1: number, hash2: number, count: number, completedProblems: string[] } => {
            let hash1 = 0;
            let hash2 = 0;
            let count = 0;
            const completedProblems: string[] = [];

            data.forEach(tp => {
              tp.chapters?.forEach(ch => {
                ch.subsections?.forEach(ss => {
                  ss.problems?.forEach(p => {
                    if (p.completed) {
                      // 使用 topicId + problemNumber 作為唯一標識
                      const id = `${tp.topicId}-${p.number}`;
                      completedProblems.push(id);

                      // 計算字串的哈希值
                      let stringHash = 0;
                      for (let i = 0; i < id.length; i++) {
                        stringHash = ((stringHash << 5) - stringHash + id.charCodeAt(i)) & 0xffffffff;
                      }

                      // 雙重哈希
                      hash1 = ((hash1 * 31) + stringHash) & 0xffffffff;
                      hash2 = ((hash2 * 37) + stringHash) & 0xffffffff;
                      count++;
                    }
                  });
                });
              });
            });

            // 將計數混入哈希值
            hash1 ^= count;
            hash2 ^= (count << 16);

            console.log(`${label} completed problems:`, completedProblems.slice(0, 5), completedProblems.length > 5 ? `... and ${completedProblems.length - 5} more` : '');

            return { hash1, hash2, count, completedProblems };
          };

          const localHash = calculateDataHash(currentTopicProgress, "Local");
          const cloudProgressData = cloudData.map((d: { data: TopicProgress }) => d.data);
          const cloudHash = calculateDataHash(cloudProgressData, "Cloud");

          const isDataIdentical = (
            localHash.hash1 === cloudHash.hash1 &&
            localHash.hash2 === cloudHash.hash2 &&
            localHash.count === cloudHash.count
          );

          // 備用檢查：直接比較完成的題目列表
          const localSet = new Set(localHash.completedProblems);
          const cloudSet = new Set(cloudHash.completedProblems);
          const isSetIdentical = localSet.size === cloudSet.size &&
            [...localSet].every(item => cloudSet.has(item));

          console.log(`Local: ${localHash.count} problems completed (hash1: ${localHash.hash1}, hash2: ${localHash.hash2})`);
          console.log(`Cloud: ${cloudHash.count} problems completed (hash1: ${cloudHash.hash1}, hash2: ${cloudHash.hash2})`);
          console.log(`Hash identical: ${isDataIdentical}, Set identical: ${isSetIdentical}`);

          if ((isDataIdentical || isSetIdentical) && localHash.count > 0) {
            // 資料完全相同，不顯示衝突
            console.log("Data is identical, no conflict");
            // 使用雲端資料以確保最新
            setTopicProgress(cloudProgressData);
          } else if (localHash.count === 0) {
            // 本地無資料，直接使用雲端
            console.log("No local data, using cloud data");
            setTopicProgress(cloudProgressData);
          } else if (cloudHash.count === 0) {
            // 雲端無資料，上傳本地
            console.log("No cloud data, uploading local data");
            await syncToCloud(currentTopicProgress);
          } else {
            // 有差異，顯示衝突對話框
            console.log("Data differs, showing conflict dialog");
            console.log(`Hash difference - Local: (${localHash.hash1}, ${localHash.hash2}), Cloud: (${cloudHash.hash1}, ${cloudHash.hash2})`);

            // 顯示詳細差異
            const localSet = new Set(localHash.completedProblems);
            const cloudSet = new Set(cloudHash.completedProblems);
            const localOnly = [...localSet].filter(x => !cloudSet.has(x));
            const cloudOnly = [...cloudSet].filter(x => !localSet.has(x));

            if (localOnly.length > 0) {
              console.log("Local only problems:", localOnly.slice(0, 3));
            }
            if (cloudOnly.length > 0) {
              console.log("Cloud only problems:", cloudOnly.slice(0, 3));
            }

            setConflictData({
              local: currentTopicProgress,
              cloud: cloudProgressData
            });
            setShowConflictModal(true);
          }
        }
      } catch (error) {
        console.error("Initial sync failed:", error);
      }
  }, [isAuthenticated, isClient, fetchCloudProgress, syncToCloud, setTopicProgress]);

  // 添加一個 ref 來追蹤是否已經執行過初始同步
  const initialSyncCompleted = useRef(false);

  useEffect(() => {
    if (isAuthenticated && isClient && !initialSyncCompleted.current) {
      console.log("Executing initial sync...");
      initialSyncCompleted.current = true;
      handleInitialSync(topicProgress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isClient]); // 故意忽略 handleInitialSync 和 topicProgress 依賴以避免無限循環

  // 處理衝突解決
  const handleConflictResolution = useCallback(async (strategy: 'local' | 'cloud' | 'merge') => {
    if (!conflictData) return;

    let finalProgress: TopicProgress[];

    switch (strategy) {
      case 'local':
        finalProgress = conflictData.local;
        await syncToCloud(finalProgress, true);
        break;
      case 'cloud':
        finalProgress = conflictData.cloud;
        setTopicProgress(finalProgress);
        break;
      case 'merge':
        // 智能合併
        finalProgress = conflictData.local.map((localTp, idx) => {
          const cloudTp = conflictData.cloud[idx];
          if (!cloudTp) return localTp;
          return mergeProgress(localTp, cloudTp);
        });
        setTopicProgress(finalProgress);
        await syncToCloud(finalProgress, true);
        break;
    }

    setShowConflictModal(false);
    setConflictData(null);
  }, [conflictData, syncToCloud, mergeProgress, setTopicProgress]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        isSyncing={isSyncing}
        onNavigate={setActiveTab}
        onMenuClick={() => setMobileDrawerOpen(true)}
      />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Box
          sx={{
            opacity: isClient ? 1 : 0,
            pointerEvents: isClient ? 'auto' : 'none',
            transition: 'opacity 0.2s',
          }}
        >
          <Sidebar
            topics={topics}
            topicProgress={topicProgress}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            articleTree={articleTree}
          />
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
          }}
        >
          {children({ activeTab, topicProgress, setTopicProgress })}
        </Box>
      </Box>

      <Footer />

      {/* 衝突解決 Modal */}
      {showConflictModal && conflictData && (
        <SyncConflictModal
          localData={conflictData.local}
          cloudData={conflictData.cloud}
          onResolve={handleConflictResolution}
          onCancel={() => {
            setShowConflictModal(false);
            setConflictData(null);
          }}
        />
      )}
    </Box>
  );
};

export default AppLayout;