import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorAnnouncements: React.FC = () => {
  const { showToast } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [composeModalOpen, setComposeModalOpen] = useState(false);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [targetCourse, setTargetCourse] = useState('CS301');
  const [targetAudience, setTargetAudience] = useState('All Enrolled Students');
  const [message, setMessage] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fakeApi.getInstructorAnnouncements().then(res => {
      setAnnouncements(res);
      setLoading(false);
    });
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please provide both title and announcement body.', 'warning');
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 350));
    const newItem = {
      id: `an_${Date.now()}`,
      course: `${targetCourse} · Algorithms`,
      title,
      text: message,
      date: 'Just now',
      audience: targetAudience,
      views: 1
    };
    setAnnouncements(prev => [newItem, ...prev]);
    setSubmitting(false);
    setComposeModalOpen(false);
    setTitle('');
    setMessage('');
    showToast('Course announcement published and broadcast to students.', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this announcement?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      showToast('Announcement removed.', 'info');
    }
  };

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 65: Course Announcements & Broadcasts"
        subtitle="Publish notices, exam updates, and urgent alerts directly to enrolled student portals"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Offerings', href: '#/doctor/offerings' },
          { label: 'Screen 65: Announcements' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => setComposeModalOpen(true)}>
            <Icon name="plus" /> Post New Announcement
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-3 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Active Announcements</div>
          <div className="h3 bold text-primary mt-1">{announcements.length}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Total Student Reach</div>
          <div className="h3 bold text-success mt-1">126 <span className="text-xs sub">students</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Average Read Rate</div>
          <div className="h3 bold text-info mt-1">94.8%</div>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="stack gap-3">
        {announcements.map(an => (
          <div key={an.id} className="card p-4">
            <div className="row-between wrap gap-2 mb-2">
              <div className="row gap-2">
                <span className="badge badge-primary">{an.course}</span>
                <span className="badge badge-neutral">{an.date}</span>
                <span className="badge badge-ice">Target: {an.audience || 'All Enrolled'}</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDelete(an.id)}
                title="Delete announcement"
              >
                <Icon name="trash" /> Delete
              </button>
            </div>
            <h3 className="mb-2">{an.title}</h3>
            <p className="text-sm sub leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {an.text}
            </p>
            <div className="row-between text-xs sub mt-4 pt-3 border-t">
              <span className="row gap-1">
                <Icon name="checkCircle" size="sm" /> Delivered via Portal App &amp; Notifications
              </span>
              <span>{an.views || 64} Students Acknowledged</span>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Announcement Modal */}
      {composeModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '580px' }}>
            <div className="modal-head">
              <h3>Post Course Announcement</h3>
              <button className="btn-close" onClick={() => setComposeModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Target Course Offering</label>
                <select
                  className="input"
                  value={targetCourse}
                  onChange={e => setTargetCourse(e.target.value)}
                >
                  <option value="CS301">CS301 · Design &amp; Analysis of Algorithms</option>
                  <option value="AI302">AI302 · Machine Learning Fundamentals</option>
                  <option value="CS305">CS305 · Operating Systems Internals</option>
                  <option value="ALL">All Assigned Course Offerings</option>
                </select>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Target Audience</label>
                <select
                  className="input"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                >
                  <option value="All Enrolled Students">All Enrolled Students (Lecture + All Labs)</option>
                  <option value="Section S1 Only">Section S1 Only</option>
                  <option value="Section S2 Only">Section S2 Only</option>
                  <option value="Section S3 Only">Section S3 Only</option>
                  <option value="Teaching Assistants Only">Teaching Assistants &amp; Lab Instructors Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Announcement Subject / Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Midterm Assessment Venue & Instructions"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Message Body</label>
                <textarea
                  className="input"
                  rows={5}
                  placeholder="Write clear instructions for students..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
                <label className="row gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={sendNotification}
                    onChange={e => setSendNotification(e.target.checked)}
                  />
                  <span>Send urgent mobile push notification and in-app bell notification to students</span>
                </label>
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setComposeModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Icon name="send" /> {submitting ? 'Publishing...' : 'Broadcast Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
