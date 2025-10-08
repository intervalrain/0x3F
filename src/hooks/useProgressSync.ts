"use client";

import { useEffect, useRef } from "react";
import { TopicProgress } from "@/types";
import { useAuth } from "./useAuth";

interface UseProgressSyncOptions {
  enabled?: boolean;
}

export function useProgressSync(
  topicProgress: TopicProgress[],
  options: UseProgressSyncOptions = {}
) {
  const { enabled = true } = options;

  const { isAuthenticated, isSyncing, permissions } = useAuth();
  const syncQueueRef = useRef<TopicProgress[]>([]);

  // 更新同步佇列
  useEffect(() => {
    syncQueueRef.current = topicProgress;
  }, [topicProgress]);

  // 只在視窗關閉時同步（限 Certificate 和 Admin 用戶）
  useEffect(() => {
    if (!enabled || !isAuthenticated || !permissions.canSyncToCloud) return;

    const handleBeforeUnload = () => {
      if (syncQueueRef.current.length > 0) {
        console.log('[Cloud Sync] Syncing on window close...');
        // 使用 sendBeacon 確保在頁面卸載前發送
        navigator.sendBeacon(
          "/api/sync",
          JSON.stringify({
            topicProgress: syncQueueRef.current,
            forceOverwrite: false,
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, isAuthenticated, permissions.canSyncToCloud]);

  return {
    isSyncing,
    canSync: permissions.canSyncToCloud,
  };
}