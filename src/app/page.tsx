"use client";

import React from "react";
import { topics } from "../data/topics";
import { Problem, TopicProgress, Chapter } from "../types";
import TopicTab from "../components/TopicTab";
import TopicTabStructured from "../components/TopicTabStructured";
import Dashboard from "../components/Dashboard";
import Analytics from "../components/Analytics";
import HomePage from "../components/HomePage";
import { useLayout } from "../contexts/LayoutContext";

export default function Home() {
  const { activeTab, topicProgress, setTopicProgress } = useLayout();

  const getCurrentTopicProblems = (tab: string | number, progress: TopicProgress[]) =>
    typeof tab === "number"
      ? progress.find((tp) => tp.topicId === tab)?.problems || []
      : [];

  const getCurrentTopicChapters = (tab: string | number, progress: TopicProgress[]) =>
    typeof tab === "number"
      ? progress.find((tp) => tp.topicId === tab)?.chapters || []
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

  const currentTopicProblems = getCurrentTopicProblems(activeTab, topicProgress);
  const currentTopicChapters = getCurrentTopicChapters(activeTab, topicProgress);

  return (
    <>
      {activeTab === "home" && <HomePage />}
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
    </>
  );
}