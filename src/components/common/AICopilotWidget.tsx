import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../icons/Icon';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AICopilotWidget: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${currentUser?.name || ''}! 👋 I am your FCAI Academic Copilot powered by campus neural models. Ask me about lecture summaries, assignment deadlines, or your GPA and exam grade targets.`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const quickPrompts = [
    'Summarize this lecture PDF',
    'What is the deadline for Assignment 2?',
    'Calculate my required final exam score for an A grade',
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = promptText.toLowerCase();

      if (lower.includes('summarize') || lower.includes('lecture')) {
        reply = `📄 **CS301 Lecture 4 Summary: Dynamic Programming & Shortest Paths**\n\n• **Core Paradigm**: Overlapping subproblems with optimal substructure; state memoization avoids exponential recursion.\n• **Bellman-Ford Invariant**: Formula $d[v] = \\min(d[v], d[u] + w(u, v))$ iterated over $|V|-1$ passes.\n• **Negative Cycle Detection**: A cycle exists if any distance shortens during the $|V|$-th pass.\n• **Exam Guidance**: Focus on Sheet 3 Questions 2 & 4 regarding DAG topological relaxation.`;
      } else if (lower.includes('deadline') || lower.includes('assignment 2') || lower.includes('assignment')) {
        reply = `⏰ **Assignment 2: Graph Optimization & Bellman-Ford**\n\n• **Course**: CS301 Analysis of Algorithms\n• **Hard Deadline**: Thursday, October 18, 2026 at 11:59 PM (3 days remaining).\n• **Deliverable**: Algorithm PDF benchmark report + GitHub repository link.\n• **Grace Period**: 12 hours with 10% penalty. Late submissions close permanently on Friday noon.`;
      } else if (lower.includes('calculate') || lower.includes('score') || lower.includes('grade') || lower.includes('a grade')) {
        reply = `🎯 **Final Exam Target Grade Calculator (CS301 Algorithms)**\n\n• **Midterm Score (20%)**: 18.5 / 20 (92.5%)\n• **Quizzes & Lab Practical (30%)**: 28.0 / 30 (93.3%)\n• **Accumulated Coursework**: **46.5 / 50 points**\n\n--- \n• **Target A Grade (≥ 85% total)**: You only need **38.5 / 50 (77.0%)** on the Final Exam!\n• **Target A+ Grade (≥ 90% total)**: You need **43.5 / 50 (87.0%)** on the Final Exam.\n\n*Your current academic trajectory is Excellent.*`;
      } else {
        reply = `🤖 **FCAI AI Copilot Response:**\n\nRegarding "${promptText}":\n\nAll official records and schedules for ${role === 'doctor' ? 'faculty course offerings' : 'your enrolled cohort'} are synchronized with the FCAI BSU portal database. Let me know if you need specific course slides, attendance status check, or exam timetable details.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <>
      {/* 1. Floating Launcher Button */}
      <div className="fixed z-40 bottom-20 md:bottom-6 right-4 md:right-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle FCAI AI Study Copilot"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#052659] text-white border border-[#00e5ff]/50 shadow-[0_4px_24px_rgba(0,229,255,0.25)] hover:shadow-[0_4px_30px_rgba(0,229,255,0.45)] hover:border-[#00e5ff] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Subtle Neural Radar Pulse Ring */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00e5ff]" />
          </span>

          <Icon name="sparkles" size="sm" className="text-[#00e5ff] group-hover:rotate-12 transition-transform" />

          <span className="text-xs font-bold tracking-wide select-none text-white font-mono">
            FCAI AI Copilot
          </span>
        </button>
      </div>

      {/* 2. Slide-out Flyout Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
            {/* Backdrop click outside on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto md:hidden"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="pointer-events-auto relative w-full sm:w-[440px] h-full sm:h-[calc(100vh-2rem)] sm:my-4 sm:mr-4 bg-[#020b17] border border-cyan-500/30 sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-slate-100"
            >
              {/* Flyout Header */}
              <div className="p-4 bg-[#052659] border-b border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00e5ff]/20 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff]">
                    <Icon name="sparkles" size="md" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-wide">FCAI AI Study Copilot</h3>
                      <span className="text-[10px] bg-cyan-950 text-[#00e5ff] border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                        v2.4
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                      <span>Neural Core Online · GPT-4o Campus</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Copilot"
                >
                  <Icon name="xCircle" size="sm" />
                </button>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs scrollbar-thin">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#00e5ff] text-[#020b17] font-medium shadow-md'
                          : 'bg-[#0a1a33] text-slate-200 border border-cyan-500/20 shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line select-text">{msg.text}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-cyan-400 text-xs py-1 px-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-300 ml-1">Copilot is researching...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Drawer */}
              <div className="p-3 bg-[#031329] border-t border-cyan-500/20">
                <div className="text-[11px] font-semibold text-cyan-300 mb-2 flex items-center gap-1.5">
                  <Icon name="zap" size="sm" className="text-[#00e5ff]" />
                  <span>Instant Academic Triggers</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(prompt)}
                      className="w-full text-left text-[11px] px-2.5 py-2 rounded-lg bg-[#071d3d] hover:bg-[#0c2b59] text-cyan-100 hover:text-white border border-cyan-500/20 hover:border-[#00e5ff]/60 transition-all flex items-center justify-between group active:scale-[0.99]"
                    >
                      <span className="truncate pr-2">{prompt}</span>
                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform font-mono">
                        &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Box */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendPrompt(input);
                }}
                className="p-3 bg-[#020b17] border-t border-cyan-500/20 flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask your FCAI copilot anything..."
                  className="flex-1 bg-[#071d3d] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00e5ff]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-3.5 py-2 bg-[#00e5ff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#38bdf8] text-[#020b17] font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>Send</span>
                  <Icon name="arrowRight" size="sm" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
