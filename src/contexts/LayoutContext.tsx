"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TopicProgress } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { topics } from '../data/topics';
import { allTopicsDataByIndex } from '../data/allTopicsData';
import { ArticleNode } from '../lib/articles';

interface LayoutContextType {
  // Tab state
  activeTab: string | number;
  setActiveTab: (tab: string | number) => void;

  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;

  // TreeView state
  expandedItems: string[];
  setExpandedItems: (items: string[]) => void;

  // Progress data
  topicProgress: TopicProgress[];
  setTopicProgress: React.Dispatch<React.SetStateAction<TopicProgress[]>>;

  // Article tree
  articleTree: ArticleNode[];
  setArticleTree: (tree: ArticleNode[]) => void;

  // Loading state
  isClient: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string | number>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['problems-root', 'articles-root']);
  const [articleTree, setArticleTree] = useState<ArticleNode[]>([]);
  const [isClient, setIsClient] = useState(false);

  const NEW_STORAGE_KEY = "leetcode-tracker-progress-v3";

  // Initialize topic progress
  const initialProgress: TopicProgress[] = topics.map((topic) => ({
    topicId: topic.id,
    problems: [],
    chapters: allTopicsDataByIndex[topic.id] || [],
  }));

  const [topicProgress, setTopicProgress] = useLocalStorage<TopicProgress[]>(
    NEW_STORAGE_KEY,
    initialProgress
  );

  // Client-side only effects
  useEffect(() => {
    setIsClient(true);

    // Load expanded items from localStorage
    const savedExpanded = localStorage.getItem('treeview-expanded');
    if (savedExpanded) {
      try {
        setExpandedItems(JSON.parse(savedExpanded));
      } catch (e) {
        console.error('Failed to parse expanded items:', e);
      }
    }

    // Load sidebar width from localStorage
    const savedWidth = localStorage.getItem('sidebar-width');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= 200 && width <= 500) {
        setSidebarWidth(width);
      }
    }

    // Load article tree from pre-generated static JSON
    fetch('/article-tree.json')
      .then(res => res.json())
      .then(data => setArticleTree(data || []))
      .catch(err => console.error('Failed to load article tree:', err));
  }, []);

  // Save expanded items to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('treeview-expanded', JSON.stringify(expandedItems));
    }
  }, [expandedItems, isClient]);

  // Save sidebar width to localStorage
  useEffect(() => {
    if (isClient && sidebarWidth !== 280) {
      localStorage.setItem('sidebar-width', sidebarWidth.toString());
    }
  }, [sidebarWidth, isClient]);

  const value: LayoutContextType = {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarWidth,
    setSidebarWidth,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    expandedItems,
    setExpandedItems,
    topicProgress,
    setTopicProgress,
    articleTree,
    setArticleTree,
    isClient,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};