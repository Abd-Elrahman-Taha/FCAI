import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminAcademicYears: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newModalOpen, setNewModalOpen] = useState(false);

  // Form state
  const [semName, setSemName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fakeApi.getAdminAcademicStructure().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const handleCreateSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semName || !startDate || !endDate) {
      showToast('Please fill all semester dates.', 'warning');
      return;
    }
    const newSem = {
      name: semName,
      startDate,
      endDate,
      status: 'Upcoming'
    };
    setData((prev: any) => ({
      ...prev,
      semesters: [...prev.semesters, newSem]
    }));
    setNewModalOpen(false);
    setSemName('');
    showToast('New academic semester added to calendar.', 'success');
  };

  if (loading || !data) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 86: Academic Years & Semesters Management"
        subtitle="Configure university academic calendars, semester activation states, and credit load operational horizons"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 86: Academic Years' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/levels" className="btn btn-secondary">
              <Icon name="layers" /> Academic Levels (Screen 87)
            </a>
            <button className="btn btn-primary" onClick={() => setNewModalOpen(true)}>
              <Icon name="plus" /> Add Semester Term
            </button>
          </div>
        }
      />

      {/* Current Academic Term Banner */}
      <div className="hero mb-4">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="calendar" size="sm" /> Current Institutional Term
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 750 }}>
              Academic Year {data.currentYear} · {data.currentSemester}
            </h1>
            <p className="sub mt-1" style={{ fontSize: '13px' }}>
              Statutory credit-hour regulations active. Course registration and attendance monitoring active.
            </p>
          </div>
          <div className="row gap-2 mt-2">
            <button className="btn btn-ice" onClick={() => showToast('Calendar synchronization verified.', 'info')}>
              <Icon name="checkCircle" /> Term Status: Active
            </button>
          </div>
        </div>
      </div>

      {/* Semesters Table */}
      <div className="card overflow-hidden mb-4">
        <div className="card-head">
          <h3>Registered Academic Semesters</h3>
          <span className="badge badge-neutral">{data.semesters.length} Semesters</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Semester Term</th>
                <th>Instruction Start Date</th>
                <th>Final Exams / Term End</th>
                <th className="text-center">Lifecycle Status</th>
                <th style={{ width: '160px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.semesters.map((s: any, idx: number) => (
                <tr key={idx}>
                  <td>
                    <div className="bold">{s.name}</div>
                    <span className="text-xs sub">Credit-Hour Track</span>
                  </td>
                  <td>
                    <span className="text-sm bold">{s.startDate}</span>
                  </td>
                  <td>
                    <span className="text-sm bold">{s.endDate}</span>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${s.status.includes('Active') ? 'badge-success' : s.status === 'Upcoming' ? 'badge-primary' : 'badge-neutral'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Opening schedule dates for ${s.name}`, 'info')}
                      >
                        <Icon name="calendar" size="sm" />
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        onClick={() => showToast(`Edit dates modal for ${s.name}`, 'info')}
                      >
                        <Icon name="edit" size="sm" /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Semester Modal */}
      {newModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-head">
              <h3>Add Academic Semester</h3>
              <button className="btn-close" onClick={() => setNewModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateSemester} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Semester Term Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Summer 2027 Intensive"
                  value={semName}
                  onChange={e => setSemName(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Start Date</label>
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">End Date</label>
                  <input
                    type="date"
                    className="input"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setNewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Register Semester
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
