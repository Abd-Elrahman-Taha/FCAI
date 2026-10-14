import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicHeader } from '../../components/common/PublicHeader';
import { PublicFooter } from '../../components/common/PublicFooter';
import { BottomNav } from '../../components/layout/BottomNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

interface FaqItem {
  id: number;
  category: string;
  q: string;
  a: string;
}

export const FaqPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const categories = ['All', 'Academic Bylaws 2026', 'Course Registration', 'QR Attendance', 'Tuition & Fawry', 'AI Study Assistant', 'Faculty & Grading'];

  const allFaqs: FaqItem[] = [
    {
      id: 1,
      category: 'AI Study Assistant',
      q: 'How does the AI Study Assistant verify answers from course materials without hallucinating?',
      a: 'The Study Assistant uses Retrieval-Augmented Generation (RAG) strictly indexed on official PDF lecture slides uploaded by faculty doctors of the Faculty of Computers & AI. When a student poses a query, the model calculates cosine similarity embeddings against indexed slide chunks, extracts the exact supporting paragraphs, and returns the response alongside the specific slide citation and page number.'
    },
    {
      id: 2,
      category: 'QR Attendance',
      q: 'How does the geofenced smart QR attendance prevent proxy check-ins and shared screenshots?',
      a: 'Each lecture generates a dynamic QR security token that regenerates every 5 seconds. To register attendance, the student must be physically within the Beni Suef campus geofence (~29.0768° N, 31.0975° E) and scan the live token before it expires. Forwarded screenshots will always fail because the cryptographic token changes every 5 seconds.'
    },
    {
      id: 3,
      category: 'Course Registration',
      q: 'What are the credit hour registration limits and prerequisite rules for Fall Semester 2026?',
      a: 'Under Academic Bylaw 2026/2027, students in Good Standing (cumulative GPA ≥ 2.00) can register up to 18 credit hours per semester. Students on Academic Probation (GPA < 2.00) are restricted to 12 credit hours. The registration engine automatically enforces prerequisite completions before allowing course additions.'
    },
    {
      id: 4,
      category: 'Tuition & Fawry',
      q: 'How can students pay tuition fees electronically and retrieve official e-receipts?',
      a: 'Students navigate to the Fees & Fawry Pay module in their portal to generate a unique Fawry reference code. Once paid at any authorized Fawry merchant or through the Fawry mobile app, the platform automatically reconciles the transaction via secure webhook and generates an official PDF receipt with verification barcode.'
    },
    {
      id: 5,
      category: 'Faculty & Grading',
      q: 'How do faculty doctors and teaching assistants publish grades and calculate cumulative GPAs?',
      a: 'Faculty doctors have dedicated grading interfaces to input midterm exams, lab practicals, POSIX assignment evaluations, and final grades. Once submitted and approved by the department head, the SIS automatically computes semester and cumulative GPAs based on the 4.00 grading scale and publishes them to student gradebooks.'
    },
    {
      id: 6,
      category: 'Academic Bylaws 2026',
      q: 'What is the minimum cumulative GPA required for graduation from FCAI BSU?',
      a: 'To graduate with a Bachelor of Science degree in Computer Science, Artificial Intelligence, Information Systems, or Information Technology, a student must successfully complete 140 credit hours with a cumulative GPA of at least 2.00/4.00, including passing the Senior Graduation Capstone Project.'
    },
    {
      id: 7,
      category: 'Course Registration',
      q: 'What is the deadline for Add/Drop period during the semester?',
      a: 'The official Add/Drop period runs through the end of Week 2 of each semester. During this window, students can add open course offerings or drop courses without academic penalty or a W grade appearing on their official academic transcript.'
    },
    {
      id: 8,
      category: 'QR Attendance',
      q: 'What happens if a student misses attendance due to a technical device issue?',
      a: 'If a student is present in the amphitheater but experiences hardware or battery failure, the course doctor or teaching assistant can manually override and verify their attendance on the live roster from the Faculty Attendance Management portal.'
    }
  ];

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020b17] text-slate-800 dark:text-slate-100 overflow-x-clip transition-colors duration-300">
      <PublicHeader activeNav="faq" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-14 overflow-hidden">
        {/* Ambient Neon Blue Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] -top-20 -left-20 bg-cyan-500/15" />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] bottom-10 right-10 bg-blue-600/15" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Icon name="helpCircle" size="sm" />
            <span>FCAI BSU HELP CENTER · FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Answers &amp; Academic{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#0284c7] bg-clip-text text-transparent">
              Regulations FAQ
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Comprehensive answers regarding academic bylaws 2026/2027, course registrations, attendance verification, tuition payment, and AI tools.
          </p>

          {/* Real-time Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="search" size="sm" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., QR attendance, GPA, Fawry fees, RAG)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-cyan-500/30 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-md text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'cta-primary font-bold shadow-md'
                    : 'bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-cyan-500/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion Questions List */}
      <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-14">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="glass-panel p-10 text-center rounded-3xl border border-cyan-400/30 space-y-3">
              <Icon name="search" size="lg" className="mx-auto text-slate-400" />
              <b className="text-base text-slate-900 dark:text-white block">No matching questions found</b>
              <p className="text-xs text-slate-500">Try searching for other keywords or select 'All' categories.</p>
            </div>
          ) : (
            filteredFaqs.map(faq => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="card overflow-hidden transition-all duration-300 border border-slate-200 dark:border-cyan-500/25"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-1">
                        {faq.q}
                      </h3>
                    </div>

                    <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`}>
                      <Icon name="chevronDown" size="sm" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 sm:px-6 pb-6 pt-0 border-t border-slate-100 dark:border-cyan-500/15"
                      >
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}

          {/* Need More Help Box */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 text-center space-y-4 border border-cyan-400/35 mt-12">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Still Have Academic Questions?
            </h3>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Our Student Affairs office and IT Support Center are available on campus and via electronic service requests.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={isAuthenticated ? `#/${role}/service-requests` : '#/login'}
                className="cta-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Submit Service Request' : 'Sign In to Submit Petition'}</span>
                <Icon name="arrowRight" size="sm" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BottomNav activePath="faq" />
      <MobileDrawer activePath="faq" />
      <ScrollToTop />
    </div>
  );
};
