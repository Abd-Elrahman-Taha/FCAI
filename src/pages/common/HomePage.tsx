import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Icon, FCAILogo } from '../../components/icons/Icon';
import { PublicHeader } from '../../components/common/PublicHeader';
import { PublicFooter } from '../../components/common/PublicFooter';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { BottomNav } from '../../components/layout/BottomNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { AmbientMotionAura } from '../../components/common/AmbientMotionAura';
import type { Role } from '../../types';

export const HomePage: React.FC = () => {
  const { role, switchRole, isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const departments = [
    {
      code: 'CS',
      name: 'Computer Science',
      icon: 'cpu',
      color: '#0284c7',
      desc: 'Advanced algorithms, operating systems, distributed architectures, compiler design, and software engineering.',
      skills: ['Distributed Systems', 'POSIX Operating Systems', 'Algorithm Design', 'High-Performance Computing'],
      stats: '1,420 Students · 42 Credit Hours'
    },
    {
      code: 'AI',
      name: 'Artificial Intelligence',
      icon: 'sparkles',
      color: '#38bdf8',
      desc: 'Machine learning, deep neural networks, computer vision, natural language processing, and autonomous robotics.',
      skills: ['Deep Learning', 'PyTorch & TensorFlow', 'Computer Vision', 'Reinforcement Learning'],
      stats: '1,150 Students · 45 Credit Hours'
    },
    {
      code: 'IS',
      name: 'Information Systems',
      icon: 'database',
      color: '#5483B3',
      desc: 'Enterprise database engines, big data engineering, business intelligence, cloud warehouses, and ERP management.',
      skills: ['PostgreSQL & Oracle', 'Data Warehousing', 'Business Intelligence', 'Enterprise Architecture'],
      stats: '890 Students · 38 Credit Hours'
    },
    {
      code: 'IT',
      name: 'Information Technology',
      icon: 'shieldCheck',
      color: '#d97706',
      desc: 'Network infrastructure, cybersecurity protocols, ethical hacking, cloud microservices, and IoT sensory systems.',
      skills: ['Network Security', 'Penetration Testing', 'Cloud Infrastructure', 'Cyber Defense'],
      stats: '780 Students · 40 Credit Hours'
    }
  ];

  const features = [
    {
      icon: 'sparkles',
      title: 'Grounded AI Study Tutor',
      desc: 'An AI assistant strictly constrained to verified lecture slide PDFs. Eliminates hallucinations with automatic source slide citations.',
      badge: 'RAG Grounded'
    },
    {
      icon: 'qr',
      title: 'Geofenced QR Attendance',
      desc: 'Dynamic 5-second rotating security tokens verified against Beni Suef University campus coordinates to eliminate proxy check-ins.',
      badge: 'Anti-Fraud'
    },
    {
      icon: 'calendar',
      title: 'Synchronized Smart Timetable',
      desc: 'Dual-view schedule with synchronized time alignment, lecture vs. lab distinctions, hall floor navigation, and printable formats.',
      badge: 'Live Sync'
    },
    {
      icon: 'award',
      title: 'Automated Academic SIS',
      desc: 'Instant cumulative GPA tracking, prerequisite enforcement, electronic Fawry tuition integration, and graduation status audits.',
      badge: 'Bylaw 2026'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI Study Assistant verify its answers from course materials?',
      a: 'The Study Assistant uses Retrieval-Augmented Generation (RAG) strictly indexed on official PDF lecture slides uploaded by faculty doctors. When you ask a question, it queries matching semantic chunks and returns the exact slide citation and page number.'
    },
    {
      q: 'How does the geofenced smart QR attendance prevent proxy check-ins?',
      a: 'Each lecture generates a dynamic QR code that refreshes every 5 seconds. To register attendance, the student must be physically within the Beni Suef campus geofence (~29.0768, 31.0975) and scan the live token before it expires.'
    },
    {
      q: 'What are the course registration prerequisites and credit limits for Fall 2026?',
      a: 'Students in Good Standing (GPA ≥ 2.00) can register up to 18 credit hours. The registration engine automatically enforces prerequisite course completions before allowing course additions.'
    },
    {
      q: 'How can students pay tuition fees and retrieve official e-receipts?',
      a: 'Tuition fees can be paid electronically using the generated Fawry reference code. Once paid, the SIS updates in real-time and issues an official PDF receipt with verification barcode.'
    },
    {
      q: 'How do faculty doctors and teaching assistants manage gradebooks and practical sessions?',
      a: 'Doctors have a dedicated portal to schedule lectures, project live QR codes, build exams, and publish grades. Teaching assistants track lab practicals, POSIX mutex submissions, and section attendances.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020b17] text-slate-800 dark:text-slate-100 overflow-x-clip selection:bg-sky-400 selection:text-slate-950 pb-20 md:pb-0 transition-colors duration-300">
      {/* Ambient Motion Aura: Subtle Cyber-Grid & Floating Neural Orbs */}
      <AmbientMotionAura />

      {/* Sticky Glassmorphic Top Navigation Header with Logo Scroll-to-Top */}
      <PublicHeader activeNav="home" />

      {/* HERO SECTION with Scroll Motion Animations */}
      <section className="relative z-10 pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-14 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vision & Big Typography */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Live Campus Radar Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-400/30 text-sky-800 dark:text-sky-300 text-xs font-semibold backdrop-blur-md shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 dark:bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600 dark:bg-sky-500"></span>
              </span>
              <span>BENI SUEF UNIVERSITY · ACADEMIC YEAR 2026/2027</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-slate-900 dark:text-white">
              Engineering the Future of{' '}
              <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#0284c7] bg-clip-text text-transparent">
                Intelligent Education
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              The flagship institutional operating system for the Faculty of Computers &amp; Artificial Intelligence. 
              Grounded AI lecture assistance, anti-fraud geofenced QR attendance, automated credit advising, and unified SIS operations.
            </p>

            {/* Call To Action Buttons: Solid Colors, No Gradients */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isAuthenticated ? (
                <a
                  href={`#/${role}/dashboard`}
                  className="cta-primary inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 cursor-pointer font-sans"
                >
                  <Icon name="dashboard" size="md" />
                  <span>Launch {role.toUpperCase()} Portal</span>
                  <Icon name="arrowRight" size="sm" />
                </a>
              ) : (
                <a
                  href="#/login"
                  className="cta-primary inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 cursor-pointer font-sans"
                >
                  <Icon name="login" size="md" />
                  <span>Sign In to Platform</span>
                  <Icon name="arrowRight" size="sm" />
                </a>
              )}

              <a
                href="#/screens"
                className="cta-secondary inline-flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all backdrop-blur-md cursor-pointer shadow-sm"
              >
                <Icon name="grid" size="sm" />
                <span>Explore 106 Screens Directory</span>
              </a>

              {!isAuthenticated && (
                <a
                  href="#/signup"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl text-xs font-bold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/40 border border-sky-300 dark:border-sky-500/30 transition-all cursor-pointer shadow-sm"
                >
                  <Icon name="user" size="sm" />
                  <span>New Student Enrollment</span>
                </a>
              )}
            </div>

            {/* Key Quick Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-2">
                <Icon name="shieldCheck" size="sm" className="text-sky-500 dark:text-sky-400" />
                Anti-Proxy Geofence
              </span>
              <span className="flex items-center gap-2">
                <Icon name="sparkles" size="sm" className="text-sky-600 dark:text-sky-400" />
                Strict PDF AI Tutor
              </span>
              <span className="flex items-center gap-2">
                <Icon name="layers" size="sm" className="text-blue-600 dark:text-sky-400" />
                106 Active Workflows
              </span>
            </div>
          </motion.div>

          {/* Right Column: 3D Neural Core Model + Floating Glass Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full max-w-[520px] mx-auto min-h-[400px] sm:min-h-[620px] flex items-center justify-center"
          >
            {/* Ambient halo behind the model */}
            <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-sky-400/20 via-blue-500/15 to-[#5483B3]/20 blur-3xl animate-pulse pointer-events-none" />

            {/* ===== 3D FCAI NEURAL CORE MODEL (centerpiece) ===== */}
            <div className="relative z-10 scale-[0.82] sm:scale-100" aria-hidden="true">
              {/* Outer orbit with the 4 departments */}
              <div className="badge-orbit">
                {[
                  { code: 'CS', color: '#0284c7', pos: { top: '0%', left: '50%' } },
                  { code: 'AI', color: '#38bdf8', pos: { top: '50%', left: '100%' } },
                  { code: 'IS', color: '#5483B3', pos: { top: '100%', left: '50%' } },
                  { code: 'IT', color: '#7DA0CA', pos: { top: '50%', left: '0%' } }
                ].map(b => (
                  <div key={b.code} className="badge-orbit-item" style={b.pos}>
                    <span style={{ color: b.color, border: `1.5px solid ${b.color}88`, boxShadow: `0 0 18px ${b.color}45` }}>
                      {b.code}
                    </span>
                  </div>
                ))}
              </div>

              <div className="core-stage animate-float">
                <div className="core-3d">
                  {/* Spinning wireframe globe */}
                  <div className="core-globe">
                    {[0, 30, 60, 90, 120, 150].map(d => (
                      <span key={d} className="globe-line" style={{ transform: `rotateY(${d}deg)` }} />
                    ))}
                    <span className="globe-line globe-lat" style={{ transform: 'rotateX(90deg)' }} />
                    <span className="globe-line globe-lat small" style={{ transform: 'rotateX(90deg) translateZ(55px)' }} />
                    <span className="globe-line globe-lat small" style={{ transform: 'rotateX(90deg) translateZ(-55px)' }} />
                  </div>

                  {/* Tilted electron orbits */}
                  <div className="core-orbit o1"><span className="orbit-electron" /></div>
                  <div className="core-orbit o2"><span className="orbit-electron" /></div>
                  <div className="core-orbit o3"><span className="orbit-electron" /></div>

                  {/* Glowing energy core with FCAI logo */}
                  <div className="core-sphere">
                    <FCAILogo size={50} />
                  </div>
                </div>

                {/* Twinkling sparks */}
                <span className="core-spark" style={{ top: '8%', left: '22%', animationDelay: '0s' }} />
                <span className="core-spark" style={{ top: '18%', right: '10%', animationDelay: '0.7s' }} />
                <span className="core-spark" style={{ bottom: '14%', left: '8%', animationDelay: '1.4s' }} />
                <span className="core-spark" style={{ bottom: '6%', right: '26%', animationDelay: '2.1s' }} />
                <span className="core-spark" style={{ top: '48%', left: '-4%', animationDelay: '1s' }} />
              </div>

              {/* Model caption */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 sm:-bottom-12 whitespace-nowrap inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-950/80 border border-sky-500/30 text-[10px] font-bold tracking-widest text-sky-700 dark:text-sky-300 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                FCAI NEURAL CORE · ONLINE
              </div>
            </div>

            {/* LIVE CHIP: top-left */}
            <div className="hidden sm:inline-flex absolute top-4 left-0 z-20 items-center gap-2 px-3 py-2 rounded-xl glass-panel text-[11px] font-semibold text-slate-700 dark:text-slate-200 animate-float-slow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span><strong className="text-slate-900 dark:text-white font-mono">1,284</strong> students online</span>
            </div>

            {/* FLOATING CARD 1: Grounded AI Study Assistant (top-right) */}
            <div className="hidden sm:block absolute top-0 right-0 w-72 rounded-2xl p-4 glass-panel animate-float z-20">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-500/20 dark:border-sky-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-300">
                    <Icon name="sparkles" size="sm" />
                  </div>
                  <div>
                    <strong className="text-xs text-slate-900 dark:text-white block">AI PDF Study Tutor</strong>
                    <span className="text-[10px] text-sky-600 dark:text-sky-300 font-semibold">Vector Grounding Ready</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                  99.4% Cited
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                "Explain the 0/1 Knapsack memoization table recurrence relation."
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                <span className="text-sky-700 dark:text-sky-300 font-mono flex items-center gap-1 font-medium">
                  <Icon name="book" size="sm" />
                  Algorithms_Ch4_DP.pdf (p.18)
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">Verified</span>
              </div>
            </div>

            {/* FLOATING CARD 2: Smart QR Geofenced Attendance (bottom-left) */}
            <div className="hidden sm:block absolute bottom-20 left-0 w-56 rounded-2xl p-3.5 glass-panel animate-float-delayed z-20">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-300">
                    <Icon name="qr" size="sm" />
                  </div>
                  <div className="min-w-0">
                    <strong className="text-xs text-slate-900 dark:text-white block truncate">QR Attendance</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Hall 302 · Bldg B</span>
                  </div>
                </div>
                <div className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-500/40 flex-shrink-0">
                  04s
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/60 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping flex-shrink-0" />
                <span className="truncate">GPS 29.0768 N, 31.0975 E</span>
              </div>
            </div>

            {/* FLOATING CARD 3: Academic GPA Excellence (bottom-right) */}
            <div className="hidden sm:block absolute bottom-0 right-0 w-60 rounded-2xl p-4 glass-panel animate-float-slow z-20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Academic Standing
                </span>
                <span className="text-sky-600 dark:text-sky-400 text-xs font-bold">Top 3%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">3.85</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">/ 4.00</span>
                <span className="ml-auto text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 px-2 py-0.5 rounded-full border border-sky-300 dark:border-sky-500/30">
                  Excellent
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full w-[75%] rounded-full bg-sky-400" />
              </div>
              <div className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                Credit Hours: <strong className="text-slate-900 dark:text-white">102 / 136 CH</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLATFORM NUMBERS COUNTER BAR - Scroll Animated */}
      <section id="metrics" className="relative z-10 py-12 border-y border-slate-200 dark:border-cyan-500/15 bg-white/80 dark:bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '106', label: 'Active Platform Screens', grad: 'from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-blue-400' },
            { num: '4,200+', label: 'Enrolled Undergraduates', grad: 'from-blue-600 to-sky-600 dark:from-sky-300 dark:to-blue-400' },
            { num: '180+', label: 'Professors, Doctors & TAs', grad: 'from-sky-600 to-blue-700 dark:from-blue-300 dark:via-sky-400 dark:to-cyan-400' },
            { num: '100%', label: 'PDF-Grounded AI Citations', grad: 'from-blue-600 via-sky-600 to-cyan-500 dark:from-sky-300 dark:via-cyan-300 dark:to-blue-300' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-black font-mono bg-gradient-to-r ${stat.grad} bg-clip-text text-transparent`}>
                {stat.num}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1.5 block">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACADEMIC DEPARTMENTS SHOWCASE - Scroll Animated */}
      <section id="departments" className="relative z-10 py-24 px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              ACADEMIC SPECIALIZATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Four World-Class Computing Departments
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:base leading-relaxed">
              Engineered according to modern Egyptian Supreme Council of Universities bylaws with ABET aligned learning outcomes.
            </p>
          </motion.div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, idx) => (
              <motion.div
                key={dept.code}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl p-6 glass-panel transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                      style={{ background: `${dept.color}15`, border: `1.5px solid ${dept.color}40`, color: dept.color }}
                    >
                      <Icon name={dept.icon} size="lg" />
                    </div>
                    <span 
                      className="font-mono text-sm font-black px-2.5 py-1 rounded-lg"
                      style={{ background: `${dept.color}15`, color: dept.color, border: `1px solid ${dept.color}35` }}
                    >
                      {dept.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {dept.desc}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {dept.skills.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: dept.color }} />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>{dept.stats}</span>
                  <a
                    href="#/student/courses"
                    className="font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                  >
                    Courses &rarr;
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FLAGSHIP SMART FEATURES - Scroll Animated */}
      <section id="features" className="relative z-10 py-20 bg-slate-100/70 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-900 px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              NEXT-GEN CAMPUS CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Modern Higher Education
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Every workflow from academic advising to lecture room tracking is digitized with anti-fraud safeguards.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                className="rounded-2xl p-6 glass-panel group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 dark:bg-sky-500/10 border border-sky-500/30 dark:border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                    <Icon name={f.icon} size="md" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI ASSISTANT SPOTLIGHT BANNER - Scroll Animated */}
      <section id="assistant" className="relative z-10 py-20 px-4 sm:px-6 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-white via-sky-50/40 to-blue-50/50 dark:from-[#041a38]/80 dark:via-[#020e20] dark:to-[#032042]/70 border border-sky-500/30 dark:border-sky-500/30 shadow-xl dark:shadow-2xl"
        >
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-sky-400/20 dark:bg-sky-500/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/15 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-500/30 dark:border-sky-500/30">
                Grounding Guarantee
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Private AI Study Tutor Grounded Strictly in Course Slides
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tired of AI making up answers? The FCAI BSU Study Assistant utilizes local retrieval embeddings to query only 
                the official lecture documents approved by your faculty professors. If an algorithm isn't in your curriculum, 
                it explicitly informs you.
              </p>
              <div className="pt-2">
                <a
                  href="#/student/study-assistant"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black text-[#021024] bg-[#38bdf8] hover:bg-[#C1E8FF] transition-all shadow-md shadow-sky-500/25 cursor-pointer"
                >
                  <Icon name="sparkles" size="sm" />
                  <span>Try AI Study Assistant Now</span>
                  <Icon name="arrowRight" size="sm" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-5 border border-sky-500/30 dark:border-sky-500/20 space-y-3 font-mono text-xs text-white">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>AI Grounding Trace Log</span>
                <span className="text-sky-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  100% In-Domain
                </span>
              </div>
              <div className="text-slate-300">
                &gt; Query: "What is Dijkstra shortest path complexity with min-heap?"
              </div>
              <div className="text-sky-300 pl-3 border-l-2 border-sky-500">
                Found match in Chapter 6 (Graph Algorithms, Slide 24).<br />
                Answer: O((V + E) log V) utilizing adjacency lists and binary min-heaps.
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Verified against: Algorithms_CS301_Lecture06.pdf
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (Accordion) - Scroll Animated */}
      <section id="faq" className="relative z-10 py-20 bg-slate-100/60 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-900 px-4 sm:px-6 lg:px-14">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              HELP &amp; INQUIRIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Common questions from FCAI undergraduates, doctors, and prospective students.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all hover:border-sky-400/40 glass-panel"
                >
                  <button
                    type="button"
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <Icon name="chevronDown" size="sm" />
                    </span>
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-150 dark:border-slate-800/60"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM FUTURISTIC LAUNCH BANNER - Scroll Animated */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-sky-50 via-blue-50 to-slate-50 dark:from-blue-950/50 dark:via-[#031e40]/40 dark:to-slate-900/80 border border-sky-400/40 dark:border-sky-400/30 shadow-xl dark:shadow-2xl space-y-6"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-950/80 border border-sky-400/40 dark:border-sky-500/40 text-sky-800 dark:text-sky-300 text-xs font-bold">
            <Icon name="sparkles" size="sm" /> READY FOR FALL SEMESTER 2026
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Step Into the Next Era of Higher Education
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Experience the unified digital campus built for the Faculty of Computers &amp; Artificial Intelligence at Beni Suef University.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <a
                href={`#/${role}/dashboard`}
                className="cta-primary inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <Icon name="dashboard" size="md" />
                <span>Enter Portal as {role.toUpperCase()}</span>
              </a>
            ) : (
              <a
                href="#/login"
                className="cta-primary inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <Icon name="login" size="md" />
                <span>Sign In to Platform</span>
              </a>
            )}

            <a
              href="#/screens"
              className="cta-secondary inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-semibold transition-all shadow-sm"
            >
              <Icon name="grid" size="sm" />
              <span>Browse All 106 Screens</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Shared Futuristic Faculty Footer */}
      <PublicFooter />

      {/* Mobile Lower Nav & Drawer matching other pages */}
      <BottomNav activePath="home" />
      <MobileDrawer activePath="home" />
      <ScrollToTop />
    </div>
  );
};
