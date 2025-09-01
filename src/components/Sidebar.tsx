"use client";

import React, { useState } from 'react';
import { Topic } from '../data/topics';
import { TopicProgress } from '../types';

interface SidebarProps {
  topics: Topic[];
  topicProgress: TopicProgress[];
  activeTab: string | number;
  onTabChange: (tab: string | number) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  topics, 
  topicProgress, 
  activeTab, 
  onTabChange,
  onCollapseChange 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
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
          onClick={() => onTabChange("dashboard")}
        >
          📊
        </button>
        <button
          className={`mobile-tab ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => onTabChange("analytics")}
        >
          📈
        </button>
        {topics.map((topic) => {
          const { completed, total } = getTabProgress(topic.id);
          return (
            <button
              key={topic.id}
              className={`mobile-tab ${activeTab === topic.id ? "active" : ""}`}
              onClick={() => onTabChange(topic.id)}
              title={topic.title}
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
            onClick={() => onTabChange("dashboard")}
          >
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-label">總覽</span>
          </button>
          <button
            className={`sidebar-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => onTabChange("analytics")}
          >
            <span className="sidebar-icon">📈</span>
            <span className="sidebar-label">統計</span>
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">刷題主題</h3>
        <div className="sidebar-menu">
          {topics.map((topic) => {
            const { completed, total } = getTabProgress(topic.id);
            return (
              <button
                key={topic.id}
                className={`sidebar-item ${activeTab === topic.id ? "active" : ""}`}
                onClick={() => onTabChange(topic.id)}
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
    </aside>
  );
};

export default Sidebar;