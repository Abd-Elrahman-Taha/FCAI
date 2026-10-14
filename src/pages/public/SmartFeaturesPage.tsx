import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PublicHeader } from '../../components/common/PublicHeader';
import { PublicFooter } from '../../components/common/PublicFooter';
import { BottomNav } from '../../components/layout/BottomNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const SmartFeaturesPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [tokenTimer, setTokenTimer] = useState(5);
  const [demoToken, setDemoToken] = useState('BSU-2026-FCAI-84A1');

  // Dynamic 5-second QR token simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenTimer(prev => {
        if (prev <= 1) {
          const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
          setDemoToken(`BSU-2026-FCAI-${rand}`);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 'qr',
      badge: 'Anti-Proxy Security Token',
      title: 'Geofenced Dynamic QR Attendance Engine',
      desc: 'Dynamic 5-second rotating security tokens verified against Beni Suef University GPS campus coordinates (29.0768° N, 31.0975° E). Completely eliminates proxy attendance, screenshot forwarding, and unauthorized off-campus check-ins.',
      metrics: ['5-Second Token Rotation', 'Campus GPS Polygon Geofence', 'Zero Proxy Pass Rate', 'Instant Doctor Roster Sync']
    },
    {
      id: 'timetable',
      badge: 'Synchronized Campus Scheduler',
      title: 'Intelligent Conflict-Free Timetable System',
      desc: 'Dual-grid schedule engine with real-time room conflict prevention, clear distinction between lectures, practical sections, and professor office hours. Includes floor navigation and instant timetable export.',
      metrics: ['Zero Schedule Overlaps', 'Lecture Hall Floor Plan Guidance', 'Automated Lab Section Partitioning', 'Instant Calendar Sync (iCal)']
    },
    {
      id: 'sis',
      badge: 'Autonomous Degree Audit',
      title: 'Automated Academic SIS & Prerequisite Engine',
      desc: 'Enforces academic bylaws, prerequisite completions, and credit limits automatically. Real-time GPA recalculation upon grade entry with automated academic standing audits.',
      metrics: ['Bylaw 2026 Validation', 'Prerequisite Chain Enforcement', 'Instant Cumulative GPA Audit', 'Graduation Eligibility Matrix']
    },
    {
      id: 'fintech',
      badge: 'FinTech Integration',
      title: 'Electronic Fawry Payment & Verifiable E-Receipts',
      desc: 'Direct electronic integration with Fawry payment gateway. Generates unique student payment reference codes and instantly issues cryptographically verifiable PDF receipts upon transaction settlement.',
      metrics: ['Automated Reference Codes', 'Real-time Webhook Settlement', 'Verifiable PDF Receipts', 'Zero Queue Cashier Operations']
    },
    {
      id: 'autograder',
      badge: 'High-Concurrency Grading',
      title: 'POSIX Lab Compiler & Autograding Testbench',
      desc: 'Automated Linux sandbox environment executing student C/C++ submissions. Detects memory leaks using Valgrind, checks POSIX thread mutex safety, and reports compiler diagnostics in real time.',
      metrics: ['Air-Gapped Sandbox Execution', 'Valgrind Memory Leak Audits', 'POSIX Thread Race Checks', 'Automated Gradebook Publishing']
    },
    {
      id: 'security',
      badge: 'Institutional Security',
      title: 'Role-Based Access Control (RBAC) & Audit Logs',
      desc: 'Granular permissions architecture governing Students, Faculty Doctors, Teaching Assistants, Student Affairs Employees, and College Admins with comprehensive audit trail logging.',
      metrics: ['Strict Role Segregation', 'Tamper-Proof Audit Trail', 'Session Expiration Security', 'Encrypted Student Records']
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020b17] text-slate-800 dark:text-slate-100 overflow-x-clip transition-colors duration-300">
      <PublicHeader activeNav="features" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-14 overflow-hidden">
        {/* Ambient Neon Blue Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] -top-20 -right-20 bg-cyan-500/15" />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] bottom-10 -left-20 bg-blue-600/15" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Icon name="sparkles" size="sm" />
            <span>CAMPUS OPERATING SYSTEM · ARCHITECTURE &amp; INNOVATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Next-Generation{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#0284c7] bg-clip-text text-transparent">
              Smart Features
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Engineered from first principles to eliminate manual paperwork, guarantee academic integrity, and deliver instantaneous institutional intelligence.
          </p>
        </div>
      </section>

      {/* Interactive Geofenced QR Simulator Highlight */}
      <section className="relative z-10 pb-16 px-4 sm:px-6 lg:px-14">
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-400/35">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                Live Dynamic Token Simulation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Rotating Geofenced Attendance Token
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Notice how the verification token regenerates every 5 seconds. To register check-in, a student device must match both the active rotating cryptographic token and the Beni Suef University campus coordinates.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block">Campus Polygon:</span>
                  <b className="font-mono text-slate-800 dark:text-cyan-300">29.0768° N, 31.0975° E</b>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block">Status:</span>
                  <b className="text-sky-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    ACTIVE VERIFICATION
                  </b>
                </div>
              </div>
            </div>

            {/* Simulated Live Token Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#020b17] border border-cyan-400/40 shadow-xl shadow-cyan-950/50 text-center space-y-4">
              <div className="relative p-4 rounded-xl bg-white text-slate-950 shadow-inner">
                {/* Visual QR Pattern Simulation */}
                <div className="w-36 h-36 grid grid-cols-6 grid-rows-6 gap-1 p-2 bg-white">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs transition-colors duration-500 ${
                        (i % 2 === 0 || i % 7 === 0) ? 'bg-slate-950' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                  <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-black text-[10px] shadow-sm">
                    FCAI
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dynamic Token</div>
                <div className="font-mono text-lg font-black text-cyan-300 tracking-wider mt-0.5">
                  {demoToken}
                </div>
              </div>

              {/* Countdown Progress Meter */}
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Rotating in:</span>
                  <span className="text-cyan-400 font-bold">{tokenTimer}s</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${(tokenTimer / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Core Smart Features */}
      <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Platform Engineering Specifications
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Built for resilient institutional performance across all 106 student and faculty screens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="card p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25">
                      {feat.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-cyan-500/20">
                  {feat.metrics.map((m, mi) => (
                    <div key={mi} className="flex items-center gap-2 text-xs text-slate-700 dark:text-cyan-200 font-medium">
                      <Icon name="check" size="sm" className="text-cyan-500 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Portal CTA Banner */}
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-cyan-400/35">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Experience the Smart Features Live
            </h3>
            <p className="max-w-xl mx-auto text-sm text-slate-600 dark:text-slate-300">
              Launch into the active portal to test student QR attendance check-in, real-time timetable views, and study assistant chats.
            </p>
            <div className="pt-2">
              <a
                href={isAuthenticated ? `#/${role}/dashboard` : '#/login'}
                className="cta-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Enter Portal Dashboard' : 'Sign In to Platform'}</span>
                <Icon name="arrowRight" size="sm" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BottomNav activePath="features" />
      <MobileDrawer activePath="features" />
      <ScrollToTop />
    </div>
  );
};
