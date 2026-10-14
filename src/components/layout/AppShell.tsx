import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
import { ToastContainer } from '../common/ToastContainer';
import { AmbientMotionAura } from '../common/AmbientMotionAura';
import { CampusLiveTicker } from '../common/CampusLiveTicker';

interface AppShellProps {
  currentPath: string;
  isFullShell?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentPath, isFullShell = true, children }) => {
  const { isSidebarCollapsed } = useAuth();

  if (!isFullShell) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AmbientMotionAura />
        <div className="relative z-10">
          {children}
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className={`app ${isSidebarCollapsed ? 'collapsed' : ''}`} id="app">
      <AmbientMotionAura />
      <Sidebar activePath={currentPath} />
      <div className="main relative z-10">
        <Topbar />
        <main className="content" id="content">
          <CampusLiveTicker />
          {children}
        </main>
      </div>
      <BottomNav activePath={currentPath} />
      <MobileDrawer activePath={currentPath} />
      <ToastContainer />
    </div>
  );
};

