import React, { useState } from 'react';
import { Topic } from '../data/topics';
import { TopicProgress, Problem } from '../types';

interface AnalyticsProps {
  topics: Topic[];
  topicProgress: TopicProgress[];
}

const Analytics: React.FC<AnalyticsProps> = ({ topics, topicProgress }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // 獲取所有已完成的問題
  const getAllCompletedProblems = () => {
    const completedProblems: (Problem & { topicTitle: string, topicId: number })[] = [];

    topics.forEach(topic => {
      const topicData = topicProgress.find(tp => tp.topicId === topic.id);
      if (!topicData) return;

      // 檢查舊格式問題
      topicData.problems?.forEach(problem => {
        if (problem.completed && problem.completedAt) {
          completedProblems.push({ 
            ...problem, 
            topicTitle: topic.title,
            topicId: topic.id
          });
        }
      });

      // 檢查新格式問題
      topicData.chapters?.forEach(chapter => {
        chapter.subsections.forEach(subsection => {
          subsection.problems.forEach(problem => {
            if (problem.completed && problem.completedAt) {
              completedProblems.push({ 
                ...problem, 
                topicTitle: topic.title,
                topicId: topic.id
              });
            }
          });
        });
      });
    });

    return completedProblems.sort((a, b) => 
      new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime()
    );
  };

  // 根據時間範圍過濾問題
  const filterProblemsByTimeRange = (problems: Problem[]) => {
    if (timeRange === 'all') return problems;

    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return problems.filter(problem => 
      problem.completedAt && new Date(problem.completedAt) >= cutoffDate
    );
  };

  // 按日期分組問題
  const groupProblemsByDate = (problems: Problem[]) => {
    const groups: { [date: string]: Problem[] } = {};
    
    problems.forEach(problem => {
      if (problem.completedAt) {
        const date = new Date(problem.completedAt).toISOString().split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(problem);
      }
    });

    return groups;
  };

  // 按主題分組問題
  const groupProblemsByTopic = (problems: Problem[]) => {
    const groups: { [topicId: number]: Problem[] } = {};
    
    problems.forEach(problem => {
      if (!groups[problem.topicId]) {
        groups[problem.topicId] = [];
      }
      groups[problem.topicId].push(problem);
    });

    return groups;
  };

  // 生成日期範圍
  const generateDateRange = (days: number) => {
    const dates = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const allCompletedProblems = getAllCompletedProblems();
  const filteredProblems = filterProblemsByTimeRange(allCompletedProblems);
  const problemsByDate = groupProblemsByDate(filteredProblems);
  const problemsByTopic = groupProblemsByTopic(filteredProblems);

  // 生成圖表數據
  const getChartData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
    const dateRange = generateDateRange(days);
    
    return dateRange.map(date => ({
      date,
      count: problemsByDate[date]?.length || 0,
      displayDate: new Date(date).toLocaleDateString('zh-TW', { 
        month: 'short', 
        day: 'numeric' 
      })
    }));
  };

  const chartData = getChartData();
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  // 計算統計數據
  const totalInPeriod = filteredProblems.length;
  const avgPerDay = timeRange !== 'all' 
    ? Math.round((totalInPeriod / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)) * 10) / 10
    : 0;

  const topicStats = topics.map(topic => {
    const topicProblems = problemsByTopic[topic.id] || [];
    return {
      topic,
      count: topicProblems.length,
      percentage: totalInPeriod > 0 ? Math.round((topicProblems.length / totalInPeriod) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📈 統計分析 Analytics</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7d' ? 'active' : ''}
            onClick={() => setTimeRange('7d')}
          >
            過去 7 天
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''}
            onClick={() => setTimeRange('30d')}
          >
            過去 30 天
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''}
            onClick={() => setTimeRange('90d')}
          >
            過去 90 天
          </button>
          <button 
            className={timeRange === 'all' ? 'active' : ''}
            onClick={() => setTimeRange('all')}
          >
            全部時間
          </button>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>時間範圍內完成</h3>
          <div className="stat-number">{totalInPeriod}</div>
          <p>題目</p>
        </div>
        {timeRange !== 'all' && (
          <div className="summary-card">
            <h3>平均每日</h3>
            <div className="stat-number">{avgPerDay}</div>
            <p>題目</p>
          </div>
        )}
        <div className="summary-card">
          <h3>總計完成</h3>
          <div className="stat-number">{allCompletedProblems.length}</div>
          <p>題目</p>
        </div>
      </div>

      {timeRange !== 'all' && (
        <div className="completion-chart">
          <h3>📊 完成趨勢</h3>
          <div className="chart">
            <div className="chart-bars overflow-x-scroll">
              {chartData.map((data, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(data.count / maxCount) * 100}%`,
                      minHeight: data.count > 0 ? '4px' : '0px'
                    }}
                  >
                    <span className="bar-value">{data.count}</span>
                  </div>
                  <span className="bar-label">{data.displayDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="topic-breakdown">
        <h3>🎯 主題分布</h3>
        <div className="topic-stats">
          {topicStats.map((stat, index) => (
            <div key={stat.topic.id} className="topic-stat-row">
              <div className="topic-info">
                <span className="topic-rank">#{index + 1}</span>
                <span className="topic-name">{stat.topic.title.split('（')[0]}</span>
              </div>
              <div className="topic-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(stat.count / Math.max(...topicStats.map(s => s.count), 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="stat-count">{stat.count} 題 ({stat.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredProblems.length > 0 && (
        <div className="recent-completions">
          <h3>🚀 完成記錄</h3>
          <div className="completions-timeline">
            {filteredProblems.slice(-20).reverse().map((problem, index) => (
              <div key={`${problem.id}-${index}`} className="timeline-item">
                <div className="timeline-date">
                  {new Date(problem.completedAt!).toLocaleDateString('zh-TW', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="timeline-content">
                  <span className="problem-number">#{problem.number}</span>
                  <span className="problem-title">{problem.title}</span>
                  <span className="topic-badge">{topics.find(t => t.id === problem.topicId)?.title.split('（')[0] || 'Unknown'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;