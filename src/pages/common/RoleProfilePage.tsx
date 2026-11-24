/**
 * Role Self-Service Profile Page (Doctor, Teaching Assistant, Employee)
 *
 * Connected strictly to confirmed Swagger self-service endpoints:
 * - Doctor:             GET /api/doctors/me, PUT /api/doctors/me
 * - Teaching Assistant: GET /api/teaching-assistants/me, PUT /api/teaching-assistants/me
 * - Employee:           GET /api/employees/me, PUT /api/employees/me
 */

import React, { useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  DoctorProfileResponseDto,
  EmployeeProfileResponseDto,
  TeachingAssistantProfileResponseDto,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

type StaffProfile =
  | { kind: 'doctor'; data: DoctorProfileResponseDto }
  | { kind: 'ta'; data: TeachingAssistantProfileResponseDto }
  | { kind: 'employee'; data: EmployeeProfileResponseDto };

export const RoleProfilePage: React.FC = () => {
  const { role, showToast } = useAuth();

  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader =
      role === 'doctor'
        ? api.profile.doctor.getMe().then((data): StaffProfile => ({ kind: 'doctor', data }))
        : role === 'ta'
        ? api.profile.ta.getMe().then((data): StaffProfile => ({ kind: 'ta', data }))
        : api.profile.employee.getMe().then((data): StaffProfile => ({ kind: 'employee', data }));

    loader
      .then(result => {
        if (cancelled) return;
        setProfile(result);
        setEmail(result.data.email ?? '');
        setPhoneNumber(result.data.phoneNumber ?? '');
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [role]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      const payload = {
        email: email.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
      };
      if (role === 'doctor') {
        const res = await api.profile.doctor.updateContact(payload);
        setProfile({ kind: 'doctor', data: res.data });
        showToast('Profile Updated', res.message, 'success');
      } else if (role === 'ta') {
        const res = await api.profile.ta.updateContact(payload);
        setProfile({ kind: 'ta', data: res.data });
        showToast('Profile Updated', res.message, 'success');
      } else {
        const res = await api.profile.employee.updateContact(payload);
        setProfile({ kind: 'employee', data: res.data });
        showToast('Profile Updated', res.message, 'success');
      }
    } catch (err: unknown) {
      setSaveError(err instanceof ApiError || err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const titleLabel =
    role === 'doctor' ? 'Doctor Profile' : role === 'ta' ? 'Teaching Assistant Profile' : 'Employee Profile';

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: role.toUpperCase(), href: `#/${role}/dashboard` },
          { label: 'My Profile' },
        ]}
        title={titleLabel}
        subtitle="View your institutional profile details and update your contact email or phone number."
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
          <h3>Could not load profile</h3>
          <p className="text-sm muted">{error || 'Profile unavailable.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 card card-pad space-y-3 text-sm">
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">{profile.data.fullNameEn}</h3>
              {profile.data.fullNameAr && <p className="text-xs muted" dir="rtl">{profile.data.fullNameAr}</p>}
            </div>
            <div className="flex justify-between"><span className="muted">Department</span><b>{profile.data.departmentName || '—'}</b></div>
            <div className="flex justify-between"><span className="muted">Hire Date</span><b>{profile.data.hireDate}</b></div>
            <div className="flex justify-between">
              <span className="muted">Status</span>
              <span className={profile.data.isActive ? 'chip chip-primary' : 'chip chip-danger'}>
                {profile.data.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {profile.kind === 'doctor' && (
              <>
                <div className="flex justify-between"><span className="muted">Title</span><b>{profile.data.title || '—'}</b></div>
                <div className="flex justify-between"><span className="muted">Max Supervised Projects</span><b>{profile.data.maxSupervisedProjects}</b></div>
              </>
            )}
            {profile.kind === 'ta' && (
              <>
                <div className="flex justify-between"><span className="muted">Academic Degree</span><b>{profile.data.academicDegree || '—'}</b></div>
                <div className="flex justify-between"><span className="muted">Max Supervised Projects</span><b>{profile.data.maxSupervisedProjects}</b></div>
              </>
            )}
            {profile.kind === 'employee' && (
              <div className="flex justify-between"><span className="muted">Job Title</span><b>{profile.data.jobTitle || '—'}</b></div>
            )}
          </div>

          <div className="lg:col-span-7 card card-pad">
            <h3 className="text-base font-bold mb-1">Update Contact Information</h3>
            <p className="text-xs muted mb-4">Changes apply immediately to your institutional profile.</p>
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
                  <input className="input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
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
