"use client";

import React from 'react';
import {
  Box,
  Paper,
  Checkbox,
  Typography,
  Link,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Lock as LockIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Problem } from '../types';

interface ProblemItemProps {
  problem: Problem;
  onToggle: (problemId: string) => void;
}

const ProblemItem: React.FC<ProblemItemProps> = ({ problem, onToggle }) => {
  const handleCheckboxChange = () => {
    onToggle(problem.id);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: problem.completed ? 'rgba(88, 166, 255, 0.05)' : 'background.paper',
        border: '1px solid',
        borderColor: problem.completed ? 'primary.main' : 'divider',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'rgba(88, 166, 255, 0.08)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Checkbox */}
        <Checkbox
          checked={problem.completed}
          onChange={handleCheckboxChange}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          sx={{
            color: 'text.secondary',
            '&.Mui-checked': {
              color: 'success.main',
            },
          }}
        />

        {/* Problem Content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Link
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                color: problem.completed ? 'text.secondary' : 'primary.main',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: problem.completed ? 'line-through' : 'none',
                '&:hover': {
                  color: 'primary.light',
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {problem.title}
              <OpenInNewIcon sx={{ fontSize: 14 }} />
            </Link>

            {problem.isPremium && (
              <Chip
                icon={<LockIcon sx={{ fontSize: 12 }} />}
                label="Premium"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: 'warning.main',
                  color: 'warning.contrastText',
                }}
              />
            )}
          </Box>

          {problem.completed && problem.completedAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              Completed: {new Date(problem.completedAt).toLocaleString('zh-TW', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProblemItem;
