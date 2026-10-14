import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminContentManagement: React.FC = () => {
  const { showToast } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('All Faculty & Students');
  const [type, setType] = useState('Announcement');
  const [content, setContent] = useState('');

  const [articles, setArticles] = useState([
    {
      id: 'cms_01',
      title: 'Fall 2026 Course Registration Period Officially Open',
      type: 'Urgent Banner',
      audience: 'All Students',
      date: 'Oct 01, 2026',
      status: 'Live & Pinned',
      views: 1420
    },
    {
      id: 'cms_02',
      title: 'Faculty Graduation Project Exhibition & Industry Jury Call',
      type: 'News Article',
      audience: 'Level 4 Seniors & Faculty',
      date: 'Oct 10, 2026',
      status: 'Published',
      views: 890
    },
    {
      id: 'cms_03',
      title: 'Updated 75% Compulsory Attendance Statutory Warning',
      type: 'Official Directive',
      audience: 'All Students',
      date: 'Oct 12, 2026',
      status: 'Live',
      views: 1340
    }
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      showToast('Please provide both title and content body.', 'warning');
      return;
    }
    const item = {
      id: `cms_${Date.now()}`,
      title,
      type,
      audience,
      date: 'Just now',
      status: 'Published',
      views: 1
    };
    setArticles(prev => [item, ...prev]);
    setModalOpen(false);
    setTitle('');
    setContent('');
    showToast('Portal content article published successfully.', 'success');
  };

  const handleToggleStatus = (id: string) => {
    setArticles(prev =>
      prev.map(a => a.id === id ? { ...a, status: a.status.includes('Live') ? 'Archived' : 'Live' } : a)
    );
    showToast('Publication state updated.', 'info');
  };

  return (
    <div>
      <PageHead
        title="Screen 81: Faculty Portal Content & Announcements CMS"
        subtitle="Manage faculty homepage banners, institutional announcements, academic bulletins, and notifications"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 81: Content CMS' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Icon name="plus" /> Post Bulletin / Announcement
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-3 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Live Bulletins</div>
          <div className="h3 bold text-primary mt-1">{articles.filter(a => a.status.includes('Live') || a.status.includes('Published')).length}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Total Portal Views</div>
          <div className="h3 bold text-success mt-1">3,650 <span className="text-xs sub">Reads</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Target Audiences</div>
          <div className="h3 bold text-info mt-1">Students, Doctors, TAs</div>
        </div>
      </div>

      {/* Content Feed Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <h3>Published Content &amp; Directives</h3>
          <span className="badge badge-neutral">{articles.length} Bulletins</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Bulletin Title</th>
                <th>Category</th>
                <th>Target Audience</th>
                <th>Publish Date</th>
                <th className="text-center">Portal Views</th>
                <th className="text-center">Status</th>
                <th style={{ width: '150px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(art => (
                <tr key={art.id}>
                  <td>
                    <div className="bold">{art.title}</div>
                    <code className="text-xs sub">{art.id}</code>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{art.type}</span>
                  </td>
                  <td>
                    <span className="text-xs">{art.audience}</span>
                  </td>
                  <td>
                    <span className="text-xs sub">{art.date}</span>
                  </td>
                  <td className="text-center bold text-primary">
                    {art.views}
                  </td>
                  <td className="text-center">
                    <span className={`badge ${art.status.includes('Live') ? 'badge-success' : 'badge-neutral'}`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleToggleStatus(art.id)}
                      >
                        {art.status.includes('Live') ? 'Archive' : 'Publish'}
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        onClick={() => showToast(`Edit bulletin ${art.title}`, 'info')}
                      >
                        <Icon name="edit" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '580px' }}>
            <div className="modal-head">
              <h3>Create Portal Bulletin / Notice</h3>
              <button className="btn-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreate} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Headline Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Schedule of Midterm Examination Halls"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Content Category</label>
                  <select
                    className="input"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="Urgent Banner">Urgent Top Banner</option>
                    <option value="Announcement">Institutional Announcement</option>
                    <option value="News Article">Faculty News Article</option>
                    <option value="Official Directive">Official Dean Directive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">Audience Scope</label>
                  <select
                    className="input"
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                  >
                    <option value="All Faculty & Students">All Faculty &amp; Students</option>
                    <option value="All Students">All Students Only</option>
                    <option value="Doctors & TAs Only">Doctors &amp; TAs Only</option>
                    <option value="Level 4 Seniors & Faculty">Level 4 Seniors Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Body Content</label>
                <textarea
                  className="input"
                  rows={5}
                  placeholder="Provide full bulletin details, links, or instructions..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Broadcast Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
