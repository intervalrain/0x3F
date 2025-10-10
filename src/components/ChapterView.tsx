"use client";

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  Link,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Lock as LockIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Chapter } from '../types';

interface ChapterViewProps {
  chapter: Chapter;
  onToggleProblem: (problemId: string) => void;
  hidePremium?: boolean;
  hideCompleted?: boolean;
}

const getDifficultyColor = (difficulty?: string): 'success' | 'warning' | 'error' | 'default' => {
  if (!difficulty || typeof difficulty !== 'string') {
    return 'default';
  }
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'error';
    default:
      return 'default';
  }
};

const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  onToggleProblem,
  hidePremium = false,
  hideCompleted = false
}) => {
  return (
    <Box id={`chapter-${chapter.id}`}>
      {/* Chapter Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: 'text.primary',
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
        }}
      >
        {chapter.title}
      </Typography>

      {/* Subsections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {chapter.subsections
          .map(subsection => ({
            ...subsection,
            filteredProblems: subsection.problems.filter(problem => {
              if (hidePremium && problem.isPremium) return false;
              if (hideCompleted && problem.completed) return false;
              return true;
            })
          }))
          .filter(subsection => subsection.filteredProblems.length > 0)
          .map(subsection => (
          <Box key={subsection.id} id={`subsection-${chapter.id}-${subsection.id}`}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
              }}
            >
              {subsection.title}
            </Typography>

            {/* Problems Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gridAutoRows: '1fr',
                gap: 2,
              }}
            >
              {subsection.filteredProblems.map((problem, problemIndex) => (
                <Paper
                  key={`${chapter.id}-${subsection.id}-${problem.id}-${problemIndex}`}
                  elevation={0}
                  sx={{
                    p: 2,
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: problem.completed ? 'rgba(88, 166, 255, 0.05)' : 'background.paper',
                    border: '1px solid',
                    borderColor: problem.completed ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(88, 166, 255, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(88, 166, 255, 0.15)',
                    },
                  }}
                >
                    {/* Problem Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={`#${String(problem.number)}`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(88, 166, 255, 0.15)',
                            color: 'primary.main',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                          }}
                        />
                        {problem.isPremium && (
                          <Chip
                            icon={<LockIcon sx={{ fontSize: 12 }} />}
                            label="Premium"
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              backgroundColor: 'warning.main',
                              color: 'warning.contrastText',
                            }}
                          />
                        )}
                      </Box>
                      {problem.difficulty && (
                        <Chip
                          label={String(problem.difficulty).toUpperCase()}
                          size="small"
                          color={getDifficultyColor(String(problem.difficulty))}
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            height: 22,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    {/* Problem Title Link */}
                    <Link
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        color: problem.completed ? 'text.secondary' : 'text.primary',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 0.5,
                        mb: 2,
                        textDecoration: problem.completed ? 'line-through' : 'none',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span style={{ flexGrow: 1 }}>{problem.title}</span>
                      <OpenInNewIcon sx={{ fontSize: 16, flexShrink: 0, mt: 0.2 }} />
                    </Link>

                    {/* Completion Status */}
                    <Box sx={{ mt: 'auto' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          cursor: 'pointer',
                          p: 1,
                          mx: -1,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                        onClick={() => onToggleProblem(problem.id)}
                      >
                        <Checkbox
                          checked={problem.completed}
                          onChange={() => onToggleProblem(problem.id)}
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleIcon />}
                          sx={{
                            p: 0,
                            color: 'text.secondary',
                            '&.Mui-checked': {
                              color: 'success.main',
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: problem.completed ? 'success.main' : 'text.secondary',
                          }}
                        >
                          {problem.completed ? 'Completed' : 'Not Completed'}
                        </Typography>
                      </Box>

                      {problem.completed && problem.completedAt && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1, pl: 1 }}
                        >
                          {new Date(problem.completedAt).toLocaleString('zh-TW', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChapterView;
