/**
 * Screen 9: Student Profile (Self-Service)
 *
 * Connected strictly to confirmed Swagger endpoints:
 * - GET /api/students/me
 * - PUT /api/students/me
 */

import React, { useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type { StudentProfileResponseDto } from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const StudentProfile: React.FC = () => {
  const { showToast } = useAuth();

  const [profile, setProfile] = useState<StudentProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.profile.student
      .getMe()
      .then(data => {
        if (cancelled) return;
        setProfile(data);
        setPhone(data.phone ?? '');
        setEmail(data.email ?? '');
        setAddress(data.address ?? '');
        setGovernorate(data.governorate ?? '');
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load student profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      const res = await api.profile.student.updateContact({
        phone: phone.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        governorate: governorate.trim() || null,
      });
      setProfile(res.data);
      showToast('Profile Updated', res.message, 'success');
    } catch (err: unknown) {
      setSaveError(err instanceof ApiError || err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Student', href: '#/student/dashboard' },
          { label: 'My Profile' },
        ]}
        title="My Student Profile"
        subtitle="View your institutional student record and keep your contact information up to date."
        actions={
          <a href="#/account-security" className="btn btn-outline btn-sm">
            <Icon name="shield" size="sm" /> Account Security
          </a>
        }
      />

      {loading ? (
        <CardSkeleton />
      ) : error || !profile ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Could not load student profile</h3>
          <p className="text-sm muted">{error || 'Profile unavailable.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 card card-pad space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-[#052659] text-white flex items-center justify-center font-bold text-lg">
                {(profile.fullNameEn || 'ST').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-base">{profile.fullNameEn}</h3>
                {profile.fullNameAr && <p className="text-xs muted" dir="rtl">{profile.fullNameAr}</p>}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="muted">Student Code</span><b className="font-mono">{profile.studentCode}</b></div>
              <div className="flex justify-between"><span className="muted">National ID</span><b className="font-mono">{profile.nationalId}</b></div>
              <div className="flex justify-between"><span className="muted">Department</span><b>{profile.departmentName || '—'}</b></div>
              <div className="flex justify-between"><span className="muted">Academic Status</span><span className="chip chip-primary">{profile.academicStatus}</span></div>
              <div className="flex justify-between"><span className="muted">CGPA</span><b>{profile.cgpa.toFixed(2)}</b></div>
              <div className="flex justify-between"><span className="muted">Passed Credits</span><b>{profile.passedCredits} cr</b></div>
              <div className="flex justify-between"><span className="muted">Admission Year</span><b>{profile.admissionYear}</b></div>
              <div className="flex justify-between"><span className="muted">Secondary Track</span><b>{profile.secondaryTrack} ({profile.secondaryScore})</b></div>
              <div className="flex justify-between"><span className="muted">Academic Advisor</span><b>{profile.academicAdvisorName || 'Unassigned'}</b></div>
              <div className="flex justify-between"><span className="muted">Warnings</span><b>{profile.totalWarningsCount} total ({profile.consecutiveWarningsCount} consecutive)</b></div>
            </div>
          </div>

          <div className="lg:col-span-7 card card-pad">
            <h3 className="text-base font-bold mb-1">Update Contact Information</h3>
            <p className="text-xs muted mb-4">Only contact fields are editable by students. Academic records are maintained by Student Affairs.</p>
            {saveError && (
              <div className="alert alert-danger mb-3 text-sm">
                <Icon name="alert" size="sm" />
                <span>{saveError}</span>
              </div>
            )}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="label">Governorate</label>
                  <input className="input" value={governorate} onChange={e => setGovernorate(e.target.value)} />
                </div>
                <div>
                  <label className="label">Address</label>
                  <input className="input" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Contact Info'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
