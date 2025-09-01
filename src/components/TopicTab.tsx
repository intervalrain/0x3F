import React, { useState } from 'react';
import { Topic } from '../data/topics';
import { Problem } from '../types';
import ProblemItem from './ProblemItem';

interface TopicTabProps {
  topic: Topic;
  problems: Problem[];
  onToggleProblem: (problemId: string) => void;
  onAddProblem: (problem: Problem) => void;
}

const TopicTab: React.FC<TopicTabProps> = ({ 
  topic, 
  problems, 
  onToggleProblem, 
  onAddProblem 
}) => {
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemUrl, setNewProblemUrl] = useState('');

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProblemTitle.trim() && newProblemUrl.trim()) {
      const newProblem: Problem = {
        id: `${topic.id}-${Date.now()}`,
        topicId: topic.id,
        number: `custom-${Date.now()}`,
        title: newProblemTitle.trim(),
        url: newProblemUrl.trim().replace('leetcode.cn', 'leetcode.com'),
        completed: false
      };
      onAddProblem(newProblem);
      setNewProblemTitle('');
      setNewProblemUrl('');
    }
  };

  const completedCount = problems.filter(p => p.completed).length;
  const totalCount = problems.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="topic-tab">
      <div className="topic-header">
        <h2>{topic.title}</h2>
        <a 
          href={topic.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="topic-link"
        >
          前往 LeetCode 題庫 (Go to LeetCode)
        </a>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-info">
          <span>進度: {completedCount}/{totalCount} ({completionRate}%)</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleAddProblem} className="add-problem-form">
        <input
          type="text"
          placeholder="題目名稱"
          value={newProblemTitle}
          onChange={(e) => setNewProblemTitle(e.target.value)}
          className="input-field"
        />
        <input
          type="url"
          placeholder="題目連結 (會自動轉換為 leetcode.com)"
          value={newProblemUrl}
          onChange={(e) => setNewProblemUrl(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="add-button">新增題目</button>
      </form>

      <div className="problems-list">
        {problems.length === 0 ? (
          <p className="empty-message">尚未新增任何題目</p>
        ) : (
          problems.map((problem, problemIndex) => (
            <ProblemItem
              key={`${problem.topicId}-${problem.id}-${problemIndex}`}
              problem={problem}
              onToggle={onToggleProblem}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TopicTab;