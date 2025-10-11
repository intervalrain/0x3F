"use client";

import React, { useState, useMemo } from 'react';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to strip markdown formatting from text
  const stripMarkdown = (text: string): string => {
    return text
      // Remove bold/italic: ***text*** -> text, **text** -> text, *text* -> text
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      // Remove underline bold/italic: ___text___ -> text, __text__ -> text, _text_ -> text
      .replace(/___(.+?)___/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      // Remove inline code: `code` -> code
      .replace(/`(.+?)`/g, '$1')
      // Remove strikethrough: ~~text~~ -> text
      .replace(/~~(.+?)~~/g, '$1')
      // Remove links: [text](url) -> text
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      // Remove images: ![alt](url) -> alt
      .replace(/!\[(.+?)\]\(.+?\)/g, '$1');
  };

  const tocItems = useMemo(() => {
    const items: TocItem[] = [];
    const lines = content.split('\n');
    let counter = 0;

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2].trim();
        const cleanText = stripMarkdown(rawText);
        const id = `heading-${counter}-${cleanText.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')}`;
        // Display clean text in TOC
        items.push({ id, text: cleanText, level });
        counter++;
      }
    });

    return items;
  }, [content]);

  if (tocItems.length === 0) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 2,
        overflow: 'hidden',
        backgroundColor: '#f9fafb'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#e5e7eb'
          }
        }}
        onClick={handleToggle}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>
          目錄 (Table of Contents)
        </Typography>
        <IconButton size="small" sx={{ ml: 1, color: '#111827' }}>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isOpen}>
        <Box sx={{ p: 2, pt: 0 }}>
          {tocItems.map((item, index) => (
            <Box
              key={index}
              onClick={() => handleScrollToHeading(item.id)}
              sx={{
                pl: (item.level - 1) * 2,
                py: 0.5,
                cursor: 'pointer',
                fontSize: item.level === 1 ? '0.95rem' : '0.875rem',
                fontWeight: item.level === 1 ? 600 : 400,
                color: '#1f2937',
                '&:hover': {
                  color: '#2563eb',
                  textDecoration: 'underline'
                },
                transition: 'all 0.2s'
              }}
            >
              {item.text}
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default TableOfContents;
