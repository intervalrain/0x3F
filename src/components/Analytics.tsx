"use client";

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Chart } from 'react-google-charts';
import { Topic } from '../data/topics';
import { TopicProgress, Problem } from '../types';

interface AnalyticsProps {
  topics: Topic[];
  topicProgress: TopicProgress[];
}

const Analytics: React.FC<AnalyticsProps> = ({ topics, topicProgress }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Get all completed problems
  const getAllCompletedProblems = useMemo(() => {
    const completedProblems: (Problem & { topicTitle: string, topicId: number })[] = [];

    topics.forEach(topic => {
      const topicData = topicProgress.find(tp => tp.topicId === topic.id);
      if (!topicData) return;

      topicData.problems?.forEach(problem => {
        if (problem.completed && problem.completedAt) {
          completedProblems.push({
            ...problem,
            topicTitle: topic.title,
            topicId: topic.id
          });
        }
      });

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
  }, [topics, topicProgress]);

  // Filter problems by time range
  const filteredProblems = useMemo(() => {
    if (timeRange === 'all') return getAllCompletedProblems;

    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return getAllCompletedProblems.filter(problem =>
      problem.completedAt && new Date(problem.completedAt) >= cutoffDate
    );
  }, [getAllCompletedProblems, timeRange]);

  // Generate chart data for Google Charts
  const lineChartData = useMemo(() => {
    if (timeRange === 'all') return null;

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const problemsByDate: { [date: string]: number } = {};

    filteredProblems.forEach(problem => {
      if (problem.completedAt) {
        const date = new Date(problem.completedAt).toISOString().split('T')[0];
        problemsByDate[date] = (problemsByDate[date] || 0) + 1;
      }
    });

    const data: [string, number][] = [['Date', 'Problems']];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      data.push([
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        problemsByDate[dateStr] || 0
      ]);
    }

    return data;
  }, [filteredProblems, timeRange]);

  // Topic distribution data
  const pieChartData = useMemo(() => {
    const topicCounts: { [topicId: number]: number } = {};

    filteredProblems.forEach(problem => {
      topicCounts[problem.topicId] = (topicCounts[problem.topicId] || 0) + 1;
    });

    const data: [string, number][] = [['Topic', 'Count']];
    Object.entries(topicCounts).forEach(([topicId, count]) => {
      const topic = topics.find(t => t.id === Number(topicId));
      if (topic) {
        data.push([topic.title.split('（')[0], count]);
      }
    });

    return data.length > 1 ? data : null;
  }, [filteredProblems, topics]);

  // Calculate statistics
  const totalInPeriod = filteredProblems.length;
  const avgPerDay = timeRange !== 'all' && totalInPeriod > 0
    ? (totalInPeriod / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)).toFixed(1)
    : '0';

  const topicStats = useMemo(() => {
    const stats = topics.map(topic => {
      const count = filteredProblems.filter(p => p.topicId === topic.id).length;
      return {
        topic,
        count,
        percentage: totalInPeriod > 0 ? ((count / totalInPeriod) * 100).toFixed(0) : '0'
      };
    }).sort((a, b) => b.count - a.count);

    return stats.filter(s => s.count > 0);
  }, [topics, filteredProblems, totalInPeriod]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Analytics
        </Typography>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={(_, value) => value && setTimeRange(value)}
          size="small"
        >
          <ToggleButton value="7d">7 Days</ToggleButton>
          <ToggleButton value="30d">30 Days</ToggleButton>
          <ToggleButton value="90d">90 Days</ToggleButton>
          <ToggleButton value="all">All Time</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Completed in Period</Typography>
              <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {totalInPeriod}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              problems
            </Typography>
          </Paper>
        </Grid>

        {timeRange !== 'all' && (
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Average per Day</Typography>
                <SpeedIcon sx={{ color: 'warning.main', fontSize: 20 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {avgPerDay}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                problems/day
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} sm={timeRange === 'all' ? 8 : 4}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Total Completed</Typography>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {getAllCompletedProblems.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              all time
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Line Chart - Completion Trend */}
        {timeRange !== 'all' && lineChartData && (
          <Grid item xs={12} lg={6}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Completion Trend</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <Chart
                  chartType="LineChart"
                  data={lineChartData}
                  width="100%"
                  height="100%"
                  options={{
                    backgroundColor: 'transparent',
                    legend: { position: 'none' },
                    hAxis: {
                      textStyle: { color: '#c9d1d9', fontSize: 11 },
                      gridlines: { color: '#30363d' },
                    },
                    vAxis: {
                      textStyle: { color: '#c9d1d9', fontSize: 11 },
                      gridlines: { color: '#30363d' },
                      minValue: 0,
                    },
                    series: {
                      0: { color: '#58a6ff', lineWidth: 3, pointSize: 6 }
                    },
                    chartArea: { width: '85%', height: '70%' },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Pie Chart - Topic Distribution */}
        {pieChartData && pieChartData.length > 1 && (
          <Grid item xs={12} lg={timeRange === 'all' ? 6 : 6}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Topic Distribution</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <Chart
                  chartType="PieChart"
                  data={pieChartData}
                  width="100%"
                  height="100%"
                  options={{
                    backgroundColor: 'transparent',
                    legend: {
                      position: 'bottom',
                      textStyle: { color: '#c9d1d9', fontSize: 11 }
                    },
                    pieHole: 0.4,
                    colors: ['#58a6ff', '#79c0ff', '#a5d6ff', '#f78166', '#ea6045', '#ff7b72', '#56d364', '#3fb950'],
                    chartArea: { width: '90%', height: '70%' },
                    pieSliceTextStyle: { color: '#0d1117', fontSize: 12 },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Bar Chart - Topic Comparison */}
        {topicStats.length > 0 && (
          <Grid item xs={12} lg={6}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Topic Comparison</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <Chart
                  chartType="BarChart"
                  data={[
                    ['Topic', 'Problems Completed', { role: 'style' }],
                    ...topicStats.slice(0, 8).map(stat => [
                      stat.topic.title.split('（')[0],
                      stat.count,
                      '#58a6ff'
                    ])
                  ]}
                  width="100%"
                  height="100%"
                  options={{
                    backgroundColor: 'transparent',
                    legend: { position: 'none' },
                    hAxis: {
                      textStyle: { color: '#c9d1d9', fontSize: 11 },
                      gridlines: { color: '#30363d' },
                      minValue: 0,
                    },
                    vAxis: {
                      textStyle: { color: '#c9d1d9', fontSize: 11 },
                    },
                    chartArea: { width: '70%', height: '80%' },
                    bar: { groupWidth: '70%' },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Column Chart - Difficulty Distribution */}
        {getAllCompletedProblems.length > 0 && (
          <Grid item xs={12} lg={6}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Difficulty Distribution</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <Chart
                  chartType="ColumnChart"
                  data={(() => {
                    const difficulties = { Easy: 0, Medium: 0, Hard: 0 };
                    filteredProblems.forEach(p => {
                      const diff = p.difficulty;
                      if (diff && typeof diff === 'string') {
                        const normalized = diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase();
                        if (normalized in difficulties) {
                          difficulties[normalized as keyof typeof difficulties]++;
                        }
                      }
                    });
                    return [
                      ['Difficulty', 'Count', { role: 'style' }],
                      ['Easy', difficulties.Easy, '#56d364'],
                      ['Medium', difficulties.Medium, '#f78166'],
                      ['Hard', difficulties.Hard, '#ff7b72'],
                    ];
                  })()}
                  width="100%"
                  height="100%"
                  options={{
                    backgroundColor: 'transparent',
                    legend: { position: 'none' },
                    hAxis: {
                      textStyle: { color: '#c9d1d9', fontSize: 11 },
                    },
                    vAxis: {
                      textStyle: { color: '#c9d1d9', fontSize: 11 },
                      gridlines: { color: '#30363d' },
                      minValue: 0,
                    },
                    chartArea: { width: '80%', height: '70%' },
                    bar: { groupWidth: '60%' },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Topic Statistics */}
      {topicStats.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Topic Breakdown</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {topicStats.map((stat, index) => (
              <Box
                key={stat.topic.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: 'rgba(88, 166, 255, 0.03)',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Chip
                  label={`#${index + 1}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(88, 166, 255, 0.15)',
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    minWidth: 40,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                  {stat.topic.title.split('（')[0]}
                </Typography>
                <Chip
                  label={`${stat.count} problems`}
                  size="small"
                  sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                  label={`${stat.percentage}%`}
                  size="small"
                  color="primary"
                  sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Recent Completions */}
      {filteredProblems.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Recent Completions</Typography>
          <Grid container spacing={2}>
            {filteredProblems.slice(-12).reverse().map((problem, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${problem.id}-${index}`}>
                <Card
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
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`#${String(problem.number)}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(88, 166, 255, 0.15)',
                          color: 'primary.main',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          fontFamily: 'monospace',
                          height: 18,
                        }}
                      />
                      <Chip
                        label={topics.find(t => t.id === problem.topicId)?.title.split('（')[0] || 'Unknown'}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 18,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        mb: 0.5,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {problem.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {new Date(problem.completedAt!).toLocaleDateString('zh-TW', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {filteredProblems.length === 0 && (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No completed problems in this time range
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Analytics;
