"use client";

import React from "react";
import { topics } from "../data/topics";
import { Problem, TopicProgress, Chapter } from "../types";
import TopicTab from "../components/TopicTab";
import TopicTabStructured from "../components/TopicTabStructured";
import Dashboard from "../components/Dashboard";
import Analytics from "../components/Analytics";
import AppLayout from "../components/AppLayout";

export default function Home() {
  const getCurrentTopicProblems = (activeTab: string | number, topicProgress: TopicProgress[]) =>
    typeof activeTab === "number"
      ? topicProgress.find((tp) => tp.topicId === activeTab)?.problems || []
      : [];

  const getCurrentTopicChapters = (activeTab: string | number, topicProgress: TopicProgress[]) =>
    typeof activeTab === "number"
      ? topicProgress.find((tp) => tp.topicId === activeTab)?.chapters || []
      : [];

  const createHandleToggleProblem = (
    activeTab: string | number,
    setTopicProgress: React.Dispatch<React.SetStateAction<TopicProgress[]>>
  ) => (problemId: string) => {
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

  const createHandleAddProblem = (
    activeTab: string | number,
    setTopicProgress: React.Dispatch<React.SetStateAction<TopicProgress[]>>
  ) => (problem: Problem) => {
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

  const createHandleAddChapter = (
    activeTab: string | number,
    setTopicProgress: React.Dispatch<React.SetStateAction<TopicProgress[]>>
  ) => (chapter: Chapter) => {
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

  const createHandleAddSubsection = (
    activeTab: string | number,
    setTopicProgress: React.Dispatch<React.SetStateAction<TopicProgress[]>>
  ) => (
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

  return (
    <AppLayout>
      {({ activeTab, topicProgress, setTopicProgress }) => {
        const currentTopicProblems = getCurrentTopicProblems(activeTab, topicProgress);
        const currentTopicChapters = getCurrentTopicChapters(activeTab, topicProgress);
        const handleToggleProblem = createHandleToggleProblem(activeTab, setTopicProgress);
        const handleAddProblem = createHandleAddProblem(activeTab, setTopicProgress);
        const handleAddChapter = createHandleAddChapter(activeTab, setTopicProgress);
        const handleAddSubsection = createHandleAddSubsection(activeTab, setTopicProgress);

        return (
          <>
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
      }}
    </AppLayout>
  );
}
