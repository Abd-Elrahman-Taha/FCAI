import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorLecturesMaterials: React.FC = () => {
  const { showToast } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(4);
  const [visibility, setVisibility] = useState('Published');

  const [lectures, setLectures] = useState([
    { id: 'l1', order: 1, title: 'Lecture 1: Asymptotic Complexity & Recurrences', file: 'CS301_Lec01.pdf', date: 'Oct 01, 2026', visibility: 'Published' },
    { id: 'l2', order: 2, title: 'Lecture 2: Divide and Conquer Algorithms', file: 'CS301_Lec02.pdf', date: 'Oct 08, 2026', visibility: 'Published' },
    { id: 'l3', order: 3, title: 'Lecture 3: Dynamic Programming Fundamentals', file: 'CS301_Lec03.pdf', date: 'Oct 12, 2026', visibility: 'Published' }
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newLec = {
      id: `l_${Date.now()}`,
      order,
      title,
      file: `CS301_Lec0${order}.pdf`,
      date: 'Today, 10:00 AM',
      visibility
    };
    setLectures(prev => [...prev, newLec]);
    showToast(`Lecture "${title}" published to student portal!`, 'success');
    setShowUpload(false);
    setTitle('');
  };

  const handleDelete = (id: string) => {
    setLectures(prev => prev.filter(l => l.id !== id));
    showToast('Lecture material deleted.', 'warning');
  };

  return (
    <div>
      <PageHead
        title="Screen 46: Lectures &amp; Teaching Materials"
        subtitle="Upload slide decks, manage lecture release order, and set student visibility status"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Lectures & Materials' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <Icon name="upload" /> Upload New Lecture
          </button>
        }
      />

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Lecture / Topic Title</th>
                <th>File Name</th>
                <th>Upload Date</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map(l => (
                <tr key={l.id}>
                  <td><span className="badge badge-primary">#{l.order}</span></td>
                  <td className="bold">{l.title}</td>
                  <td><code>{l.file}</code></td>
                  <td className="sub text-xs">{l.date}</td>
                  <td>
                    <span className={`badge ${l.visibility === 'Published' ? 'badge-success' : 'badge-neutral'}`}>
                      {l.visibility}
                    </span>
                  </td>
                  <td>
                    <div className="row gap-1">
                      <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Editing ${l.title}`, 'info')}>
                        <Icon name="edit" /> Edit
                      </button>
                      <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(l.id)}>
                        <Icon name="xCircle" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showUpload && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>Upload Lecture Deck</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowUpload(false)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4">
              <div className="form-group mb-3">
                <label className="form-label">Lecture Topic / Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Lecture 4: Matrix Chain Multiplication"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2 mb-3">
                <div className="form-group">
                  <label className="form-label">Sequence Order</label>
                  <input
                    type="number"
                    className="input"
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Visibility Status</label>
                  <select className="select" value={visibility} onChange={e => setVisibility(e.target.value)}>
                    <option value="Published">Published to Students</option>
                    <option value="Draft">Hidden / Draft</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Slide Deck PDF (&lt; 50 MB)</label>
                <div className="file-drop-area p-5 text-center border-dashed">
                  <Icon name="upload" className="mx-auto mb-1" />
                  <div className="bold text-xs">Click or drag PDF presentation here</div>
                </div>
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload &amp; Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
