"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  AccountCircle,
  CloudSync,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import SearchBar from './SearchBar';

interface HeaderProps {
  onMenuClick?: () => void;
  isSyncing?: boolean;
  onNavigate?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  isSyncing = false,
  onNavigate,
}) => {
  const theme = useTheme();
  // 添加 noSsr 選項避免 hydration 問題
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  });
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 確保客戶端已掛載
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (tab: string) => {
    onNavigate?.(tab);
    handleClose();
  };

  const handleLogoClick = () => {
    // Navigate to home page if not already there
    if (pathname !== '/') {
      router.push('/');
    }
    // Set activeTab to 'home'
    onNavigate?.('home');
  };

  // 快捷鍵：Cmd/Ctrl + K 打開搜尋
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        {isMobile && onMenuClick && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo/Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1.5 }}>
          <Box
            component="img"
            src="/favicon.svg"
            alt="0x3F Logo"
            onClick={handleLogoClick}
            sx={{
              width: 32,
              height: 32,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {isMobile ? 'Tracker' : 'LeetCode Tracker'}
          </Typography>

          {/* Syncing Indicator */}
          {isSyncing && (
            <Chip
              icon={<CloudSync />}
              label="SYNCING"
              size="small"
              color="success"
              sx={{
                ml: 2,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
          )}
        </Box>

        {/* Search Bar - Only render after mount to avoid hydration mismatch */}
        {mounted && !isMobile && (
          <Box
            onClick={() => setSearchOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: alpha(theme.palette.common.white, 0.08),
              borderRadius: 1,
              px: 2,
              py: 0.75,
              mr: 2,
              cursor: 'pointer',
              minWidth: 200,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.12),
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                flexGrow: 1,
              }}
            >
              搜尋文章...
            </Typography>
            <Chip
              label="⌘K"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                color: 'text.secondary',
              }}
            />
          </Box>
        )}

        {/* Mobile Search Icon - Only render after mount */}
        {mounted && isMobile && (
          <IconButton
            color="inherit"
            onClick={() => setSearchOpen(true)}
            sx={{ mr: 1 }}
          >
            <SearchIcon />
          </IconButton>
        )}

        {/* LeetCode Link */}
        <IconButton
          component="a"
          href="https://leetcode.com/problemset/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          }}
          title="Go to LeetCode"
        >
          <Box
            component="svg"
            viewBox="0 0 24 24"
            sx={{ width: 24, height: 24, fill: 'currentColor' }}
          >
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
          </Box>
        </IconButton>

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated && user ? (
            <>
              <IconButton
                onClick={handleMenu}
                sx={{
                  padding: 0,
                }}
              >
                {user.image ? (
                  <Avatar
                    src={user.image}
                    alt={user.name || 'User'}
                    sx={{
                      width: 32,
                      height: 32,
                    }}
                  />
                ) : (
                  <AccountCircle
                    sx={{
                      fontSize: 32,
                    }}
                  />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      USER
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('dashboard')}>
                  <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('analytics')}>
                  <AnalyticsIcon sx={{ mr: 1, fontSize: 20 }} />
                  Analytics
                </MenuItem>
                <MenuItem onClick={() => { logout(); handleClose(); }}>
                  <Typography color="error">LOGOUT</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Chip
              label="Login"
              onClick={login}
              variant="outlined"
              sx={{
                fontWeight: 500,
                cursor: 'pointer',
              }}
            />
          )}
        </Box>
      </Toolbar>

      {/* Search Dialog */}
      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
    </AppBar>
  );
};

export default Header;
