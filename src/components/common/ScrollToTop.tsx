import React, { useState, useEffect } from 'react';
import { Icon } from '../icons/Icon';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const contentEl = document.getElementById('content');
      const contentScroll = contentEl ? contentEl.scrollTop : 0;
      const mainEl = document.querySelector('.main');
      const mainScroll = mainEl ? mainEl.scrollTop : 0;

      const currentScroll = Math.max(winScroll, contentScroll, mainScroll);
      setIsVisible(currentScroll > 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const contentEl = document.getElementById('content');
    if (contentEl) contentEl.addEventListener('scroll', handleScroll, { passive: true });
    const mainEl = document.querySelector('.main');
    if (mainEl) mainEl.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (contentEl) contentEl.removeEventListener('scroll', handleScroll);
      if (mainEl) mainEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });

    const contentEl = document.getElementById('content');
    if (contentEl) contentEl.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('.main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      title="Back to Top"
      className={`fixed z-[95] transition-all duration-300 ease-out hidden md:flex hide-m items-center justify-center cursor-pointer group
        right-6 bottom-6 md:right-8 md:bottom-8
        w-12 h-12 rounded-2xl
        bg-[#021024]/85 backdrop-blur-xl border border-sky-400/35 hover:border-sky-400/60
        text-sky-300 hover:text-white
        shadow-xl shadow-sky-500/25 hover:shadow-sky-500/35
        hover:-translate-y-1 active:translate-y-0 active:scale-95
        ${isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'}
      `}
    >
      {/* Ambient Pulsing Aura */}
      <span className="absolute -inset-1 rounded-2xl bg-sky-400/20 blur-sm group-hover:opacity-100 opacity-60 transition-opacity pointer-events-none" />
      
      {/* Icon */}
      <div className="relative z-10 flex flex-col items-center justify-center transition-transform group-hover:-translate-y-0.5">
        <Icon name="chevronUp" size="md" className="stroke-[2.5]" />
      </div>
    </button>
  );
};
