import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { Course } from '../../types';

export const DoctorCourseOfferings: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fakeApi.getDoctorOfferings().then(res => {
      setCourses(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.code.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <PageHead
        title="My CourseOfferings"
        subtitle="Manage assigned semester offerings, enrolled students, section allocations, and gradebooks"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'CourseOfferings' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/attendance" className="btn btn-primary">
              <Icon name="qr" /> Start QR Attendance
            </a>
          </div>
        }
      />

      {/* Filter and stats banner */}
      <div className="card mb-5">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div className="chip chip-primary">
              <strong>{courses.length}</strong> Assigned Offerings
            </div>
            <div className="chip chip-success">
              <strong>180</strong> Total Students
            </div>
            <div className="chip chip-info">
              <strong>Fall 2026</strong> Active Semester
            </div>
          </div>
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <div className="input-with-icon">
              <Icon name="search" />
              <input
                type="text"
                className="input"
                placeholder="Search course name or code..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CourseOfferings Cards Grid */}
      <div className="grid g-2">
        {filtered.map(course => (
          <div key={course.code} className="card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="row-between mb-3">
                <span className="badge badge-primary">{course.code}</span>
                <span className="badge badge-neutral">{course.creditHours} Credit Hours</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{course.name}</h3>
              <p className="sub" style={{ fontSize: '13px', marginBottom: '14px' }}>
                {course.description}
              </p>

              <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)', border: '1px solid var(--color-border)' }}>
                <div className="grid g-3" style={{ fontSize: '12px' }}>
                  <div>
                    <span className="sub block">Department</span>
                    <strong>{course.department}</strong>
                  </div>
                  <div>
                    <span className="sub block">Lecture Schedule</span>
                    <strong>{course.schedule}</strong>
                  </div>
                  <div>
                    <span className="sub block">Lecture Hall</span>
                    <strong>{course.hall}</strong>
                  </div>
                </div>
              </div>

              {/* Course details sub-metrics */}
              <div className="row-between pt-2 pb-2 mb-3" style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                <span className="sub">Enrolled Students:</span>
                <span className="bold">{course.enrolledStudents || 64} / {course.capacity || 80}</span>
              </div>
              <div className="row-between pb-3 mb-4" style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                <span className="sub">Sections:</span>
                <span className="bold">3 Assigned Labs (S1, S2, S3)</span>
              </div>
            </div>

            <div className="row gap-2 mt-2 wrap">
              <a href={`#/doctor/course/${course.code}`} className="btn btn-primary btn-sm flex-1">
                <Icon name="layers" /> Manage Offering
              </a>
              <a href={`#/doctor/gradebook`} className="btn btn-secondary btn-sm">
                <Icon name="table" /> Gradebook
              </a>
              <a href={`#/doctor/attendance`} className="btn btn-ice btn-sm">
                <Icon name="qr" /> QR Session
              </a>
              <a href={`#/doctor/reports`} className="btn btn-ghost btn-sm">
                <Icon name="chart" /> Analytics
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
