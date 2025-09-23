"use client";

import { useEffect, useRef, useCallback } from "react";
import { TopicProgress } from "@/types";
import { useAuth } from "./useAuth";

interface UseProgressSyncOptions {
  enabled?: boolean;
  syncInterval?: number; // milliseconds
  debounceDelay?: number; // milliseconds
}

export function useProgressSync(
  topicProgress: TopicProgress[],
  options: UseProgressSyncOptions = {}
) {
  const {
    enabled = true,
    syncInterval = 30000, // 30 seconds
    debounceDelay = 2000, // 2 seconds
  } = options;

  const { isAuthenticated, syncToCloud, isSyncing } = useAuth();
  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSyncRef = useRef<string>();
  const syncQueueRef = useRef<TopicProgress[]>([]);

  // Debounced sync function
  const debouncedSync = useCallback((progress: TopicProgress[]) => {
    if (!enabled || !isAuthenticated || isSyncing) return;

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Update sync queue
    syncQueueRef.current = progress;

    // Set new timeout
    syncTimeoutRef.current = setTimeout(async () => {
      const progressString = JSON.stringify(syncQueueRef.current);

      // Skip if no changes
      if (progressString === lastSyncRef.current) {
        return;
      }

      try {
        const results = await syncToCloud(syncQueueRef.current);

        // Handle conflicts
        const conflicts = results.filter(r => r.status === 'conflict');
        if (conflicts.length > 0) {
          console.log("Sync conflicts detected:", conflicts);
          // TODO: Show conflict resolution UI
        }

        lastSyncRef.current = progressString;
      } catch (error) {
        console.error("Auto sync failed:", error);
        // Retry logic could be implemented here
      }
    }, debounceDelay);
  }, [enabled, isAuthenticated, isSyncing, syncToCloud, debounceDelay]);

  // Auto sync on progress changes
  useEffect(() => {
    if (enabled && isAuthenticated && topicProgress.length > 0) {
      debouncedSync(topicProgress);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [topicProgress, enabled, isAuthenticated, debouncedSync]);

  // Periodic sync
  useEffect(() => {
    if (!enabled || !isAuthenticated || syncInterval <= 0) return;

    const intervalId = setInterval(() => {
      if (syncQueueRef.current.length > 0) {
        debouncedSync(syncQueueRef.current);
      }
    }, syncInterval);

    return () => clearInterval(intervalId);
  }, [enabled, isAuthenticated, syncInterval, debouncedSync]);

  // Sync on window close/unload
  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    const handleBeforeUnload = () => {
      if (syncQueueRef.current.length > 0) {
        // Try to sync synchronously (best effort)
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
  }, [enabled, isAuthenticated]);

  return {
    isSyncing,
    forceSync: () => debouncedSync(topicProgress),
  };
}