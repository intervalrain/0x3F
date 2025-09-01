"use client";

import React, { useState } from 'react';
import { topics } from '../data/topics';
import { TopicProgress } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { allTopicsData } from '../data/allTopicsData';
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
  const DATA_VERSION = "2.0.0";

  const getInitialData = () => {
    if (typeof window !== "undefined") {
      const storedVersion = localStorage.getItem("leetcode-tracker-version");
      if (storedVersion !== DATA_VERSION) {
        // 版本不匹配，清除舊資料並使用新資料
        localStorage.removeItem("leetcode-tracker-progress");
        localStorage.setItem("leetcode-tracker-version", DATA_VERSION);
      }
    }

    return topics.map((topic) => ({
      topicId: topic.id,
      problems: [],
      chapters: allTopicsData[topic.id] || [],
    }));
  };

  const [topicProgress, setTopicProgress] = useLocalStorage<TopicProgress[]>(
    "leetcode-tracker-progress",
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