"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const HomePage: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/readme')
      .then(res => res.json())
      .then(data => {
        setContent(data.content);
        setLoading(false);
      })
      .catch(() => {
        setContent('# Welcome\n\nWelcome to 0x3F LeetCode Tracker!');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 4,
          '& h1': {
            color: 'text.primary',
            fontSize: '2.5rem',
            fontWeight: 600,
            mb: 3,
          },
          '& h2': {
            color: 'text.primary',
            fontSize: '2rem',
            fontWeight: 600,
            mt: 4,
            mb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1,
          },
          '& h3': {
            color: 'text.primary',
            fontSize: '1.5rem',
            fontWeight: 600,
            mt: 3,
            mb: 2,
          },
          '& p': {
            color: 'text.primary',
            lineHeight: 1.8,
            mb: 2,
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& ul, & ol': {
            color: 'text.primary',
            pl: 3,
            mb: 2,
          },
          '& li': {
            mb: 1,
          },
          '& code': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9em',
            fontFamily: 'monospace',
            color: 'primary.light',
          },
          '& pre': {
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            p: 2,
            overflow: 'auto',
            mb: 2,
            '& code': {
              backgroundColor: 'transparent',
              padding: 0,
              color: '#d4d4d4',
            },
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
            my: 2,
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2,
            py: 1,
            my: 2,
            color: 'text.secondary',
            fontStyle: 'italic',
          },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            mb: 2,
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'divider',
            p: 1.5,
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: 'background.default',
            fontWeight: 600,
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Container>
  );
};

export default HomePage;
