import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import type { NotificationItem } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { showToast, setUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  useEffect(() => {
    fakeApi.getNotifications().then(res => {
      setNotifications(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const handleMarkRead = async (id: string) => {
    await fakeApi.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    showToast('Notification marked as read', 'info');
  };

  const handleMarkAll = async () => {
    await fakeApi.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
    showToast('All notifications marked as read', 'success');
  };

  const filtered = notifications.filter(n => filter === 'All' || n.unread);

  return (
    <div>
      <PageHead
        title="Faculty Notification Center"
        subtitle="Institutional announcements, academic deadlines, grade publications, and system alerts"
        breadcrumbs={[
          { label: 'Notifications' }
        ]}
        actions={
          <button className="btn btn-secondary" onClick={handleMarkAll}>
            <Icon name="checkCircle" /> Mark All as Read
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <button
              className={`btn btn-sm ${filter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('All')}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'Unread' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('Unread')}
            >
              Unread ({notifications.filter(n => n.unread).length})
            </button>
          </div>
          <div className="chip chip-info">Real-time alerts</div>
        </div>
      </div>

      {/* Notifications Stack */}
      <div className="stack gap-3">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center sub">
            <Icon name="checkCircle" size="lg" style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
            <div>You are all caught up! No unread notifications.</div>
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className="card p-4"
              style={{
                borderLeft: n.unread ? '4px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: n.unread ? 'var(--color-bg-subtle)' : '#fff'
              }}
            >
              <div className="row-between mb-2">
                <div className="row gap-2">
                  <span className={`badge ${
                    n.category === 'grades' ? 'badge-success' :
                    n.category === 'exams' ? 'badge-warning' :
                    n.category === 'fees' ? 'badge-danger' : 'badge-primary'
                  }`}>
                    {(n.category ?? 'General').toUpperCase()}
                  </span>
                  <strong style={{ fontSize: '15px' }}>{n.title}</strong>
                </div>
                <span className="text-xs sub">{n.time || n.date}</span>
              </div>
              <p className="sub text-xs leading-relaxed mb-3">{n.message}</p>
              <div className="row-between pt-2 border-t text-xs">
                {n.link ? (
                  <a href={n.link} className="bold text-primary">
                    View Associated Record &rarr;
                  </a>
                ) : <span />}
                {n.unread && (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleMarkRead(n.id)}>
                    <Icon name="checkCircle" size="sm" /> Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
