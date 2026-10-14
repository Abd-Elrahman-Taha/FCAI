import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentStudyAssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fakeApi.getPdfChat('doc-algo-ch4').then(msgs => {
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  const handleAsk = async (textToAsk: string) => {
    if (!textToAsk.trim()) return;
    setAsking(true);
    const userMsg = { id: `u_${Date.now()}`, sender: 'student', text: textToAsk, timestamp: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    const aiRes = await fakeApi.sendPdfChatMessage('doc-algo-ch4', textToAsk);
    setMessages(prev => [...prev, aiRes]);
    setAsking(false);
  };

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 41: Study Assistant RAG Context Chat"
        subtitle="Private AI Tutoring strictly grounded in uploaded PDF: Chapter 4 Dynamic Programming (34 Pages)"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Study Assistant', href: '#/student/study-assistant' },
          { label: 'RAG Chat' }
        ]}
      />

      <div className="card p-0 mb-6" style={{ maxWidth: '820px', overflow: 'hidden' }}>
        {/* Active Context Banner */}
        <div className="p-4 border-b row-between" style={{ background: 'var(--color-bg-page)' }}>
          <div className="row gap-2">
            <Icon name="file" size="sm" className="text-primary" />
            <div>
              <strong className="text-sm block">Algorithms_Chapter_04_DP.pdf</strong>
              <span className="sub text-xs">Page Count: 34 Pages · Grounding Mode: Strict PDF Citations Only</span>
            </div>
          </div>
          <span className="badge badge-success">Vectors Loaded</span>
        </div>

        {/* Quick RAG Action Chips */}
        <div className="p-3 bg-white border-b row gap-2 wrap">
          <span className="sub text-xs bold">Quick Prompts:</span>
          <button
            className="chip chip-primary"
            style={{ cursor: 'pointer' }}
            onClick={() => handleAsk('Summarize the key algorithms and recurrence relations in this document.')}
          >
            Summarize Document
          </button>
          <button
            className="chip chip-primary"
            style={{ cursor: 'pointer' }}
            onClick={() => handleAsk('What are the expected midterm questions derived from this chapter?')}
          >
            Generate Expected Exam Questions
          </button>
          <button
            className="chip chip-primary"
            style={{ cursor: 'pointer' }}
            onClick={() => handleAsk('Explain the 0/1 Knapsack memoization table recurrence.')}
          >
            Explain Knapsack Recurrence
          </button>
        </div>

        {/* Chat History Stream */}
        <div className="p-5 stack gap-4" style={{ height: '420px', overflowY: 'auto', background: 'var(--color-bg-page)' }}>
          {messages.map(m => {
            const isStudent = m.sender === 'student';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isStudent ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  className="card p-4"
                  style={{
                    maxWidth: '80%',
                    background: isStudent ? 'var(--color-primary)' : '#fff',
                    color: isStudent ? '#fff' : 'inherit',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: !isStudent ? '4px solid var(--color-primary)' : undefined
                  }}
                >
                  <div className="row-between mb-1 text-xs">
                    <strong style={{ color: isStudent ? '#C1E8FF' : 'var(--color-primary)' }}>
                      {isStudent ? 'You (Student)' : 'FCAI Study Assistant AI'}
                    </strong>
                    <span style={{ color: isStudent ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)' }}>
                      {m.timestamp}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
                  {m.citation && (
                    <div className="mt-3 pt-2 border-t">
                      <span className="badge badge-primary text-xs">
                        <Icon name="checkCircle" size="sm" /> Source Citation: {m.citation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {asking && (
            <div className="card p-3 text-xs sub text-center" style={{ maxWidth: '300px' }}>
              Synthesizing response from verified PDF pages...
            </div>
          )}
        </div>

        {/* Input Composer */}
        <form onSubmit={e => { e.preventDefault(); handleAsk(query); }} className="p-3 bg-white border-t row gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Ask anything grounded strictly in Chapter 4 PDF..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={asking}
          />
          <button type="submit" className="btn btn-primary" disabled={asking || !query.trim()}>
            <Icon name="checkCircle" /> Ask Tutor
          </button>
        </form>
      </div>
    </div>
  );
};
