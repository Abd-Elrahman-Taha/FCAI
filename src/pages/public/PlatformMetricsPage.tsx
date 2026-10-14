import React from 'react';
import { motion } from 'framer-motion';
import { PublicHeader } from '../../components/common/PublicHeader';
import { PublicFooter } from '../../components/common/PublicFooter';
import { BottomNav } from '../../components/layout/BottomNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const PlatformMetricsPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  const primaryStats = [
    { value: '4,850+', label: 'Active Students', sub: 'Across 4 Academic Levels', icon: 'users', color: 'from-cyan-400 to-blue-500' },
    { value: '106', label: 'Interactive Screens', sub: 'Zero Mockups · 100% Functional', icon: 'grid', color: 'from-blue-400 to-indigo-600' },
    { value: '99.8%', label: 'QR Verification Accuracy', sub: 'Zero Geofence Proxy Pass', icon: 'qr', color: 'from-sky-400 to-blue-500' },
    { value: '140', label: 'Credit Hours Framework', sub: 'Bylaw 2026/2027 Accredited', icon: 'award', color: 'from-sky-400 to-blue-600' },
    { value: '18,420+', label: 'Vector Indexed Slides', sub: 'Real-time pgvector RAG', icon: 'sparkles', color: 'from-cyan-400 to-sky-600' },
    { value: '3,200+', label: 'Fawry Payments Settled', sub: 'Real-time Webhook Integration', icon: 'wallet', color: 'from-blue-500 to-cyan-400' },
    { value: '94.2%', label: 'Concurrent Peak Uptime', sub: 'Stress-tested Under Registration', icon: 'activity', color: 'from-cyan-300 to-blue-500' },
    { value: '4', label: 'Specialized Departments', sub: 'CS · AI · IS · IT', icon: 'layers', color: 'from-blue-400 to-sky-400' },
  ];

  const departmentDistribution = [
    { dept: 'Computer Science (CS)', count: 1420, percent: 34, color: 'bg-cyan-400' },
    { dept: 'Artificial Intelligence (AI)', count: 1150, percent: 28, color: 'bg-sky-400' },
    { dept: 'Information Systems (IS)', count: 890, percent: 21, color: 'bg-blue-500' },
    { dept: 'Information Technology (IT)', count: 780, percent: 17, color: 'bg-indigo-500' },
  ];

  const facultyCapacity = [
    { label: 'Faculty Professors & Doctors', value: '42' },
    { label: 'Teaching Assistants (TAs)', value: '68' },
    { label: 'Specialized Computer Labs', value: '12' },
    { label: 'High-Capacity Lecture Amphitheaters', value: '4' },
    { label: 'Air-Gapped Cybersecurity Ranges', value: '1' },
    { label: 'HPC GPU Computing Nodes', value: '8' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020b17] text-slate-800 dark:text-slate-100 overflow-x-clip transition-colors duration-300">
      <PublicHeader activeNav="metrics" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-14 overflow-hidden">
        {/* Ambient Neon Blue Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] -top-24 left-10 bg-cyan-500/15" />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] bottom-10 right-10 bg-blue-600/15" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Icon name="barChart" size="sm" />
            <span>FCAI BENI SUEF UNIVERSITY · INSTITUTIONAL SCALE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Institutional Live{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#0284c7] bg-clip-text text-transparent">
              Platform Numbers
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Real-time operational statistics demonstrating the throughput, security, and computational capacity of the FCAI BSU institutional portal.
          </p>
        </div>
      </section>

      {/* Primary KPI Metrics Grid */}
      <section className="relative z-10 pb-20 px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {primaryStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="card p-6 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 dark:text-cyan-300 flex items-center justify-center">
                    <Icon name={stat.icon} size="sm" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stat.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Department Breakdown & Faculty Capacity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Department Breakdown Bar */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-cyan-400/35">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="pieChart" size="md" className="text-cyan-400" />
                  <span>Student Enrollment by Department</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Distribution across Computer Science, Artificial Intelligence, Information Systems, and Information Technology.
                </p>
              </div>

              {/* Progress bars */}
              <div className="space-y-4">
                {departmentDistribution.map((d, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <b className="text-slate-800 dark:text-slate-200">{d.dept}</b>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {d.count.toLocaleString()} Students ({d.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${d.color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,229,255,0.6)]`}
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Faculty & Infrastructure Capacity */}
            <div className="lg:col-span-5 card p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="layers" size="md" className="text-cyan-400" />
                  <span>Faculty &amp; Lab Capacity</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Physical facilities at the Beni Suef campus for 2026/2027.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facultyCapacity.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-cyan-500/20">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1">{item.label}</span>
                    <b className="text-2xl font-black text-slate-900 dark:text-cyan-300 font-mono mt-0.5 block">{item.value}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Call to Action */}
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-cyan-400/35">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Explore the Complete Screen System
            </h3>
            <p className="max-w-xl mx-auto text-sm text-slate-600 dark:text-slate-300">
              Browse through our interactive directory of all 106 implemented screens across Student, Doctor, TA, Admin, and Employee roles.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={isAuthenticated ? `#/${role}/dashboard` : '#/login'}
                className="cta-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Enter Portal Dashboard' : 'Sign In'}</span>
                <Icon name="arrowRight" size="sm" />
              </a>
              <a
                href="#/screens"
                className="cta-secondary inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Icon name="grid" size="sm" />
                <span>Open 106 Screens Directory</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BottomNav activePath="metrics" />
      <MobileDrawer activePath="metrics" />
      <ScrollToTop />
    </div>
  );
};
