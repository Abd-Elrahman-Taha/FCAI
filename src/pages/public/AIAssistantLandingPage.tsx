import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PublicHeader } from '../../components/common/PublicHeader';
import { PublicFooter } from '../../components/common/PublicFooter';
import { BottomNav } from '../../components/layout/BottomNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AIAssistantLandingPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);

  const sampleQueries = [
    {
      q: 'What is the fundamental difference between a Process and a POSIX Thread?',
      course: 'CS301 · Operating Systems II',
      doctor: 'Dr. Mohamed Helmy',
      slideCitation: 'Lecture 04 · Multi-Threading & Concurrency (Slide 14/48)',
      answer:
        'A Process possesses an independent virtual address space, isolated file descriptor tables, and dedicated system resources. A Thread (POSIX pthread) shares the parent process memory segment (heap and global data), but maintains its own unique thread ID, registers, and runtime execution stack. POSIX pthreads communicate via shared memory with mutex synchronization, reducing context-switch overhead by ~80% compared to heavy fork() process context switches.',
      codeSnippet: 'pthread_t tid;\npthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;\npthread_create(&tid, NULL, worker_routine, (void*)&data);'
    },
    {
      q: 'Explain the Backpropagation gradient calculation in Multi-Layer Perceptrons.',
      course: 'AI302 · Deep Learning & Neural Nets',
      doctor: 'Prof. Dr. Hend Mahmoud',
      slideCitation: 'Lecture 03 · Gradient Descent & Chain Rule (Slide 22/60)',
      answer:
        'Backpropagation recursively applies the mathematical calculus Chain Rule to calculate the partial derivatives of the scalar loss function L with respect to every weight tensor W and bias b. By propagating the error delta backward from the output layer through activation derivatives (such as ReLU or GeLU), gradient descent iteratively updates parameters: W = W - eta * (dL/dW).',
      codeSnippet: '# Forward: z = X @ W + b; a = relu(z)\n# Backward: delta = grad_output * (z > 0)\n# grad_W = X.T @ delta'
    },
    {
      q: 'What are the exact 3NF (Third Normal Form) requirements in relational database design?',
      course: 'IS201 · Database Management Systems',
      doctor: 'Assoc. Prof. Dr. Khaled Mostafa',
      slideCitation: 'Lecture 06 · Normalization & Functional Dependencies (Slide 19/52)',
      answer:
        'A relational schema is in Third Normal Form (3NF) if and only if it is in Second Normal Form (2NF) and has NO transitive functional dependencies for non-prime attributes. Specifically, for every non-trivial functional dependency X -> A, either X is a superkey of the relation or A is a prime attribute (part of candidate key). Eliminating transitive dependencies prevents insert, update, and deletion anomalies.',
      codeSnippet: '-- Decomposition into 3NF:\nCREATE TABLE Student (student_id INT PRIMARY KEY, dept_code VARCHAR(10));\nCREATE TABLE Department (dept_code VARCHAR(10) PRIMARY KEY, dept_name VARCHAR(50));'
    }
  ];

  const activeQuery = sampleQueries[selectedPromptIndex];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020b17] text-slate-800 dark:text-slate-100 overflow-x-clip transition-colors duration-300">
      <PublicHeader activeNav="assistant" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-14 overflow-hidden">
        {/* Ambient Neon Blue Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute w-[650px] h-[650px] rounded-full blur-[150px] -top-24 left-1/3 bg-cyan-500/15" />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] bottom-10 right-10 bg-blue-600/15" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Icon name="sparkles" size="sm" />
            <span>INSTITUTIONAL AI STUDY ASSISTANT · GROUNDED RAG SYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Official Course Grounded{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#0284c7] bg-clip-text text-transparent">
              AI Study Assistant
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
            No hallucinations. Strictly indexed on authorized lecture slides uploaded by faculty doctors of the Faculty of Computers &amp; Artificial Intelligence.
          </p>
        </div>
      </section>

      {/* Interactive Query Tester */}
      <section className="relative z-10 pb-20 px-4 sm:px-6 lg:px-14">
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-400/35 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon name="sparkles" size="md" className="text-cyan-400" />
                <span>Interactive RAG Slide Citation Demo</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click a sample student query below to view real-time vector retrieval &amp; official slide citations.
              </span>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
              18,420 Slides Indexed
            </span>
          </div>

          {/* Prompt Selection Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPromptIndex(idx)}
                className={`p-3.5 rounded-2xl text-left text-xs transition-all cursor-pointer border ${
                  selectedPromptIndex === idx
                    ? 'bg-[#052659]/60 border-sky-400 text-slate-900 dark:text-white shadow-md shadow-sky-500/20 ring-1 ring-sky-400/40'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-cyan-500/20 text-slate-600 dark:text-slate-400 hover:border-cyan-400/40'
                }`}
              >
                <span className="font-bold block text-cyan-600 dark:text-cyan-400 mb-1">
                  Query 0{idx + 1}
                </span>
                <span className="line-clamp-2 font-medium">{item.q}</span>
              </button>
            ))}
          </div>

          {/* Query & Answer Display Box */}
          <motion.div
            key={selectedPromptIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-6 bg-white/80 dark:bg-slate-950/80 border border-cyan-400/30 space-y-6 shadow-xl shadow-cyan-950/20"
          >
            {/* User Question */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                Q
              </div>
              <div>
                <b className="text-sm sm:text-base text-slate-900 dark:text-white block">
                  {activeQuery.q}
                </b>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block font-mono">
                  {activeQuery.course} · Instructor: {activeQuery.doctor}
                </span>
              </div>
            </div>

            {/* AI Verified Answer */}
            <div className="flex items-start gap-3 pl-2 sm:pl-4 border-l-2 border-cyan-400">
              <div className="w-8 h-8 rounded-xl bg-[#38bdf8] text-[#021024] flex items-center justify-center font-black text-xs shrink-0">
                AI
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    Grounded Answer
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    Verified from Slide PDF
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activeQuery.answer}
                </p>

                {/* Code Snippet if applicable */}
                {activeQuery.codeSnippet && (
                  <pre className="p-3.5 rounded-xl bg-[#020b17] border border-cyan-500/25 text-cyan-300 font-mono text-xs overflow-x-auto">
                    <code>{activeQuery.codeSnippet}</code>
                  </pre>
                )}

                {/* Official Citation Badge */}
                <div className="flex items-center gap-2 text-xs text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-950/50 p-2.5 rounded-xl border border-cyan-500/30">
                  <Icon name="fileText" size="sm" className="text-cyan-400 shrink-0" />
                  <span className="font-semibold">Slide Citation:</span>
                  <span className="font-mono">{activeQuery.slideCitation}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assistant Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-cyan-500/20 text-xs">
            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/50">
              <b className="text-slate-900 dark:text-white block mb-1">Strict Anti-Hallucination</b>
              <span className="text-slate-500 dark:text-slate-400">If a concept is not in your faculty doctor slides, it gracefully informs you instead of guessing.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/50">
              <b className="text-slate-900 dark:text-white block mb-1">Exam Prep Quiz Mode</b>
              <span className="text-slate-500 dark:text-slate-400">Generate targeted multiple-choice and conceptual practice questions straight from lecture chunks.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/50">
              <b className="text-slate-900 dark:text-white block mb-1">Bilingual Academic RAG</b>
              <span className="text-slate-500 dark:text-slate-400">Full understanding of both English computer science nomenclature and Arabic faculty queries.</span>
            </div>
          </div>

          {/* Launch Assistant CTA: Solid Color Button (No Gradient) */}
          <div className="text-center pt-2">
            <a
              href={isAuthenticated ? `#/${role}/study-assistant` : '#/login'}
              className="cta-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <span>{isAuthenticated ? 'Open Student AI Assistant Chat' : 'Sign In to Try AI Assistant'}</span>
              <Icon name="arrowRight" size="sm" />
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BottomNav activePath="assistant" />
      <MobileDrawer activePath="assistant" />
      <ScrollToTop />
    </div>
  );
};
