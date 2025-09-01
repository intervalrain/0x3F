import React from 'react';
import { Problem } from '../types';

interface ProblemItemProps {
  problem: Problem;
  onToggle: (problemId: string) => void;
}

const ProblemItem: React.FC<ProblemItemProps> = ({ problem, onToggle }) => {
  const handleCheckboxChange = () => {
    onToggle(problem.id);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="problem-item">
      <input
        type="checkbox"
        checked={problem.completed}
        onChange={handleCheckboxChange}
        className="problem-checkbox"
      />
      <div className="problem-content">
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="problem-link"
        >
          {problem.title}
        </a>
        {problem.completed && problem.completedAt && (
          <span className="completion-date">
            完成於: {new Date(problem.completedAt).toLocaleString('zh-TW')}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProblemItem;