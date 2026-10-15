import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
import { ToastContainer } from '../common/ToastContainer';
import { AmbientMotionAura } from '../common/AmbientMotionAura';
import { CampusLiveTicker } from '../common/CampusLiveTicker';
import { ScrollToTop } from '../common/ScrollToTop';
import { AICopilotWidget } from '../common/AICopilotWidget';

interface AppShellProps {
  currentPath: string;
  isFullShell?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentPath, isFullShell = true, children }) => {
  const { isSidebarCollapsed } = useAuth();

  if (!isFullShell) {
    return (
      <div className="min-h-screen relative overflow-x-clip bg-[#020b17]">
        <AmbientMotionAura />
        <div className="relative z-10">
          {children}
        </div>
        <ToastContainer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className={`app ${isSidebarCollapsed ? 'collapsed' : ''}`} id="app">
      <AmbientMotionAura />
      <Sidebar activePath={currentPath} />
      <div className="main relative z-10">
        <Topbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={currentPath}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="content"
            id="content"
          >
            <CampusLiveTicker />
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <BottomNav activePath={currentPath} />
      <MobileDrawer activePath={currentPath} />
      <AICopilotWidget />
      <ToastContainer />
      <ScrollToTop />
    </div>
  );
};
