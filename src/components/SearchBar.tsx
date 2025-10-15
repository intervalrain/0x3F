"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Box,
  Typography,
  InputAdornment,
  Chip,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import Fuse, { type FuseResult } from 'fuse.js';
import type { SearchArticle, SearchIndex } from '@/types/search';

type SearchResult = FuseResult<SearchArticle>;

interface SearchBarProps {
  open: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  });
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchArticle> | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 載入搜尋索引
  useEffect(() => {
    fetch('/search-index.json')
      .then(res => res.json())
      .then((data: SearchIndex) => {
        // 包含所有文章（含草稿）以提供完整搜尋結果
        const articles = data.articles;

        // 初始化 Fuse.js
        const fuseInstance = new Fuse(articles, {
          keys: [
            { name: 'title', weight: 0.5 },
            { name: 'tags', weight: 0.3 },
            { name: 'description', weight: 0.15 },
            { name: 'excerpt', weight: 0.05 },
          ],
          threshold: 0.4,              // 放寬匹配閾值（0.3 -> 0.4）
          distance: 100,               // 增加搜尋距離
          includeScore: true,
          includeMatches: true,
          ignoreLocation: true,        // 忽略匹配位置
          minMatchCharLength: 1,       // 降低最小匹配長度（2 -> 1）
          findAllMatches: true,        // 找出所有匹配
          useExtendedSearch: false,    // 不使用擴展搜尋語法
          isCaseSensitive: false,      // 不區分大小寫
        });

        setFuse(fuseInstance);
      })
      .catch(err => {
        console.error('Failed to load search index:', err);
      });
  }, []);

  // 執行搜尋
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults.slice(0, 10)); // 只顯示前 10 筆
    setSelectedIndex(0);
  }, [query, fuse]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      // 重置查詢
      setQuery('');
      setResults([]);
      setSelectedIndex(0);

      // 延遲對焦確保 Dialog 完全打開
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleNavigate = useCallback((article: SearchArticle) => {
    router.push(article.path);
    onClose();
  }, [router, onClose]);

  // 鍵盤導航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleNavigate(results[selectedIndex].item);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [results, selectedIndex, onClose, handleNavigate]);

  // 滾動選中的項目到可視範圍
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  const handleClose = () => {
    onClose();
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* 搜尋輸入框 */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder="搜尋文章、標籤、關鍵字..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setQuery('')}
                      edge="end"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'divider',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 1,
                },
              },
            }}
          />
        </Box>

        {/* 搜尋結果 */}
        <Box
          sx={{
            maxHeight: 'calc(80vh - 100px)',
            overflow: 'auto',
          }}
        >
          {query && results.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                找不到相關文章
              </Typography>
              <Typography variant="caption" color="text.secondary">
                試試其他關鍵字
              </Typography>
            </Box>
          )}

          {!query && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                輸入關鍵字搜尋文章
              </Typography>
              <Typography variant="caption" color="text.secondary">
                支援標題、標籤、描述搜尋
              </Typography>
            </Box>
          )}

          {results.length > 0 && (
            <List ref={listRef} sx={{ p: 0 }}>
              {results.map((result, index) => (
                <ListItem
                  key={result.item.id}
                  disablePadding
                  sx={{
                    borderLeft: 3,
                    borderColor: index === selectedIndex ? 'primary.main' : 'transparent',
                    backgroundColor: index === selectedIndex ? 'action.hover' : 'transparent',
                  }}
                >
                  <ListItemButton
                    onClick={() => handleNavigate(result.item)}
                    sx={{ py: 2, px: 3 }}
                  >
                    <ArticleIcon
                      sx={{
                        mr: 2,
                        color: 'text.secondary',
                        fontSize: 20,
                      }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      {/* Title */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: index === selectedIndex ? 600 : 500,
                          color: index === selectedIndex ? 'primary.main' : 'text.primary',
                          mb: 0.5,
                        }}
                      >
                        {result.item.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 1,
                        }}
                      >
                        {result.item.description || result.item.excerpt}
                      </Typography>

                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {result.item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* 提示 */}
        {!isMobile && (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'background.default',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                <kbd>↑↓</kbd> 選擇
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <kbd>Enter</kbd> 開啟
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <kbd>Esc</kbd> 關閉
              </Typography>
            </Box>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
