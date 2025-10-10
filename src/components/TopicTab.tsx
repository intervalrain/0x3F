"use client";

import React, { useState } from 'react';
import { Box, Typography, LinearProgress, Paper, Chip, FormControlLabel, Checkbox } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
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
}) => {
  const [hidePremium, setHidePremium] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  const completedCount = problems.filter(p => p.completed).length;
  const totalCount = problems.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Filter problems based on settings
  const filteredProblems = problems.filter(problem => {
    if (hidePremium && problem.isPremium) return false;
    if (hideCompleted && problem.completed) return false;
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Topic Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'text.primary',
          }}
        >
          {topic.title}
        </Typography>

        {/* Progress Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Progress
              </Typography>
            </Box>
            <Chip
              label={`${completedCount} / ${totalCount}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{
                height: 4,
                borderRadius: 1,
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                  background: 'linear-gradient(90deg, #58a6ff 0%, #79c0ff 100%)',
                },
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
            {completionRate.toFixed(1)}% Complete
          </Typography>
        </Paper>

        {/* Filter Controls */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hidePremium}
                onChange={(e) => setHidePremium(e.target.checked)}
                size="small"
              />
            }
            label="Hide Premium"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hideCompleted}
                onChange={(e) => setHideCompleted(e.target.checked)}
                size="small"
              />
            }
            label="Hide Completed"
          />
        </Box>
      </Box>

      {/* Problems List */}
      <Box>
        {filteredProblems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {problems.length === 0 ? 'No problems added yet' : 'No problems match the current filters'}
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {filteredProblems.map((problem, problemIndex) => (
              <ProblemItem
                key={`${problem.topicId}-${problem.id}-${problemIndex}`}
                problem={problem}
                onToggle={onToggleProblem}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopicTab;
