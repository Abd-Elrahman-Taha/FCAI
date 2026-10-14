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
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

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

  const filtered = notifications
    .filter(n => filter === 'All' || n.unread)
    .filter(n => categoryFilter === 'ALL' || n.category === categoryFilter);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'grades':
        return <span className="badge b-success no-dot"><Icon name="award" size="sm" /> Grades</span>;
      case 'exams':
        return <span className="badge b-warning no-dot"><Icon name="calendar" size="sm" /> Exams</span>;
      case 'fees':
        return <span className="badge b-danger no-dot"><Icon name="creditCard" size="sm" /> Fees</span>;
      case 'academic':
        return <span className="badge b-info no-dot"><Icon name="book" size="sm" /> Academic</span>;
      default:
        return <span className="badge b-navy no-dot"><Icon name="bell" size="sm" /> General</span>;
    }
  };

  return (
    <div>
      <PageHead
        title="Faculty Notification Center"
        desc="Official institutional announcements, academic deadlines, grade publications, and campus alerts."
        crumbs={[['Portal Dashboard', '#/student/dashboard'], ['Notifications']]}
        actions={
          unreadCount > 0 ? (
            <button className="btn btn-secondary btn-sm" onClick={handleMarkAll}>
              <Icon name="checkCircle" size="sm" /> Mark All as Read ({unreadCount})
            </button>
          ) : undefined
        }
      />

      {/* Filter Tabs & Category Bar */}
      <div className="card mb-5 p-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-2">
            <button
              className={`btn btn-sm ${filter === 'All' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('All')}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'Unread' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('Unread')}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="row gap-2 wrap align-center">
            <span className="text-xs muted">Category:</span>
            {['ALL', 'grades', 'exams', 'fees', 'academic'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ fontSize: '11px', height: '28px', padding: '0 10px', textTransform: 'capitalize' }}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat === 'ALL' ? 'All Types' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Stack */}
      <div className="col gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12" style={{ background: 'var(--surface)' }}>
            <div className="state-art success mx-auto mb-3">
              <Icon name="checkCircle" size="xl" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 750 }}>All Caught Up!</h3>
            <p className="text-xs muted mt-1">There are no {filter === 'Unread' ? 'unread' : ''} notifications in this category.</p>
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`card notif-card ${n.unread ? 'unread' : 'read'}`}
              style={{
                padding: '18px 20px',
                borderLeft: n.unread ? '4px solid var(--blue-500)' : '4px solid var(--border)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div className="row-between mb-2">
                <div className="row gap-2 align-center">
                  {getCategoryBadge(n.category)}
                  <b style={{ fontSize: '14.5px', color: 'var(--text)' }}>{n.title}</b>
                  {n.unread && (
                    <span className="badge b-info no-dot" style={{ fontSize: '10px', height: '18px', padding: '0 6px' }}>
                      New
                    </span>
                  )}
                </div>
                <span className="text-xs muted row gap-1 align-center">
                  <Icon name="clock" size="sm" />
                  {n.time || n.date}
                </span>
              </div>

              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>
                {n.message}
              </p>

              <div className="row-between pt-2.5 mt-2 border-t text-xs align-center">
                {n.link ? (
                  <a href={n.link} className="row gap-1 align-center fw-6 text-blue">
                    View Associated Record <Icon name="arrowRight" size="sm" />
                  </a>
                ) : <span />}

                {n.unread && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '11px', height: '26px', padding: '0 8px' }}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <Icon name="checkCircle" size="sm" /> Mark as read
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
