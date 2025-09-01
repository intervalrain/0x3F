import React, { useState } from 'react';
import { Topic } from '../data/topics';
import { Problem, Chapter } from '../types';
import ChapterView from './ChapterView';
import AddProblemForm from './AddProblemForm';

interface TopicTabStructuredProps {
  topic: Topic;
  chapters: Chapter[];
  onToggleProblem: (problemId: string) => void;
  onAddProblem: (problem: Problem) => void;
  onAddChapter: (chapter: Chapter) => void;
  onAddSubsection: (chapterId: string, subsection: { id: string; title: string; problems: Problem[] }) => void;
}

const TopicTabStructured: React.FC<TopicTabStructuredProps> = ({
  topic,
  chapters,
  onToggleProblem,
  onAddProblem,
  onAddChapter,
  onAddSubsection
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Calculate total progress
  const totalProblems = chapters.reduce((total, chapter) => 
    total + chapter.subsections.reduce((subtotal, subsection) => 
      subtotal + subsection.problems.length, 0), 0);
  
  const completedProblems = chapters.reduce((total, chapter) => 
    total + chapter.subsections.reduce((subtotal, subsection) => 
      subtotal + subsection.problems.filter(p => p.completed).length, 0), 0);
  
  const completionRate = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

  return (
    <div className="topic-tab-structured">
      <div className="topic-header">
        <h2>{topic.title}</h2>
        <div className="topic-actions">
          <a 
            href={topic.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="topic-link"
          >
            前往 LeetCode 題庫 (Go to LeetCode)
          </a>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="toggle-form-btn"
          >
            {showAddForm ? '隱藏表單' : '新增內容'}
          </button>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-info">
          <span>總進度: {completedProblems}/{totalProblems} ({completionRate}%)</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {showAddForm && (
        <AddProblemForm
          topicId={topic.id}
          chapters={chapters}
          onAddProblem={onAddProblem}
          onAddChapter={onAddChapter}
          onAddSubsection={onAddSubsection}
        />
      )}

      <div className="chapters-container">
        {chapters.length === 0 ? (
          <div className="empty-state">
            <p>尚未新增任何章節內容</p>
            <p>請點擊「新增內容」開始建立章節和題目</p>
          </div>
        ) : (
          chapters.map(chapter => (
            <ChapterView
              key={chapter.id}
              chapter={chapter}
              onToggleProblem={onToggleProblem}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TopicTabStructured;