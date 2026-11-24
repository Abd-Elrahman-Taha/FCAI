/**
 * Screen 73: College Administration Dashboard
 *
 * 100% Live Backend Integration (Zero static/mock data):
 * - GET /api/semesters/active (via ActiveSemesterCard)
 * - GET /api/admin/students?PageIndex=1&PageSize=1
 * - GET /api/admin/doctors?PageIndex=1&PageSize=1
 * - GET /api/admin/teaching-assistants?PageIndex=1&PageSize=1
 * - GET /api/admin/employees?PageIndex=1&PageSize=1
 * - GET /api/admin/departments?PageIndex=1&PageSize=1
 * - GET /api/admin/courses?Page=1&PageSize=1
 * - GET /api/admin/academic-years
 * - GET /api/admin/policy-versions
 */

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { ActiveSemesterCard } from '../../components/common/ActiveSemesterCard';
import { useAuth } from '../../context/AuthContext';

interface LiveAdminStats {
  students: number | null;
  doctors: number | null;
  tas: number | null;
  employees: number | null;
  departments: number | null;
  courses: number | null;
  academicYears: number | null;
  policies: number | null;
}

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<LiveAdminStats>({
    students: null,
    doctors: null,
    tas: null,
    employees: null,
    departments: null,
    courses: null,
    academicYears: null,
    policies: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.people.students.list({ PageIndex: 1, PageSize: 1 }),
      api.people.doctors.list({ PageIndex: 1, PageSize: 1 }),
      api.people.teachingAssistants.list({ PageIndex: 1, PageSize: 1 }),
      api.people.employees.list({ PageIndex: 1, PageSize: 1 }),
      api.departments.adminList({ PageIndex: 1, PageSize: 1 }),
      api.courses.adminSearch({ Page: 1, PageSize: 1 }),
      api.academicYears.getAll(),
      api.policies.listPolicies(),
    ])
      .then(([stu, doc, ta, emp, dept, crs, yrs, pols]) => {
        if (cancelled) return;
        setStats({
          students: stu.status === 'fulfilled' ? stu.value.meta?.totalCount ?? (stu.value.items?.length ?? 0) : null,
          doctors: doc.status === 'fulfilled' ? doc.value.meta?.totalCount ?? (doc.value.items?.length ?? 0) : null,
          tas: ta.status === 'fulfilled' ? ta.value.meta?.totalCount ?? (ta.value.items?.length ?? 0) : null,
          employees: emp.status === 'fulfilled' ? emp.value.meta?.totalCount ?? (emp.value.items?.length ?? 0) : null,
          departments: dept.status === 'fulfilled' ? dept.value.meta?.totalCount ?? (dept.value.items?.length ?? 0) : null,
          courses: crs.status === 'fulfilled' ? crs.value.meta?.totalCount ?? (crs.value.items?.length ?? 0) : null,
          academicYears: yrs.status === 'fulfilled' ? yrs.value.length : null,
          policies: pols.status === 'fulfilled' ? pols.value.length : null,
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fmt = (val: number | null) => (val === null ? '—' : val.toLocaleString());

  return (
    <div className="space-y-6">
      <div className="hero">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="shield" size="sm" /> Faculty Executive Administration · Beni Suef University
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 750 }}>
              {currentUser?.name ? `Welcome, ${currentUser.name}` : 'College Administration Overview'}
            </h1>
            <p className="sub mt-2" style={{ fontSize: '14px' }}>
              Live institutional overview synchronized directly with FCAI BSU backend services.
            </p>
          </div>
          <div className="row gap-2 mt-2 wrap">
            <a href="#/admin/academic-years" className="btn btn-ice">
              <Icon name="calendar" /> Academic Years
            </a>
            <a href="#/admin/semesters" className="btn btn-hero-glass">
              <Icon name="calendarCheck" /> Semesters
            </a>
            <a href="#/admin/courses" className="btn btn-hero-glass">
              <Icon name="book" /> Courses &amp; Curricula
            </a>
          </div>
        </div>
      </div>

      {/* Live Active Semester (GET /api/semesters/active) */}
      <ActiveSemesterCard />

      {/* Live Backend KPI Counts */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="#/admin/students" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Students</span>
              <span className="kpi-ico info"><Icon name="graduation" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.students)}</div>
            <div className="kpi-meta">Manage directory, transfers &amp; credit overrides</div>
          </a>

          <a href="#/admin/doctors" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Doctors / Faculty</span>
              <span className="kpi-ico primary"><Icon name="briefcase" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.doctors)}</div>
            <div className="kpi-meta">Manage faculty accounts &amp; department heads</div>
          </a>

          <a href="#/admin/tas" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Teaching Assistants</span>
              <span className="kpi-ico info"><Icon name="users" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.tas)}</div>
            <div className="kpi-meta">Manage TA profiles &amp; departments</div>
          </a>

          <a href="#/admin/employees" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Employees</span>
              <span className="kpi-ico primary"><Icon name="idCard" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.employees)}</div>
            <div className="kpi-meta">Manage administrative staff accounts</div>
          </a>

          <a href="#/admin/departments" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Departments</span>
              <span className="kpi-ico info"><Icon name="building" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.departments)}</div>
            <div className="kpi-meta">Academic &amp; administrative units</div>
          </a>

          <a href="#/admin/courses" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Courses</span>
              <span className="kpi-ico primary"><Icon name="book" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.courses)}</div>
            <div className="kpi-meta">Courses, prerequisites &amp; curriculum versions</div>
          </a>

          <a href="#/admin/academic-years" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Academic Years</span>
              <span className="kpi-ico info"><Icon name="calendar" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.academicYears)}</div>
            <div className="kpi-meta">Years, semesters &amp; operational windows</div>
          </a>

          <a href="#/admin/regulations" className="card kpi hover">
            <div className="kpi-top">
              <span className="kpi-label">Policy Versions</span>
              <span className="kpi-ico primary"><Icon name="gavel" /></span>
            </div>
            <div className="kpi-value">{fmt(stats.policies)}</div>
            <div className="kpi-meta">Bylaws, credit load rules &amp; grade scales</div>
          </a>
        </div>
      )}

      {/* Quick Live Management Links */}
      <div className="card card-pad">
        <h3 className="font-bold text-base mb-3">Quick Administration Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <a href="#/admin/create-student" className="btn btn-outline justify-start">
            <Icon name="plus" size="sm" /> Enroll New / Transferred Student
          </a>
          <a href="#/admin/credit-load" className="btn btn-outline justify-start">
            <Icon name="sliders" size="sm" /> Credit Load Rules
          </a>
          <a href="#/admin/levels" className="btn btn-outline justify-start">
            <Icon name="layers" size="sm" /> Academic Level Credit Ranges
          </a>
          <a href="#/admin/grade-scale" className="btn btn-outline justify-start">
            <Icon name="scale" size="sm" /> Grade Scale Versions
          </a>
          <a href="#/admin/users" className="btn btn-outline justify-start">
            <Icon name="shield" size="sm" /> Admin Accounts
          </a>
          <a href="#/account-security" className="btn btn-outline justify-start">
            <Icon name="lock" size="sm" /> Account Security
          </a>
        </div>
      </div>
    </div>
  );
};
