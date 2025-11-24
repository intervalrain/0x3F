"use client";

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

interface SubscriptionGateProps {
  articleTitle: string;
}

const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ articleTitle }) => {
  const { login } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        p: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          p: 5,
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <LockIcon
          sx={{
            fontSize: 64,
            color: 'text.secondary',
            mb: 2,
          }}
        />

        <Typography variant="h5" fontWeight={600} gutterBottom>
          會員專屬內容
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          「{articleTitle}」
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          此文章僅開放給登入會員閱讀，請先登入以繼續閱讀。
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={login}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          登入 / 註冊
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
          登入後即可免費閱讀所有會員文章
        </Typography>
      </Paper>
    </Box>
  );
};

export default SubscriptionGate;
