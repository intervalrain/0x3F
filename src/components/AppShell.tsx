"use client";

import React, { useState } from 'react';
import { Box, Fab } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useLayout } from '../contexts/LayoutContext';
import { useAuth } from '../hooks/useAuth';
import { useProgressSync } from '../hooks/useProgressSync';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import SyncConflictModal from './SyncConflictModal';
import { TopicProgress } from '../types';
import { topics } from '../data/topics';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileDrawerOpen,
    topicProgress,
    setTopicProgress,
    articleTree,
    isClient,
  } = useLayout();

  const { isAuthenticated, syncToCloud, mergeProgress } = useAuth();
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState<{ local: TopicProgress[], cloud: TopicProgress[] } | null>(null);

  const { isSyncing } = useProgressSync(topicProgress, {
    enabled: isAuthenticated,
  });

  const handleConflictResolution = async (resolution: 'local' | 'cloud' | 'merge') => {
    if (!conflictData) return;

    const { local: localTp, cloud: cloudTp } = conflictData;

    switch (resolution) {
      case 'local':
        setTopicProgress(localTp);
        await syncToCloud(localTp, true);
        break;
      case 'cloud':
        setTopicProgress(cloudTp);
        break;
      case 'merge':
        const finalProgress = localTp.map((local) => {
          const cloud = cloudTp.find((c) => c.topicId === local.topicId);
          if (!cloud) return local;
          return mergeProgress(local, cloud);
        });
        setTopicProgress(finalProgress);
        await syncToCloud(finalProgress, true);
        break;
    }

    setShowConflictModal(false);
    setConflictData(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        isSyncing={isSyncing}
        onNavigate={setActiveTab}
        onMenuClick={() => setMobileDrawerOpen(true)}
      />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Floating Menu Button - shown when sidebar is collapsed */}
        {isClient && sidebarCollapsed && (
          <Fab
            color="primary"
            size="small"
            onClick={() => setSidebarCollapsed(false)}
            sx={{
              position: 'fixed',
              left: 16,
              top: 80,
              zIndex: 1400,
            }}
          >
            <MenuIcon />
          </Fab>
        )}

        {isClient && (
          <Sidebar
            topics={topics}
            topicProgress={topicProgress}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            articleTree={articleTree}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>

      <Footer />

      {/* Conflict Resolution Modal */}
      {isClient && showConflictModal && conflictData && (
        <SyncConflictModal
          localData={conflictData.local}
          cloudData={conflictData.cloud}
          onResolve={handleConflictResolution}
          onCancel={() => {
            setShowConflictModal(false);
            setConflictData(null);
          }}
        />
      )}
    </Box>
  );
};

export default AppShell;
