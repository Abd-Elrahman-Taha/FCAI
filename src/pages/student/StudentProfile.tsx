import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { User } from '../../types';

export const StudentProfile: React.FC = () => {
  const { showToast } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fakeApi.getStudentProfile().then(u => {
      setProfile(u);
      setPhone(u.phone || '');
      setEmail(u.email || '');
    });
  }, []);

  if (!profile) return <div className="card card-pad"><div className="spinner lg mx-auto" /></div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !email) {
      setError('Phone and email cannot be empty.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const updated = await fakeApi.updateStudentProfile({ phone, email });
      setProfile(updated);
      setIsEditing(false);
      showToast('Profile Updated', 'Your contact information was successfully saved.');
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPhone(profile.phone || '');
    setEmail(profile.email || '');
    setIsEditing(false);
    setError(null);
  };

  return (
    <div>
      <PageHead
        title="Student Profile"
        desc="Official institutional identity and editable personal contact information."
        crumbs={[['Student Portal', '#/student/dashboard'], ['My Profile']]}
        actions={
          !isEditing ? (
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              <Icon name="edit" size="sm" /> Edit Personal Information
            </button>
          ) : (
            <div className="row gap-2">
              <button type="button" className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )
        }
      />

      {error && (
        <div className="alert alert-danger mb-4">
          <Icon name="alertCircle" />
          <div><b>Validation Error</b><p>{error}</p></div>
        </div>
      )}

      <div className="grid g-main">
        {/* Left Column: Form & Fields */}
        <div className="col gap-6">
          {/* Official University Identity (Read-only / Controlled by College) */}
          <div className="card card-pad">
            <div className="row-between mb-4">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                  <Icon name="shieldCheck" size="sm" /> Official College Records
                </h3>
                <p className="text-xs muted">Controlled exclusively by the FCAI BSU Dean &amp; Student Affairs administration.</p>
              </div>
              <span className="badge b-navy no-dot">Verified Institutional Data</span>
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label">Full Legal Name <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input" value={profile.name} readOnly disabled />
              </div>

              <div className="field">
                <label className="label">Student Code <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input mono" value={profile.studentCode} readOnly disabled />
              </div>

              <div className="field">
                <label className="label">National ID (14 Digits) <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input mono" value={profile.nationalId} readOnly disabled />
              </div>

              <div className="field">
                <label className="label">Department <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input" value={profile.department} readOnly disabled />
              </div>

              <div className="field">
                <label className="label">Current Academic Level <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input" value={profile.academicLevel} readOnly disabled />
              </div>

              <div className="field">
                <label className="label">Academic Status <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input" value={profile.academicStatus} readOnly disabled />
              </div>

              <div className="field">
                <label className="label">Date of Birth <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input" value={profile.birthDate} readOnly disabled />
              </div>

              <div className="field">
                <label className="label">Gender <Icon name="lock" size="sm" className="lock" /></label>
                <input className="input" value={profile.gender} readOnly disabled />
              </div>
            </div>
          </div>

          {/* Editable Personal Fields */}
          <div className="card card-pad">
            <div className="row-between mb-4">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                  <Icon name="user" size="sm" /> Personal Contact Details
                </h3>
                <p className="text-xs muted">Editable by the student for correspondence and emergency alerts.</p>
              </div>
              {isEditing ? (
                <span className="badge b-warning">Editing Mode</span>
              ) : (
                <span className="badge b-success no-dot">Up to date</span>
              )}
            </div>

            <form onSubmit={handleSave} className="form-grid">
              <div className="field">
                <label className="label">Contact Phone Number {isEditing && <span className="req">*</span>}</label>
                <div className="input-group">
                  <span className="lead"><Icon name="phone" size="sm" /></span>
                  <input
                    className="input"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    readOnly={!isEditing}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Contact Email Address {isEditing && <span className="req">*</span>}</label>
                <div className="input-group">
                  <span className="lead"><Icon name="mail" size="sm" /></span>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    readOnly={!isEditing}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              {isEditing && (
                <div className="full row gap-2 mt-2" style={{ justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Identity Card Preview */}
        <div className="col gap-6">
          <div className="card card-pad text-center">
            <div className="avatar lg mx-auto mb-4" style={{ width: '84px', height: '84px', fontSize: '28px' }}>
              {profile.short}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{profile.name}</h2>
            <p className="text-xs muted mt-1">{profile.meta}</p>
            <div className="badge b-info no-dot mt-3">Active Matriculation</div>

            <div className="divider" />

            <div className="kv text-left text-xs">
              <dt>Student ID:</dt>
              <dd className="mono">{profile.studentCode}</dd>
              <dt>Academic Year:</dt>
              <dd>{profile.academicYear}</dd>
              <dt>Cumulative GPA:</dt>
              <dd className="fw-7">{profile.gpa} / 4.00</dd>
              <dt>Credit Hours:</dt>
              <dd>{profile.completedCredits} Completed</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
