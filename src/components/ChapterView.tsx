import React from 'react';
import { Chapter } from '../types';

interface ChapterViewProps {
  chapter: Chapter;
  onToggleProblem: (problemId: string) => void;
}

const ChapterView: React.FC<ChapterViewProps> = ({ chapter, onToggleProblem }) => {
  return (
    <div className="chapter-view">
      <h2 className="chapter-title">{chapter.title}</h2>
      
      {chapter.subsections.map(subsection => (
        <div key={subsection.id} className="subsection">
          <h3 className="subsection-title">{subsection.title}</h3>
          
          <div className="problems-grid">
            {subsection.problems.map((problem, problemIndex) => (
              <div key={`${chapter.id}-${subsection.id}-${problem.id}-${problemIndex}`} className="problem-card">
                <div className="problem-header">
                  <span className="problem-number">{problem.number}.</span>
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="problem-title-link"
                  >
                    {problem.title}
                    {problem.isPremium && (
                      <span className="premium-indicator" title="Premium 題目">
                        🔒
                      </span>
                    )}
                  </a>
                  {problem.difficulty && (
                    <span className="difficulty-badge">
                      {problem.difficulty}
                    </span>
                  )}
                </div>
                
                <div className="problem-actions">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={problem.completed}
                      onChange={() => onToggleProblem(problem.id)}
                      className="problem-checkbox"
                    />
                    <span className="checkmark"></span>
                    {problem.completed ? '已完成' : '未完成'}
                  </label>
                  
                  {problem.completed && problem.completedAt && (
                    <div className="completion-info">
                      完成於: {new Date(problem.completedAt).toLocaleString('zh-TW')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterView;