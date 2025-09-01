import React from 'react';
import { Topic } from '../data/topics';
import { TopicProgress, Problem } from '../types';

interface DashboardProps {
  topics: Topic[];
  topicProgress: TopicProgress[];
}

const Dashboard: React.FC<DashboardProps> = ({ topics, topicProgress }) => {
  // 計算整體統計
  const getOverallStats = () => {
    let totalProblems = 0;
    let totalCompleted = 0;
    let totalInProgress = 0;

    topics.forEach(topic => {
      const topicData = topicProgress.find(tp => tp.topicId === topic.id);
      if (!topicData) return;

      // 舊格式問題
      const oldProblems = topicData.problems || [];
      const oldCompleted = oldProblems.filter(p => p.completed).length;

      // 新格式問題（章節結構）
      const chapterProblems = topicData.chapters?.reduce((total, chapter) => 
        total + chapter.subsections.reduce((subtotal, subsection) => 
          subtotal + subsection.problems.length, 0), 0) || 0;
      
      const chapterCompleted = topicData.chapters?.reduce((total, chapter) => 
        total + chapter.subsections.reduce((subtotal, subsection) => 
          subtotal + subsection.problems.filter(p => p.completed).length, 0), 0) || 0;

      const topicTotal = oldProblems.length + chapterProblems;
      const topicCompleted = oldCompleted + chapterCompleted;

      totalProblems += topicTotal;
      totalCompleted += topicCompleted;
      totalInProgress += topicTotal - topicCompleted;
    });

    return { totalProblems, totalCompleted, totalInProgress };
  };

  // 計算每個主題的統計
  const getTopicStats = (topic: Topic) => {
    const topicData = topicProgress.find(tp => tp.topicId === topic.id);
    if (!topicData) return { completed: 0, total: 0, percentage: 0 };

    // 舊格式問題
    const oldProblems = topicData.problems || [];
    const oldCompleted = oldProblems.filter(p => p.completed).length;

    // 新格式問題
    const chapterProblems = topicData.chapters?.reduce((total, chapter) => 
      total + chapter.subsections.reduce((subtotal, subsection) => 
        subtotal + subsection.problems.length, 0), 0) || 0;
    
    const chapterCompleted = topicData.chapters?.reduce((total, chapter) => 
      total + chapter.subsections.reduce((subtotal, subsection) => 
        subtotal + subsection.problems.filter(p => p.completed).length, 0), 0) || 0;

    const total = oldProblems.length + chapterProblems;
    const completed = oldCompleted + chapterCompleted;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  // 獲取最近完成的問題
  const getRecentCompletedProblems = () => {
    const recentProblems: (Problem & { topicTitle: string })[] = [];

    topics.forEach(topic => {
      const topicData = topicProgress.find(tp => tp.topicId === topic.id);
      if (!topicData) return;

      // 檢查舊格式問題
      topicData.problems?.forEach(problem => {
        if (problem.completed && problem.completedAt) {
          recentProblems.push({ ...problem, topicTitle: topic.title });
        }
      });

      // 檢查新格式問題
      topicData.chapters?.forEach(chapter => {
        chapter.subsections.forEach(subsection => {
          subsection.problems.forEach(problem => {
            if (problem.completed && problem.completedAt) {
              recentProblems.push({ ...problem, topicTitle: topic.title });
            }
          });
        });
      });
    });

    return recentProblems
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 10);
  };

  const { totalProblems, totalCompleted, totalInProgress } = getOverallStats();
  const recentProblems = getRecentCompletedProblems();
  const completionPercentage = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>總覽 Dashboard</h2>
        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>📊 總進度</h3>
            <div 
              className="progress-circle" 
              style={{ '--percentage': `${completionPercentage * 3.6}deg` } as React.CSSProperties}
            >
              <span className="percentage">{completionPercentage}%</span>
            </div>
            <p>{totalCompleted} / {totalProblems} 題完成</p>
          </div>
          <div className="summary-card">
            <h3>✅ 已完成</h3>
            <div className="stat-number completed">{totalCompleted}</div>
          </div>
          <div className="summary-card">
            <h3>🔄 進行中</h3>
            <div className="stat-number in-progress">{totalInProgress}</div>
          </div>
          <div className="summary-card">
            <h3>📚 總題數</h3>
            <div className="stat-number total">{totalProblems}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="topics-overview">
          <h3>🎯 各主題進度</h3>
          <div className="topics-grid">
            {topics.map(topic => {
              const stats = getTopicStats(topic);
              return (
                <div key={topic.id} className="topic-card">
                  <div className="topic-header">
                    <span className="topic-number">{topic.id}</span>
                    <h4>{topic.title.split('（')[0]}</h4>
                  </div>
                  <div className="topic-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${stats.percentage}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {stats.completed} / {stats.total} ({stats.percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="recent-activity">
          <h3>🚀 最近完成的題目</h3>
          {recentProblems.length > 0 ? (
            <div className="recent-list">
              {recentProblems.map((problem, index) => (
                <div key={`${problem.id}-${index}`} className="recent-item">
                  <div className="problem-info">
                    <span className="problem-number">#{problem.number}</span>
                    <span className="problem-title">{problem.title}</span>
                    <span className="topic-badge">{problem.topicTitle.split('（')[0]}</span>
                  </div>
                  <div className="completion-date">
                    {new Date(problem.completedAt!).toLocaleDateString('zh-TW', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-activity">還沒有完成任何題目</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;