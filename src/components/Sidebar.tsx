"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Topic } from '../data/topics';
import { TopicProgress } from '../types';
import { ArticleNode } from '../lib/articles';

interface SidebarProps {
  topics: Topic[];
  topicProgress: TopicProgress[];
  activeTab: string | number;
  onTabChange: (tab: string | number) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  articleTree?: ArticleNode[];
}

const Sidebar: React.FC<SidebarProps> = ({
  topics,
  topicProgress,
  activeTab,
  onTabChange,
  onCollapseChange,
  articleTree = []
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // 初始化時就從 localStorage 讀取狀態，避免閃爍
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      return savedCollapsed === 'true';
    }
    return false;
  });

  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const [articlesExpanded, setArticlesExpanded] = useState(true);
  const [hoveredTooltip, setHoveredTooltip] = useState<{ text: string; top: number } | null>(null);

  // 檢查是否在文章頁面
  const isOnArticlePage = pathname?.startsWith('/articles/');

  // 通知父組件初始狀態
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      if (savedCollapsed === 'true') {
        onCollapseChange?.(true);
      }
    }
  }, [onCollapseChange]);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebar-collapsed', String(newCollapsed));
    onCollapseChange?.(newCollapsed);
  };

  const handleTabClick = (tab: string | number) => {
    if (isOnArticlePage) {
      // 如果在文章頁面，需要導航回主頁並設置 activeTab
      router.push(`/?tab=${tab}`);
    } else {
      // 在主頁面，直接改變 activeTab
      onTabChange(tab);
    }
  };

  const toggleArticleFolder = (path: string) => {
    if (isCollapsed) {
      // 在 collapsed 狀態下，直接導航到資料夾頁面
      window.location.href = path;
    } else {
      // 在展開狀態下，切換資料夾的展開/收合
      setExpandedArticles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(path)) {
          newSet.delete(path);
        } else {
          newSet.add(path);
        }
        return newSet;
      });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, text: string) => {
    if (isCollapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredTooltip({
        text,
        top: rect.top + rect.height / 2
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredTooltip(null);
  };
  const getTabProgress = (topicId: number) => {
    const topicData = topicProgress.find((tp) => tp.topicId === topicId);
    if (!topicData) return { completed: 0, total: 0 };

    // Count problems in old format
    const oldProblems = topicData.problems || [];
    const oldCompleted = oldProblems.filter((p) => p.completed).length;

    // Count problems in structured format
    const chapterProblems =
      topicData.chapters?.reduce(
        (total, chapter) =>
          total +
          chapter.subsections.reduce(
            (subtotal, subsection) => subtotal + subsection.problems.length,
            0
          ),
        0
      ) || 0;

    const chapterCompleted =
      topicData.chapters?.reduce(
        (total, chapter) =>
          total +
          chapter.subsections.reduce(
            (subtotal, subsection) =>
              subtotal + subsection.problems.filter((p) => p.completed).length,
            0
          ),
        0
      ) || 0;

    return {
      completed: oldCompleted + chapterCompleted,
      total: oldProblems.length + chapterProblems,
    };
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={handleToggle}
        title={isCollapsed ? "展開側邊欄" : "收合側邊欄"}
      >
        <span className="sidebar-toggle-icon">◀</span>
      </button>
      
      {/* 手機版收合時的水平 tab bar */}
      <div className="mobile-tab-bar">
        <button
          className={`mobile-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => handleTabClick("dashboard")}
          title="總覽"
        >
          📊
        </button>
        <button
          className={`mobile-tab ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => handleTabClick("analytics")}
          title="統計"
        >
          📈
        </button>
        {topics.map((topic) => {
          const { completed, total } = getTabProgress(topic.id);
          const tooltipText = total > 0 ? `${topic.title} (${completed}/${total})` : topic.title;
          return (
            <button
              key={topic.id}
              className={`mobile-tab ${activeTab === topic.id ? "active" : ""}`}
              onClick={() => handleTabClick(topic.id)}
              title={tooltipText}
            >
              <span className="mobile-tab-number">{topic.id}</span>
              {total > 0 && (
                <span className="mobile-tab-progress">{completed}/{total}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">主要功能</h3>
        <div className="sidebar-menu">
          <button
            className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => handleTabClick("dashboard")}
            onMouseEnter={(e) => handleMouseEnter(e, "總覽")}
            onMouseLeave={handleMouseLeave}
            data-tooltip="總覽"
          >
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-label">總覽</span>
          </button>
          <button
            className={`sidebar-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => handleTabClick("analytics")}
            onMouseEnter={(e) => handleMouseEnter(e, "統計")}
            onMouseLeave={handleMouseLeave}
            data-tooltip="統計"
          >
            <span className="sidebar-icon">📈</span>
            <span className="sidebar-label">統計</span>
          </button>
        </div>
      </div>

      {articleTree.length > 0 && (
        <div className="sidebar-section">
          {!isCollapsed && (
            <div
              className="sidebar-section-header"
              onClick={() => setArticlesExpanded(!articlesExpanded)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
            >
              <span style={{ fontSize: '14px' }}>{articlesExpanded ? '▼' : '▶'}</span>
              <h3 className="sidebar-section-title" style={{ margin: 0 }}>文章專區</h3>
            </div>
          )}
          {(articlesExpanded || isCollapsed) && (
            <div className="sidebar-menu">
              {articleTree.map((node) => (
                <div key={node.path}>
                  {node.isFolder ? (
                    <>
                      <button
                        className="sidebar-item article-folder"
                        onClick={() => toggleArticleFolder(node.path)}
                        onMouseEnter={(e) => handleMouseEnter(e, node.title)}
                        onMouseLeave={handleMouseLeave}
                        data-tooltip={node.title}
                      >
                        <span className="sidebar-icon">
                          {expandedArticles.has(node.path) ? '📂' : '📁'}
                        </span>
                        <span className="sidebar-label">{node.title}</span>
                      </button>
                      {expandedArticles.has(node.path) && node.children && !isCollapsed && (
                        <div className="article-children">
                          {node.children.map((child) => (
                            <a
                              key={child.path}
                              href={child.path}
                              className="sidebar-item article-item"
                              onMouseEnter={(e) => handleMouseEnter(e, child.title)}
                              onMouseLeave={handleMouseLeave}
                              data-tooltip={child.title}
                            >
                              <span className="sidebar-icon">📄</span>
                              <span className="sidebar-label">{child.title}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={node.path}
                      className="sidebar-item article-item"
                      onMouseEnter={(e) => handleMouseEnter(e, node.title)}
                      onMouseLeave={handleMouseLeave}
                      data-tooltip={node.title}
                    >
                      <span className="sidebar-icon">📄</span>
                      <span className="sidebar-label">{node.title}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">刷題主題</h3>
        <div className="sidebar-menu">
          {topics.map((topic) => {
            const { completed, total } = getTabProgress(topic.id);
            const tooltipText = total > 0 ? `${topic.title} (${completed}/${total})` : topic.title;
            return (
              <button
                key={topic.id}
                className={`sidebar-item ${activeTab === topic.id ? "active" : ""}`}
                onClick={() => handleTabClick(topic.id)}
                onMouseEnter={(e) => handleMouseEnter(e, tooltipText)}
                onMouseLeave={handleMouseLeave}
                data-tooltip={tooltipText}
              >
                <span className="sidebar-number">{topic.id}</span>
                <div className="sidebar-content">
                  <span className="sidebar-label">{topic.title}</span>
                  {total > 0 && (
                    <span className="sidebar-progress">
                      {completed}/{total}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* React-based Tooltip */}
      {hoveredTooltip && (
        <div
          style={{
            position: 'fixed',
            left: '68px',
            top: `${hoveredTooltip.top}px`,
            transform: 'translateY(-50%)',
            background: '#1f2937',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 99999,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
            pointerEvents: 'none',
          }}
        >
          {hoveredTooltip.text}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;