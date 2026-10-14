import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentCourseDetails: React.FC = () => {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getCourseDetails('CS301').then(res => {
      setCourse(res);
      setLoading(false);
    });
  }, []);

  if (loading || !course) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title={`Screen 14: Course Details · ${course.code}`}
        subtitle={`${course.name} · ${course.department} Department · Fall 2026 Offering`}
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Course Catalog', href: '#/student/registration' },
          { label: course.code }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/student/registration/confirm" className="btn btn-primary">
              <Icon name="checkCircle" /> Register in Course
            </a>
          </div>
        }
      />

      <div className="grid g-3 mb-6">
        <div className="col-span-2">
          {/* Main Description */}
          <div className="card p-5 mb-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Course Overview</h3>
            <p className="sub leading-relaxed mb-4">{course.description}</p>
            <div className="grid g-3 p-4 bg-gray-50 rounded" style={{ background: 'var(--color-bg-page)' }}>
              <div>
                <span className="sub block text-xs">Credit Hours</span>
                <strong>{course.creditHours} Credits</strong>
              </div>
              <div>
                <span className="sub block text-xs">Instructor</span>
                <strong>{course.doctor}</strong>
              </div>
              <div>
                <span className="sub block text-xs">Prerequisite</span>
                <strong>CS204 (Data Structures)</strong>
              </div>
              <div>
                <span className="sub block text-xs">Lecture Slot</span>
                <strong>{course.schedule} ({course.hall})</strong>
              </div>
            </div>
          </div>

          {/* Syllabus Roadmap */}
          <div className="card p-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Course Syllabus &amp; Modules</h3>
            <div className="stack gap-2">
              {course.syllabus.map((s: any, idx: number) => (
                <div key={idx} className="card p-3 row-between" style={{ background: 'var(--color-bg-page)' }}>
                  <span className="badge badge-primary">{s.week}</span>
                  <span className="bold text-sm flex-1 ml-3">{s.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Assigned Practical Sections */}
          <div className="card p-5 mb-5">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Available Practical Sections</h4>
            <div className="stack gap-3">
              {course.sections.map((sec: any) => (
                <div key={sec.name} className="card p-3 border">
                  <div className="row-between mb-1">
                    <span className="bold text-sm">{sec.name}</span>
                    <span className="badge badge-success">{sec.seats}</span>
                  </div>
                  <div className="sub text-xs">TA: <strong>{sec.ta}</strong></div>
                  <div className="sub text-xs">{sec.time} · {sec.room}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Eligibility Box */}
          <div className="card p-5" style={{ background: '#ecfdf5', border: '1px solid #10b981' }}>
            <div className="row gap-2 mb-2">
              <Icon name="checkCircle" style={{ color: 'var(--color-success)' }} />
              <strong style={{ color: '#065f46' }}>You Are Eligible to Register</strong>
            </div>
            <p className="sub text-xs leading-relaxed" style={{ color: '#047857' }}>
              Your academic standing and prerequisite credits in CS204 qualify you to enroll in CS301 for this semester.
            </p>
            <a href="#/student/registration/confirm" className="btn btn-success btn-sm w-full mt-3">
              Proceed to Registration
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
