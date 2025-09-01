"use client";

import React, { useState } from "react";
import { topics } from "../data/topics";
import { Problem, TopicProgress, Chapter } from "../types";
import TopicTab from "../components/TopicTab";
import TopicTabStructured from "../components/TopicTabStructured";
import Dashboard from "../components/Dashboard";
import Analytics from "../components/Analytics";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { allTopicsData } from "../data/allTopicsData";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string | number>("dashboard");
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

  const currentTopicProblems =
    typeof activeTab === "number"
      ? topicProgress.find((tp) => tp.topicId === activeTab)?.problems || []
      : [];

  const currentTopicChapters =
    typeof activeTab === "number"
      ? topicProgress.find((tp) => tp.topicId === activeTab)?.chapters || []
      : [];

  const handleToggleProblem = (problemId: string) => {
    if (typeof activeTab !== "number") return;

    setTopicProgress((prev: TopicProgress[]) =>
      prev.map((tp: TopicProgress) => {
        if (tp.topicId === activeTab) {
          // Handle problems in chapters/subsections
          const updatedChapters = tp.chapters.map((chapter: Chapter) => ({
            ...chapter,
            subsections: chapter.subsections.map((subsection) => ({
              ...subsection,
              problems: subsection.problems.map((p: Problem) => {
                if (p.id === problemId) {
                  return {
                    ...p,
                    completed: !p.completed,
                    completedAt: !p.completed
                      ? new Date().toISOString()
                      : undefined,
                  };
                }
                return p;
              }),
            })),
          }));

          // Handle problems in the old format
          const updatedProblems = tp.problems.map((p: Problem) => {
            if (p.id === problemId) {
              return {
                ...p,
                completed: !p.completed,
                completedAt: !p.completed
                  ? new Date().toISOString()
                  : undefined,
              };
            }
            return p;
          });

          return {
            ...tp,
            chapters: updatedChapters,
            problems: updatedProblems,
          };
        }
        return tp;
      })
    );
  };

  const handleAddProblem = (problem: Problem) => {
    if (typeof activeTab !== "number") return;

    setTopicProgress((prev: TopicProgress[]) =>
      prev.map((tp: TopicProgress) => {
        if (tp.topicId === activeTab) {
          if (problem.chapterId && problem.subsectionId) {
            // Add to structured format
            const updatedChapters = tp.chapters.map((chapter: Chapter) => {
              if (chapter.id === problem.chapterId) {
                return {
                  ...chapter,
                  subsections: chapter.subsections.map((subsection) => {
                    if (subsection.id === problem.subsectionId) {
                      return {
                        ...subsection,
                        problems: [...subsection.problems, problem],
                      };
                    }
                    return subsection;
                  }),
                };
              }
              return chapter;
            });
            return {
              ...tp,
              chapters: updatedChapters,
            };
          } else {
            // Add to old format
            return {
              ...tp,
              problems: [...tp.problems, problem],
            };
          }
        }
        return tp;
      })
    );
  };

  const handleAddChapter = (chapter: Chapter) => {
    if (typeof activeTab !== "number") return;

    setTopicProgress((prev: TopicProgress[]) =>
      prev.map((tp: TopicProgress) => {
        if (tp.topicId === activeTab) {
          return {
            ...tp,
            chapters: [...tp.chapters, chapter],
          };
        }
        return tp;
      })
    );
  };

  const handleAddSubsection = (
    chapterId: string,
    subsection: { id: string; title: string; problems: Problem[] }
  ) => {
    if (typeof activeTab !== "number") return;

    setTopicProgress((prev: TopicProgress[]) =>
      prev.map((tp: TopicProgress) => {
        if (tp.topicId === activeTab) {
          const updatedChapters = tp.chapters.map((chapter: Chapter) => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                subsections: [...chapter.subsections, subsection],
              };
            }
            return chapter;
          });
          return {
            ...tp,
            chapters: updatedChapters,
          };
        }
        return tp;
      })
    );
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
    <div className="App">
      <header className="App-header">
        <h1>0x3F LeetCode 刷題追蹤器 (LeetCode Problem Tracker)</h1>
      </header>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="tab-title">📊 總覽</span>
          </button>
          <button
            className={`tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <span className="tab-title">📈 統計</span>
          </button>
        </div>
      </div>
      <div className="tabs-container">
        <div className="tabs">
          {topics.map((topic) => {
            const { completed, total } = getTabProgress(topic.id);
            return (
              <button
                key={topic.id}
                className={`tab ${activeTab === topic.id ? "active" : ""}`}
                onClick={() => setActiveTab(topic.id)}
              >
                <span className="tab-number">{topic.id}.</span>
                <span className="tab-title">{topic.title}</span>
                {total > 0 && (
                  <span className="tab-progress">
                    {completed}/{total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <Dashboard topics={topics} topicProgress={topicProgress} />
        )}
        {activeTab === "analytics" && (
          <Analytics topics={topics} topicProgress={topicProgress} />
        )}
        {topics.map(
          (topic) =>
            activeTab === topic.id &&
            (currentTopicChapters.length > 0 ? (
              <TopicTabStructured
                key={topic.id}
                topic={topic}
                chapters={currentTopicChapters}
                onToggleProblem={handleToggleProblem}
                onAddProblem={handleAddProblem}
                onAddChapter={handleAddChapter}
                onAddSubsection={handleAddSubsection}
              />
            ) : (
              <TopicTab
                key={topic.id}
                topic={topic}
                problems={currentTopicProblems}
                onToggleProblem={handleToggleProblem}
                onAddProblem={handleAddProblem}
              />
            ))
        )}
      </main>
    </div>
  );
}
