"use client";

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Topic } from '../data/topics';
import { TopicProgress, Problem } from '../types';

interface DashboardProps {
  topics: Topic[];
  topicProgress: TopicProgress[];
}

const Dashboard: React.FC<DashboardProps> = ({ topics, topicProgress }) => {
  // Calculate overall statistics
  const getOverallStats = () => {
    let totalProblems = 0;
    let totalCompleted = 0;

    topics.forEach(topic => {
      const topicData = topicProgress.find(tp => tp.topicId === topic.id);
      if (!topicData) return;

      // Old format problems
      const oldProblems = topicData.problems || [];
      const oldCompleted = oldProblems.filter(p => p.completed).length;

      // New format problems (chapter structure)
      const chapterProblems = topicData.chapters?.reduce((total, chapter) =>
        total + chapter.subsections.reduce((subtotal, subsection) =>
          subtotal + subsection.problems.length, 0), 0) || 0;

      const chapterCompleted = topicData.chapters?.reduce((total, chapter) =>
        total + chapter.subsections.reduce((subtotal, subsection) =>
          subtotal + subsection.problems.filter(p => p.completed).length, 0), 0) || 0;

      totalProblems += oldProblems.length + chapterProblems;
      totalCompleted += oldCompleted + chapterCompleted;
    });

    return { totalProblems, totalCompleted, totalInProgress: totalProblems - totalCompleted };
  };

  // Calculate topic statistics
  const getTopicStats = (topic: Topic) => {
    const topicData = topicProgress.find(tp => tp.topicId === topic.id);
    if (!topicData) return { completed: 0, total: 0, percentage: 0 };

    const oldProblems = topicData.problems || [];
    const oldCompleted = oldProblems.filter(p => p.completed).length;

    const chapterProblems = topicData.chapters?.reduce((total, chapter) =>
      total + chapter.subsections.reduce((subtotal, subsection) =>
        subtotal + subsection.problems.length, 0), 0) || 0;

    const chapterCompleted = topicData.chapters?.reduce((total, chapter) =>
      total + chapter.subsections.reduce((subtotal, subsection) =>
        subtotal + subsection.problems.filter(p => p.completed).length, 0), 0) || 0;

    const total = oldProblems.length + chapterProblems;
    const completed = oldCompleted + chapterCompleted;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  };

  // Get recently completed problems
  const getRecentCompletedProblems = () => {
    const recentProblems: (Problem & { topicTitle: string })[] = [];

    topics.forEach(topic => {
      const topicData = topicProgress.find(tp => tp.topicId === topic.id);
      if (!topicData) return;

      topicData.problems?.forEach(problem => {
        if (problem.completed && problem.completedAt) {
          recentProblems.push({ ...problem, topicTitle: topic.title });
        }
      });

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
      .slice(0, 8);
  };

  const { totalProblems, totalCompleted, totalInProgress } = getOverallStats();
  const recentProblems = getRecentCompletedProblems();
  const completionPercentage = totalProblems > 0 ? (totalCompleted / totalProblems) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <Box>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Overall Progress</Typography>
              <AssessmentIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              {completionPercentage.toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 4,
                borderRadius: 1,
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #58a6ff 0%, #79c0ff 100%)',
                }
              }}
            />
          </Paper>
        </Box>

        <Box>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {totalCompleted}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              of {totalProblems} problems
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">In Progress</Typography>
              <ScheduleIcon sx={{ color: 'warning.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {totalInProgress}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              remaining
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Problems</Typography>
              <TrendingUpIcon sx={{ color: 'info.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {totalProblems}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              across all topics
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Topic Progress */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Topic Progress</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {topics.map(topic => {
            const stats = getTopicStats(topic);
            return (
              <Box key={topic.id}>
                <Box sx={{ p: 2, backgroundColor: 'rgba(88, 166, 255, 0.03)', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={`#${topic.id}`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(88, 166, 255, 0.15)',
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                      {topic.title.split('（')[0]}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={stats.percentage}
                      sx={{
                        height: 4,
                        borderRadius: 1,
                        backgroundColor: 'rgba(88, 166, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #58a6ff 0%, #79c0ff 100%)',
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {stats.completed} / {stats.total} ({stats.percentage.toFixed(0)}%)
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Recent Activity */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Recent Activity</Typography>
        {recentProblems.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {recentProblems.map((problem, index) => (
              <Card
                key={`${problem.id}-${index}`}
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(88, 166, 255, 0.03)',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(88, 166, 255, 0.08)',
                  },
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minWidth: 0,
                }}
              >
                <CardContent sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  overflow: 'hidden',
                }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap', minWidth: 0 }}>
                    <Chip
                      label={`#${String(problem.number)}`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(88, 166, 255, 0.15)',
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                        height: 20,
                        maxWidth: '100%',
                      }}
                    />
                    <Chip
                      label={problem.topicTitle.split('（')[0]}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        height: 20,
                        maxWidth: '100%',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word',
                      minWidth: 0,
                    }}
                  >
                    {problem.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 'auto',
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 12, color: 'success.main', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {new Date(problem.completedAt!).toLocaleDateString('zh-TW', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No completed problems yet
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
