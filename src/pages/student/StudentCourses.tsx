import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { Modal } from '../../components/common/Modal';
import type { Course } from '../../types';

export const StudentCourses: React.FC = () => {
  const { showToast } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDrop, setCourseToDrop] = useState<Course | null>(null);
  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    fakeApi.getMyCourses().then(res => {
      setCourses(res);
      setLoading(false);
    });
  }, []);

  const handleDropConfirm = async () => {
    if (!courseToDrop) return;
    setIsDropping(true);
    try {
      const res = await fakeApi.dropCourse(courseToDrop.id);
      if (res.success) {
        setCourses(prev => prev.filter(c => c.id !== courseToDrop.id));
        showToast('Course Dropped', res.message, 'success');
        setCourseToDrop(null);
      }
    } catch (err: any) {
      showToast('Error', 'Could not drop course.', 'error');
    } finally {
      setIsDropping(false);
    }
  };

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHead
        title="My Courses"
        desc="All courses registered in the active Fall 2026 academic semester."
        crumbs={[['Student Portal', '#/student/dashboard'], ['My Courses']]}
        actions={
          <a href="#/student/registration" className="btn btn-primary">
            <Icon name="plusSquare" /> Register More Courses
          </a>
        }
      />

      {/* Toolbar: Search & Info */}
      <div className="toolbar row-between mb-4">
        <label className="search" style={{ maxWidth: '380px' }}>
          <span><Icon name="search" size="sm" /></span>
          <input
            placeholder="Search by course code, title, or doctor…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
        <div className="row gap-3">
          <span className="text-xs muted">
            Registered: <b>{courses.length} Courses</b> ({courses.reduce((sum, c) => sum + c.creditHours, 0)} Credit Hours)
          </span>
          <span className="badge b-info no-dot">Fall 2026 Term</span>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid g-3">
        {filtered.map(course => (
          <div key={course.id} className="card hover col" style={{ justifyContent: 'space-between' }}>
            <div className="card-pad" style={{ paddingBottom: '12px' }}>
              <div className="row-between mb-3">
                <span className="badge b-navy no-dot">{course.code}</span>
                <span className="badge b-info">{course.creditHours} CH</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{course.name}</h3>
              <p className="text-xs muted mt-2">
                <Icon name="briefcase" size="sm" className="inline-block mr-1" /> {course.doctor}
              </p>
              {course.ta && (
                <p className="text-xs muted mt-1">
                  <Icon name="users" size="sm" className="inline-block mr-1" /> TA: {course.ta} ({course.section})
                </p>
              )}

              <div className="divider" style={{ margin: '14px 0 12px' }} />

              <div className="text-xs">
                <div className="row-between mb-2">
                  <span className="muted">Weekly Schedule:</span>
                  <span className="fw-6">{course.schedule}</span>
                </div>
                <div className="row-between mb-2">
                  <span className="muted">Room / Hall:</span>
                  <span className="mono fw-6">{course.room}</span>
                </div>
                <div className="row-between mb-1">
                  <span className="muted">Attendance Record:</span>
                  <span className={course.attendancePercent < 75 ? 'trend-down' : 'trend-up'}>
                    {course.attendancePercent}%
                  </span>
                </div>
                <div className={`progress ${course.attendancePercent < 75 ? 'danger' : 'success'} thin`}>
                  <span style={{ width: `${course.attendancePercent}%` }} />
                </div>
              </div>
            </div>

            <div className="card-foot">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedCourse(course)}
              >
                View Details
              </button>
              <button
                type="button"
                className="btn btn-danger-soft btn-sm"
                onClick={() => setCourseToDrop(course)}
              >
                Drop Course
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`${selectedCourse.code} · ${selectedCourse.name}`}
          subtitle={`${selectedCourse.creditHours} Credit Hours • Department of ${selectedCourse.department}`}
          iconName="book"
          tone="info"
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setSelectedCourse(null)}>
              Close
            </button>
          }
        >
          <div className="col gap-4 text-sm">
            <div className="info-tile">
              <small>Faculty Instruction Team</small>
              <b>Instructor: {selectedCourse.doctor}</b>
              <div className="muted mt-1">Teaching Assistant: {selectedCourse.ta} ({selectedCourse.section})</div>
            </div>

            <div className="kv">
              <dt>Assigned Hall:</dt>
              <dd className="mono">{selectedCourse.room}</dd>
              <dt>Timetable:</dt>
              <dd>{selectedCourse.schedule}</dd>
              <dt>Attendance:</dt>
              <dd>{selectedCourse.attendancePercent}% (Minimum required: 75%)</dd>
              <dt>Published Grade:</dt>
              <dd>{selectedCourse.publishedGrade || 'Under examination (Not yet published)'}</dd>
              <dt>Prerequisites:</dt>
              <dd>{selectedCourse.prerequisites?.join(', ') || 'None'}</dd>
            </div>
          </div>
        </Modal>
      )}

      {/* Drop Course Modal */}
      {courseToDrop && (
        <Modal
          isOpen={!!courseToDrop}
          onClose={() => setCourseToDrop(null)}
          title={`Drop Course: ${courseToDrop.code}?`}
          subtitle="Official semester drop confirmation"
          iconName="alertCircle"
          tone="danger"
          footer={
            <div className="row gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setCourseToDrop(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDropConfirm}
                disabled={isDropping}
              >
                {isDropping ? 'Processing…' : 'Confirm Drop Course'}
              </button>
            </div>
          }
        >
          <div className="col gap-3">
            <div className="alert alert-warning">
              <Icon name="alert" />
              <div>
                <b>Allowed Drop Window Active</b>
                <p>The course drop deadline for Fall 2026 is October 17, 2026. Dropping this course will relinquish your reserved seat in Hall {courseToDrop.room}.</p>
              </div>
            </div>
            <p className="text-sm muted">
              Are you sure you want to drop <b>{courseToDrop.name} ({courseToDrop.creditHours} CH)</b>? Your semester registered hours will be adjusted accordingly.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
