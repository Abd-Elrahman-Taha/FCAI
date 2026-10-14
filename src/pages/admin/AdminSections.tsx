import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminSections: React.FC = () => {
  const { showToast } = useAuth();
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [courseCode, setCourseCode] = useState('CS301');
  const [sectionName, setSectionName] = useState('');
  const [taName, setTaName] = useState('Eng. Youssef Khaled');
  const [room, setRoom] = useState('Lab 3-West');
  const [time, setTime] = useState('Tue 12:00 – 14:00');
  const [capacity, setCapacity] = useState(25);

  const [sections, setSections] = useState([
    { id: 'sec_1', course: 'CS301 · Algorithms', name: 'Section S1', ta: 'Eng. Youssef Khaled', room: 'Lab 3-West', time: 'Sun 12:00 – 14:00', enrolled: 22, capacity: 25, status: 'Active' },
    { id: 'sec_2', course: 'CS301 · Algorithms', name: 'Section S2', ta: 'Eng. Nour Hesham', room: 'Lab 2-East', time: 'Mon 10:00 – 12:00', enrolled: 21, capacity: 25, status: 'Active' },
    { id: 'sec_3', course: 'CS301 · Algorithms', name: 'Section S3', ta: 'Eng. Youssef Khaled', room: 'Lab 3-West', time: 'Tue 12:00 – 14:00', enrolled: 21, capacity: 25, status: 'Active' },
    { id: 'sec_4', course: 'AI302 · Machine Learning', name: 'Section S1', ta: 'Eng. Nour Hesham', room: 'Lab 2-East', time: 'Wed 11:00 – 13:00', enrolled: 22, capacity: 25, status: 'Active' },
    { id: 'sec_5', course: 'AI302 · Machine Learning', name: 'Section S2', ta: 'Eng. Youssef Khaled', room: 'Lab 2-East', time: 'Mon 12:00 – 14:00', enrolled: 20, capacity: 25, status: 'Active' },
    { id: 'sec_6', course: 'IS305 · Database Systems II', name: 'Section S1', ta: 'Eng. Omar Tamer', room: 'Lab 1-South', time: 'Thu 09:00 – 11:00', enrolled: 24, capacity: 25, status: 'Active' }
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName) {
      showToast('Please enter section name.', 'warning');
      return;
    }
    const newSec = {
      id: `sec_${Date.now()}`,
      course: `${courseCode} · Algorithms`,
      name: sectionName,
      ta: taName,
      room,
      time,
      enrolled: 0,
      capacity,
      status: 'Active'
    };
    setSections(prev => [newSec, ...prev]);
    setModalOpen(false);
    setSectionName('');
    showToast('Practical lab section registered.', 'success');
  };

  const filtered = sections.filter(s =>
    courseFilter === 'ALL' || s.course.includes(courseFilter)
  );

  return (
    <div>
      <PageHead
        title="Screen 90: Practical Lab Sections & Class Groups Management"
        subtitle="Configure tutorial and laboratory section cohorts, assign lab rooms, and set capacity thresholds"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Course Offerings', href: '#/admin/course-offerings' },
          { label: 'Screen 90: Lab Sections' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported lab sections list to Excel.', 'info')}>
              <Icon name="download" /> Export Sections
            </button>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Icon name="plus" /> Add Lab Section
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Total Active Lab Sections</div>
          <div className="h3 bold text-primary mt-1">{sections.length} <span className="text-xs sub">Groups</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Total Enrolled Lab Students</div>
          <div className="h3 bold text-success mt-1">{sections.reduce((acc, s) => acc + s.enrolled, 0)} <span className="text-xs sub">Seats</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Average Section Capacity</div>
          <div className="h3 bold text-info mt-1">25 <span className="text-xs sub">Max Seats/Lab</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Allocated Hardware Labs</div>
          <div className="h3 bold text-neutral mt-1">3 <span className="text-xs sub">Labs East/West/South</span></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-3 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div>
              <label className="text-xs bold sub block mb-1">Filter Course</label>
              <select
                className="input"
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
              >
                <option value="ALL">All Course Offerings</option>
                <option value="CS301">CS301 · Algorithms</option>
                <option value="AI302">AI302 · Machine Learning</option>
                <option value="IS305">IS305 · Database Systems II</option>
              </select>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Showing <strong>{filtered.length}</strong> Practical Lab Sections
          </div>
        </div>
      </div>

      {/* Sections Table */}
      <div className="card overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Section Name</th>
                <th>Course Offering</th>
                <th>Assigned Teaching Assistant</th>
                <th>Lab Room</th>
                <th>Scheduled Time</th>
                <th className="text-center">Enrolled / Cap</th>
                <th className="text-center">Status</th>
                <th style={{ width: '150px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sec => (
                <tr key={sec.id}>
                  <td>
                    <div className="bold">{sec.name}</div>
                    <code className="text-xs sub">{sec.id}</code>
                  </td>
                  <td>
                    <span className="badge badge-primary">{sec.course}</span>
                  </td>
                  <td>
                    <div className="bold text-sm">{sec.ta}</div>
                  </td>
                  <td>
                    <span className="badge badge-ice">{sec.room}</span>
                  </td>
                  <td>
                    <span className="text-xs sub">{sec.time}</span>
                  </td>
                  <td className="text-center">
                    <span className="bold">{sec.enrolled}</span> / {sec.capacity}
                    <div className="text-xs sub">({sec.capacity - sec.enrolled} open)</div>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success">{sec.status}</span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Edit section ${sec.name}`, 'info')}
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

      {/* Add Section Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>Create Practical Lab Section</h3>
              <button className="btn-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreate} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Target Course Offering</label>
                <select
                  className="input"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                >
                  <option value="CS301">CS301 · Algorithms</option>
                  <option value="AI302">AI302 · Machine Learning</option>
                  <option value="IS305">IS305 · Database Systems II</option>
                </select>
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Section Identifier</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Section S4"
                    value={sectionName}
                    onChange={e => setSectionName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">Lab Room</label>
                  <select
                    className="input"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                  >
                    <option value="Lab 3-West">Lab 3-West (25 PCs)</option>
                    <option value="Lab 2-East">Lab 2-East (25 PCs)</option>
                    <option value="Lab 1-South">Lab 1-South (30 PCs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Assigned Teaching Assistant</label>
                <select
                  className="input"
                  value={taName}
                  onChange={e => setTaName(e.target.value)}
                >
                  <option value="Eng. Youssef Khaled">Eng. Youssef Khaled (Lead TA)</option>
                  <option value="Eng. Nour Hesham">Eng. Nour Hesham (TA)</option>
                  <option value="Eng. Omar Tamer">Eng. Omar Tamer (TA)</option>
                </select>
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    className="input"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">Max Capacity</label>
                  <input
                    type="number"
                    className="input"
                    value={capacity}
                    onChange={e => setCapacity(parseInt(e.target.value) || 25)}
                    required
                  />
                </div>
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Register Lab Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
