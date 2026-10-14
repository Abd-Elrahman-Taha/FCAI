import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const ConversationView: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fakeApi.getMessages('c1').then(res => {
      setMessages(res);
      setLoading(false);
    });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = await fakeApi.sendMessage('c1', inputText);
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 38: Conversation · Dr. Mona Abdelrahman"
        subtitle="Associate Professor · Algorithms Course Instructor"
        breadcrumbs={[
          { label: 'Messages', href: '#/messages' },
          { label: 'Dr. Mona Abdelrahman' }
        ]}
      />

      <div className="card p-0" style={{ maxWidth: '780px', overflow: 'hidden' }}>
        {/* Chat Stream */}
        <div className="p-5 stack gap-3" style={{ height: '420px', overflowY: 'auto', background: 'var(--color-bg-page)' }}>
          {messages.map(m => {
            const isMe = m.sender === 'me';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  className="card p-3"
                  style={{
                    maxWidth: '75%',
                    background: isMe ? 'var(--color-primary)' : '#fff',
                    color: isMe ? '#fff' : 'inherit',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <div
                    className="text-right mt-1"
                    style={{ fontSize: '10px', color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)' }}
                  >
                    {m.time} {isMe && '✓✓'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t row gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Write a message to Dr. Mona Abdelrahman..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            <Icon name="checkCircle" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
