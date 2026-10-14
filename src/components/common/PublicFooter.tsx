import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FCAILogo } from '../icons/Icon';

export const PublicFooter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-cyan-500/20 bg-slate-100 dark:bg-[#010813] py-12 px-4 sm:px-6 lg:px-14 text-xs text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <FCAILogo size={32} />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">FCAI - Beni Suef University</span>
            <span className="text-slate-500 dark:text-slate-400">Faculty of Computers &amp; Artificial Intelligence · Arab Republic of Egypt</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a href="#/departments" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Departments</a>
          <a href="#/features" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Smart Features</a>
          <a href="#/assistant" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">AI Assistant</a>
          <a href="#/metrics" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Platform Numbers</a>
          <a href="#/faq" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">FAQ</a>
          <a href="#/screens" className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">Screens Directory</a>
          <a href="#/login" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
            {isAuthenticated ? 'Switch Account' : 'Sign In'}
          </a>
        </div>

        <div className="text-right text-slate-500 dark:text-slate-400">
          <span>© 2026/2027 FCAI BSU Platform. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};
