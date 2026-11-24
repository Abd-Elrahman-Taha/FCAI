/**
 * Screen 42: Doctor / Instructor Dashboard
 *
 * 100% Live Backend Integration (Zero static/mock data):
 * - GET /api/semesters/active (via ActiveSemesterCard)
 * - GET /api/doctors/me
 */

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { DoctorProfileResponseDto } from '../../types/api';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { ActiveSemesterCard } from '../../components/common/ActiveSemesterCard';
import { useAuth } from '../../context/AuthContext';

export const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<DoctorProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.profile.doctor
      .getMe()
      .then(data => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <CardSkeleton count={3} />;

  return (
    <div className="space-y-6">
      <div className="hero">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="briefcase" size="sm" /> Faculty Portal · FCAI BSU
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 750 }}>
              Welcome, {profile?.fullNameEn || currentUser?.name || 'Doctor'}
            </h1>
            <p className="sub mt-2" style={{ fontSize: '14px' }}>
              {profile?.title || 'Faculty Member'} · {profile?.departmentName || 'FCAI BSU'}
            </p>
          </div>
          <div className="row gap-2 mt-2 wrap">
            <a href="#/doctor/profile" className="btn btn-ice">
              <Icon name="user" /> My Profile
            </a>
            <a href="#/account-security" className="btn btn-hero-glass">
              <Icon name="shield" /> Account Security
            </a>
          </div>
        </div>
      </div>

      <ActiveSemesterCard />

      {profile && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card kpi">
            <div className="kpi-top">
              <span className="kpi-label">Department</span>
              <span className="kpi-ico info"><Icon name="building" /></span>
            </div>
            <div className="kpi-value" style={{ fontSize: '20px' }}>{profile.departmentName || '—'}</div>
            <div className="kpi-meta">{profile.title || 'Faculty'}</div>
          </div>

          <div className="card kpi">
            <div className="kpi-top">
              <span className="kpi-label">Max Supervised Projects</span>
              <span className="kpi-ico primary"><Icon name="layers" /></span>
            </div>
            <div className="kpi-value">{profile.maxSupervisedProjects}</div>
            <div className="kpi-meta">Hire Date: {profile.hireDate}</div>
          </div>

          <div className="card kpi">
            <div className="kpi-top">
              <span className="kpi-label">Account Status</span>
              <span className="kpi-ico info"><Icon name="shield" /></span>
            </div>
            <div className="kpi-value" style={{ fontSize: '20px' }}>{profile.isActive ? 'Active' : 'Inactive'}</div>
            <div className="kpi-meta">{profile.email}</div>
          </div>
        </div>
      )}
    </div>
  );
};
