import React, { useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const CreateStudentAccount: React.FC = () => {
  const { showToast } = useAuth();
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [dept, setDept] = useState('Computer Science');
  const [academicLevel, setAcademicLevel] = useState('Level 1 (Freshman)');
  const [academicStatus, setAcademicStatus] = useState('Active');
  const [accountStatus, setAccountStatus] = useState('Active');
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 14) {
      showToast('National ID must be exactly 14 numeric digits.', 'error');
      return;
    }
    const res = await fakeApi.createStudentAccount({ name, nationalId, dept, academicLevel, academicStatus, accountStatus });
    setGeneratedResult(res);
    showToast(`Student account provisioned! Assigned code: ${res.studentCode}`, 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 6: Create / Activate Student Account"
        subtitle="Provision student identity, National ID validation, academic status, and temporary credentials"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Students', href: '#/admin/students' },
          { label: 'Create Account' }
        ]}
      />

      <div className="grid g-2 mb-6" style={{ maxWidth: '900px' }}>
        <div className="card p-6">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
            Student Provisioning Form
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Student Full Name (Triple/Quadruple name)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Mahmoud Tarek Adel"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Egyptian National ID (14 Digits)</label>
              <input
                type="text"
                maxLength={14}
                className="input"
                placeholder="e.g. 30401012201234"
                value={nationalId}
                onChange={e => setNationalId(e.target.value)}
                required
              />
            </div>

            <div className="grid g-2 mb-3">
              <div className="form-group">
                <label className="form-label">Department Assignment</label>
                <select className="select" value={dept} onChange={e => setDept(e.target.value)}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Information Systems">Information Systems</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Academic Level</label>
                <select className="select" value={academicLevel} onChange={e => setAcademicLevel(e.target.value)}>
                  <option value="Level 1 (Freshman)">Level 1 (Freshman)</option>
                  <option value="Level 2 (Sophomore)">Level 2 (Sophomore)</option>
                  <option value="Level 3 (Junior)">Level 3 (Junior)</option>
                  <option value="Level 4 (Senior)">Level 4 (Senior)</option>
                </select>
              </div>
            </div>

            <div className="grid g-2 mb-4">
              <div className="form-group">
                <label className="form-label">Academic Status</label>
                <select className="select" value={academicStatus} onChange={e => setAcademicStatus(e.target.value)}>
                  <option value="Active">Active (Good Standing)</option>
                  <option value="Probationary">Academic Probation (GPA &lt; 2.0)</option>
                  <option value="Suspended">Suspended / On Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Account Login Status</label>
                <select className="select" value={accountStatus} onChange={e => setAccountStatus(e.target.value)}>
                  <option value="Active">Active &amp; Provisioned</option>
                  <option value="Pending First Login">Pending First Login</option>
                  <option value="Locked">Temporarily Locked</option>
                </select>
              </div>
            </div>

            <div className="row-end gap-2">
              <a href="#/admin/students" className="btn btn-secondary">Cancel</a>
              <button type="submit" className="btn btn-primary">
                <Icon name="checkCircle" /> Provision &amp; Activate Account
              </button>
            </div>
          </form>
        </div>

        {/* Temporary Credentials Dispatch Card */}
        <div>
          <div className="card p-6" style={{ background: generatedResult ? '#f0fdf4' : 'var(--color-bg-page)', border: generatedResult ? '1px solid #86efac' : '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
              Account Activation Slip
            </h4>
            {generatedResult ? (
              <div className="stack gap-3 text-sm">
                <div className="badge badge-success mb-2">Account Successfully Created</div>
                <div className="p-3 bg-white rounded border">
                  <span className="sub text-xs block">Assigned Student Code:</span>
                  <code style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>{generatedResult.studentCode}</code>
                </div>
                <div className="p-3 bg-white rounded border">
                  <span className="sub text-xs block">Temporary First-Login Password:</span>
                  <code style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-danger)' }}>{generatedResult.tempPassword}</code>
                </div>
                <p className="sub text-xs leading-relaxed">
                  Provide these credentials to the student. Upon first authentication, the platform will enforce temporary password replacement on Screen 2.
                </p>
                <button className="btn btn-secondary btn-sm w-full" onClick={() => window.print()}>
                  <Icon name="download" /> Print Credentials Slip
                </button>
              </div>
            ) : (
              <p className="sub text-xs leading-relaxed">
                Fill the provisioning form on the left to issue an official Beni Suef University student identifier and activation slip.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
