import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorGradebook: React.FC = () => {
  const { showToast } = useAuth();
  const [gradebook, setGradebook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [packageStatus, setPackageStatus] = useState<string>('Draft');
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fakeApi.getDoctorGradebook('CS301').then(res => {
      setGradebook(res);
      setStudents(res.students);
      setLoading(false);
    });
  }, []);

  if (loading || !gradebook) return <CardSkeleton count={5} />;

  const calcLetter = (total: number) => {
    if (total >= 95) return 'A+';
    if (total >= 90) return 'A';
    if (total >= 85) return 'B+';
    if (total >= 80) return 'B';
    if (total >= 75) return 'C+';
    if (total >= 70) return 'C';
    if (total >= 65) return 'D+';
    if (total >= 60) return 'D';
    return 'F';
  };

  const handleCellChange = (code: string, field: 'midterm' | 'practical' | 'coursework' | 'final', value: number) => {
    if (packageStatus !== 'Draft') {
      showToast('Gradebook is submitted or locked and cannot be edited in this state.', 'warning');
      return;
    }

    const limits = { midterm: 20, practical: 20, coursework: 15, final: 45 };
    if (value > limits[field]) {
      showToast(`Maximum marks for ${field} is ${limits[field]}!`, 'error');
      return;
    }

    setStudents(prev =>
      prev.map(std => {
        if (std.code === code) {
          const updated = { ...std, [field]: value };
          const newTotal = (updated.midterm || 0) + (updated.practical || 0) + (updated.coursework || 0) + (updated.final || 0);
          return {
            ...updated,
            total: newTotal,
            letter: calcLetter(newTotal)
          };
        }
        return std;
      })
    );
  };

  const handleSubmitPackage = async () => {
    if (!window.confirm('Are you sure you want to submit the complete CourseOffering grade package to the College Administration for formal review and publishing?')) {
      return;
    }
    setSubmitting(true);
    await fakeApi.submitCourseOfferingGrades('CS301');
    setPackageStatus('Doctor Submitted');
    setSubmitting(false);
    showToast('Course grade package submitted to Dean Executive Office for review.', 'success');
  };

  return (
    <div>
      <PageHead
        title="Course Gradebook &amp; Package Submission"
        subtitle={`${gradebook.courseCode} · ${gradebook.courseName} · Fall 2026`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'CourseOfferings', href: '#/doctor/offerings' },
          { label: 'Gradebook' }
        ]}
        actions={
          <div className="row gap-2">
            <button
              className="btn btn-primary"
              onClick={handleSubmitPackage}
              disabled={submitting || packageStatus !== 'Draft'}
            >
              <Icon name="checkCircle" /> {submitting ? 'Submitting Package...' : 'Submit Package to Admin'}
            </button>
          </div>
        }
      />

      {/* Package Status Banner */}
      <div className="card mb-5 p-4" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <div className="row-between wrap gap-2">
          <div className="row gap-3">
            <span className={`badge ${
              packageStatus === 'Published' ? 'badge-success' :
              packageStatus === 'Doctor Submitted' ? 'badge-warning' : 'badge-neutral'
            }`}>
              Package Lifecycle: {packageStatus}
            </span>
            <span className="sub text-xs">
              {packageStatus === 'Draft' ? 'Doctor editing open. Verify all columns before package dispatch.' :
               packageStatus === 'Doctor Submitted' ? 'Under Admin Review. Dean audit pending.' : 'Official Grades Published.'}
            </span>
          </div>
          <div className="row gap-2">
            <div className="chip chip-info">Max Marks: 100</div>
            <div className="chip chip-neutral">64 Enrolled Roster</div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="card">
        <div className="card-head">
          <h3>Student Assessment Spreadsheet</h3>
          <span className="sub text-xs">Direct editable cells with live total and letter recalculation</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Student Name</th>
                <th style={{ minWidth: '120px' }}>Midterm (20)</th>
                <th style={{ minWidth: '120px' }}>Practical (20)</th>
                <th style={{ minWidth: '120px' }}>Coursework (15)</th>
                <th style={{ minWidth: '120px' }}>Final (45)</th>
                <th>Total (100)</th>
                <th>Letter Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map(std => (
                <tr key={std.code}>
                  <td><code>{std.code}</code></td>
                  <td className="bold">{std.name}</td>
                  <td>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      max={20}
                      className="input"
                      style={{ padding: '4px 8px', fontSize: '13px', width: '90px' }}
                      value={std.midterm}
                      disabled={packageStatus !== 'Draft'}
                      onChange={e => handleCellChange(std.code, 'midterm', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      max={20}
                      className="input"
                      style={{ padding: '4px 8px', fontSize: '13px', width: '90px' }}
                      value={std.practical}
                      disabled={packageStatus !== 'Draft'}
                      onChange={e => handleCellChange(std.code, 'practical', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      max={15}
                      className="input"
                      style={{ padding: '4px 8px', fontSize: '13px', width: '90px' }}
                      value={std.coursework}
                      disabled={packageStatus !== 'Draft'}
                      onChange={e => handleCellChange(std.code, 'coursework', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      max={45}
                      className="input"
                      style={{ padding: '4px 8px', fontSize: '13px', width: '90px' }}
                      value={std.final}
                      disabled={packageStatus !== 'Draft'}
                      onChange={e => handleCellChange(std.code, 'final', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="bold" style={{ fontSize: '15px', color: 'var(--color-primary)' }}>
                    {std.total}
                  </td>
                  <td>
                    <span className={`badge ${std.letter === 'F' ? 'badge-danger' : 'badge-success'}`}>
                      {std.letter}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
