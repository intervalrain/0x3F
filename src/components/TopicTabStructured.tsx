"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Topic } from '../data/topics';
import { Problem, Chapter } from '../types';
import ChapterView from './ChapterView';

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
}) => {
  const [hidePremium, setHidePremium] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  // Calculate total progress
  const totalProblems = chapters.reduce((total, chapter) =>
    total + chapter.subsections.reduce((subtotal, subsection) =>
      subtotal + subsection.problems.length, 0), 0);

  const completedProblems = chapters.reduce((total, chapter) =>
    total + chapter.subsections.reduce((subtotal, subsection) =>
      subtotal + subsection.problems.filter(p => p.completed).length, 0), 0);

  const completionRate = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Topic Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textAlign: "center",
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
                Total Progress
              </Typography>
            </Box>
            <Chip
              label={`${completedProblems} / ${totalProblems}`}
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

      {/* Chapters Container */}
      <Box>
        {chapters.length === 0 ? (
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
              No chapters added yet
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {chapters.map(chapter => (
              <ChapterView
                key={chapter.id}
                chapter={chapter}
                onToggleProblem={onToggleProblem}
                hidePremium={hidePremium}
                hideCompleted={hideCompleted}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopicTabStructured;
