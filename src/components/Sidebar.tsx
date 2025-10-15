"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Drawer,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  Code as CodeIcon,
  Article as ArticleIcon,
  CodeOff as CodeBracketSquareIcon,
  ExpandMore,
  ChevronRight,
  ChevronLeft,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Topic } from '../data/topics';
import { TopicProgress } from '../types';
import { ArticleNode } from '../lib/articles';
import { useLayout } from '../contexts/LayoutContext';

interface SidebarProps {
  topics: Topic[];
  topicProgress: TopicProgress[];
  activeTab: string | number;
  onTabChange: (tab: string | number) => void;
  articleTree?: ArticleNode[];
}

const Sidebar: React.FC<SidebarProps> = ({
  topics,
  topicProgress,
  activeTab,
  onTabChange,
  articleTree = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    sidebarWidth,
    setSidebarWidth,
    expandedItems,
    setExpandedItems,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileDrawerOpen,
    setMobileDrawerOpen
  } = useLayout();
  const [isResizing, setIsResizing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    // Don't close drawer for root nodes or folder nodes
    const isRootNode = nodeId === 'problems-root' || nodeId === 'articles-root';

    // Check if it's a topic ID (number) - these are leaf nodes in the problem tree
    if (!isNaN(Number(nodeId))) {
      // Only navigate if not already on home page
      if (pathname !== '/') {
        router.push('/');
      }
      onTabChange(Number(nodeId));

      // Topics are leaf nodes - close drawer in mobile mode
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    } else if (nodeId.startsWith('article-')) {
      // Article node - extract path from nodeId
      const articlePath = nodeId.replace('article-', '');

      // Check if it's a folder node (starts with 'folder-')
      const isFolderNode = articlePath.startsWith('folder-');

      // Only navigate if it's not a folder (i.e., it's a leaf node)
      if (!isFolderNode && articlePath) {
        router.push(articlePath);

        // Articles are leaf nodes - close drawer in mobile mode
        if (isMobile) {
          setMobileDrawerOpen(false);
        }
      }
      // If it's a folder (non-leaf), do nothing - just let TreeView handle the expand/collapse
    }
  };

  const handleArticleClick = (articlePath: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (articlePath && !articlePath.startsWith('folder-')) {
      router.push(articlePath);

      // Close drawer in mobile mode after selecting an article (leaf node)
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    }
  };

  const renderArticleTree = (nodes: ArticleNode[]): React.ReactNode => {
    return nodes.map((node, index) => {
      const hasChildren = node.children && node.children.length > 0;
      // Use path for unique ID, for folders use special prefix
      const nodePath = hasChildren ? `folder-${node.path || index}` : node.path || `item-${index}`;
      const nodeId = `article-${nodePath}`;

      return (
        <TreeItem
          key={nodeId}
          itemId={nodeId}
          label={
            <Tooltip title={node.title} placement="right" arrow>
              <Box
                sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}
                onClick={(e) => !hasChildren && handleArticleClick(nodePath, e)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: hasChildren ? 'default' : 'pointer',
                    '&:hover': {
                      color: !hasChildren ? 'primary.main' : 'inherit',
                    },
                  }}
                >
                  {node.title}
                </Typography>
              </Box>
            </Tooltip>
          }
        >
          {hasChildren && renderArticleTree(node.children!)}
        </TreeItem>
      );
    });
  };

  const getTopicProgress = (topicId: number) => {
    const progress = topicProgress.find((p) => p.topicId === topicId);
    if (!progress) return { completed: 0, total: 0 };

    const total = progress.problems.length;
    const completed = progress.problems.filter((p) => p.completed).length;
    return { completed, total };
  };

  const drawerContent = (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'background.paper',
    }}>
      {isMobile ? (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            選單
          </Typography>
          <IconButton
            onClick={handleDrawerToggle}
            size="small"
            sx={{ color: 'text.secondary' }}
            aria-label="關閉選單"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <IconButton
            onClick={() => setSidebarCollapsed(true)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <ChevronLeft />
          </IconButton>
        </Box>
      )}
      <SimpleTreeView
        aria-label="navigation tree"
        expandedItems={expandedItems}
        onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
        slots={{
          expandIcon: ChevronRight,
          collapseIcon: ExpandMore,
        }}
        onItemClick={handleNodeSelect}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* 刷題主題 */}
        <TreeItem
          itemId="problems-root"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
              <CodeBracketSquareIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={600}>
                刷題主題
              </Typography>
            </Box>
          }
        >
          {topics.map((topic) => {
            const { completed, total } = getTopicProgress(topic.id);
            const isActive = activeTab === topic.id;

            return (
              <TreeItem
                key={topic.id}
                itemId={String(topic.id)}
                label={
                  <Tooltip title={topic.title} placement="right" arrow>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                      <CodeIcon sx={{ fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {topic.title}
                      </Typography>
                      {total > 0 && (
                        <Chip
                          label={`${completed}/${total}`}
                          size="small"
                          color={isActive ? 'primary' : 'default'}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                }
              />
            );
          })}
        </TreeItem>

        {/* 文章專區 */}
        <TreeItem
          itemId="articles-root"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
              <ArticleIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={600}>
                文章專區
              </Typography>
            </Box>
          }
        >
          {renderArticleTree(articleTree)}
        </TreeItem>

        {/* 未來擴充預留位置 */}
        {/* 可以在這裡加入第三層 */}
      </SimpleTreeView>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="bottom"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            height: '80vh',
            maxHeight: '80vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  if (sidebarCollapsed) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
            position: 'relative',
            transition: isResizing ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Resize Handle */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: '8px',
          cursor: 'col-resize',
          backgroundColor: 'transparent',
          position: 'absolute',
          right: -4,
          top: 0,
          bottom: 0,
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          '&::before': {
            content: '""',
            width: '2px',
            height: '40px',
            backgroundColor: 'divider',
            borderRadius: '2px',
            opacity: 0,
            transition: 'opacity 0.2s ease',
          },
          '&:hover': {
            '&::before': {
              opacity: 0.5,
            },
          },
          '&:hover::after': {
            content: '""',
            position: 'absolute',
            width: '3px',
            height: '100%',
            backgroundColor: theme.palette.primary.main,
            opacity: 0.3,
          },
          ...(isResizing && {
            '&::before': {
              opacity: 1,
              backgroundColor: theme.palette.primary.main,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '3px',
              height: '100%',
              backgroundColor: theme.palette.primary.main,
              opacity: 0.5,
            },
          }),
        }}
      />
    </Box>
  );
};

export default Sidebar;
