"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useCallback, useMemo } from "react";
import { TopicProgress } from "@/types";
import { getUserPermissions, type UserPermissions } from "@/lib/syncPolicy";

interface SyncResult {
  topicId: string;
  status: 'success' | 'conflict' | 'error';
  cloudData?: TopicProgress;
  cloudUpdatedAt?: string;
  error?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // 登入 - 導向登入頁面讓用戶選擇登入方式
  const login = useCallback(async () => {
    try {
      // 導向登入頁面，讓用戶選擇 Google 或 GitHub
      await signIn(undefined, { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Login error:", error);
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  // 從雲端獲取進度
  const fetchCloudProgress = useCallback(async () => {
    if (!session?.user) return null;

    try {
      const response = await fetch("/api/sync");
      if (!response.ok) {
        throw new Error("Failed to fetch progress");
      }
      const data = await response.json();
      return data.progress;
    } catch (error) {
      console.error("Fetch progress error:", error);
      setSyncError("無法獲取雲端進度");
      return null;
    }
  }, [session]);

  // 同步進度到雲端
  const syncToCloud = useCallback(async (
    topicProgress: TopicProgress[],
    forceOverwrite: boolean = false
  ): Promise<SyncResult[]> => {
    if (!session?.user) {
      return [];
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicProgress,
          forceOverwrite,
        }),
      });

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Sync error:", error);
      setSyncError("同步失敗，請稍後再試");
      return [];
    } finally {
      setIsSyncing(false);
    }
  }, [session]);

  // 刪除雲端進度
  const deleteCloudProgress = useCallback(async (topicId?: string) => {
    if (!session?.user) return false;

    try {
      const url = topicId
        ? `/api/sync?topicId=${topicId}`
        : '/api/sync';

      const response = await fetch(url, {
        method: "DELETE",
      });

      return response.ok;
    } catch (error) {
      console.error("Delete progress error:", error);
      return false;
    }
  }, [session]);

  // 合併本地和雲端資料
  const mergeProgress = useCallback((
    localProgress: TopicProgress,
    cloudProgress: TopicProgress
  ): TopicProgress => {
    // 智能合併邏輯：保留較新或較完整的進度
    const mergedChapters = localProgress.chapters?.map((localChapter, chapterIdx) => {
      const cloudChapter = cloudProgress.chapters?.[chapterIdx];
      if (!cloudChapter) return localChapter;

      return {
        ...localChapter,
        subsections: localChapter.subsections.map((localSubsection, subsectionIdx) => {
          const cloudSubsection = cloudChapter.subsections?.[subsectionIdx];
          if (!cloudSubsection) return localSubsection;

          return {
            ...localSubsection,
            problems: localSubsection.problems.map((localProblem, problemIdx) => {
              const cloudProblem = cloudSubsection.problems?.[problemIdx];
              if (!cloudProblem) return localProblem;

              // 如果任一邊標記為完成，則合併後也標記為完成
              if (localProblem.completed || cloudProblem.completed) {
                return {
                  ...localProblem,
                  completed: true,
                  completedAt: localProblem.completedAt || cloudProblem.completedAt || new Date().toISOString(),
                };
              }

              return localProblem;
            }),
          };
        }),
      };
    });

    return {
      ...localProgress,
      chapters: mergedChapters || localProgress.chapters,
    };
  }, []);

  // 計算用戶權限
  const permissions = useMemo<UserPermissions>(() => {
    return getUserPermissions(session?.user?.email);
  }, [session?.user?.email]);

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isSyncing,
    syncError,
    permissions,
    login,
    logout,
    fetchCloudProgress,
    syncToCloud,
    deleteCloudProgress,
    mergeProgress,
  };
}