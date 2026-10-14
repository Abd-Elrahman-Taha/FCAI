import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const MessagesList: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getConversations().then(res => {
      setConversations(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={3} />;

  return (
    <div>
      <PageHead
        title="Screen 37: Institutional Messages &amp; Discussions"
        subtitle="Direct academic messaging with course instructors, teaching assistants, and student affairs"
        breadcrumbs={[
          { label: 'Messages' }
        ]}
      />

      <div className="card" style={{ maxWidth: '780px' }}>
        <div className="card-head">
          <h3>Active Conversations</h3>
          <span className="badge badge-primary">{conversations.length} Threads</span>
        </div>
        <div className="stack gap-0">
          {conversations.map(c => (
            <a
              key={c.id}
              href={`#/conversation/${c.id}`}
              className="p-4 border-b hover block"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: c.unread ? 'var(--color-bg-subtle)' : '#fff'
              }}
            >
              <div className="row-between mb-1">
                <div className="row gap-2">
                  <div className="avatar sm">{c.name.charAt(0)}</div>
                  <div>
                    <strong className="text-sm block">{c.name}</strong>
                    <span className="sub text-xs">{c.role}</span>
                  </div>
                </div>
                <div className="row gap-2">
                  <span className="sub text-xs">{c.time}</span>
                  {c.unread && <span className="badge badge-primary">Unread</span>}
                </div>
              </div>
              <p className="sub text-xs truncate mt-2" style={{ paddingLeft: '38px' }}>
                {c.lastMessage}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
