/**
 * Screen 6: Create Student Account (Regular & Transferred) (Admin)
 *
 * Connected strictly to confirmed Swagger endpoints:
 * - POST /api/admin/students
 * - POST /api/admin/students/transferred
 * Plus live lookups: GET /api/departments/lookup, GET /api/admin/curriculum-versions,
 * GET /api/admin/doctors, GET /api/admin/courses
 */

import React, { useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  CourseListItemDto,
  CreateStudentResponseDto,
  CreateTransferredStudentResponseDto,
  CurriculumVersionListItemDto,
  DepartmentLookupDto,
  DoctorListItemDto,
  SecondaryTrack,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const CreateStudentAccount: React.FC = () => {
  const { showToast } = useAuth();
  const [mode, setMode] = useState<'regular' | 'transferred'>('regular');

  const [departments, setDepartments] = useState<DepartmentLookupDto[]>([]);
  const [curricula, setCurricula] = useState<CurriculumVersionListItemDto[]>([]);
  const [doctors, setDoctors] = useState<DoctorListItemDto[]>([]);
  const [courses, setCourses] = useState<CourseListItemDto[]>([]);

  // Common fields
  const [nationalId, setNationalId] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [fullNameAr, setFullNameAr] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [secondaryTrack, setSecondaryTrack] = useState<SecondaryTrack>('Math');
  const [secondaryCertificateYear, setSecondaryCertificateYear] = useState<string>('');
  const [seatNumber, setSeatNumber] = useState('');
  const [secondaryScore, setSecondaryScore] = useState<string>('');
  const [admissionYear, setAdmissionYear] = useState<string>('');
  const [curriculumVersionId, setCurriculumVersionId] = useState('');
  const [advisorDoctorId, setAdvisorDoctorId] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');

  // Transferred student extra fields
  const [previousInstitution, setPreviousInstitution] = useState('');
  const [previousFacultyName, setPreviousFacultyName] = useState('');
  const [cgpa, setCgpa] = useState<string>('');
  const [completedCourseIds, setCompletedCourseIds] = useState<number[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<
    CreateStudentResponseDto | CreateTransferredStudentResponseDto | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.departments.getLookup().catch(() => [] as DepartmentLookupDto[]),
      api.curriculum.listVersions().catch(() => [] as CurriculumVersionListItemDto[]),
      api.people.doctors.list({ PageIndex: 1, PageSize: 100 }).catch(() => ({ items: [] as DoctorListItemDto[] })),
      api.courses.adminSearch({ Page: 1, PageSize: 200 }).catch(() => ({ items: [] as CourseListItemDto[] })),
    ]).then(([depts, currs, docs, crs]) => {
      if (cancelled) return;
      setDepartments(depts);
      setCurricula(currs);
      setDoctors(docs.items ?? []);
      setCourses(crs.items ?? []);
      if (depts[0]) setDepartmentId(String(depts[0].id));
      const activeCurr = currs.find(c => c.isActive) ?? currs[0];
      if (activeCurr) setCurriculumVersionId(String(activeCurr.id));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCourse = (id: number) => {
    setCompletedCourseIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreatedResult(null);
    if (!fullNameEn.trim() || !nationalId.trim() || !departmentId) {
      setError('Full name (EN), national ID, and department are required.');
      return;
    }
    if (mode === 'transferred' && !curriculumVersionId) {
      setError('Curriculum version is required for transferred students.');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'regular') {
        const res = await api.people.students.create({
          nationalId: nationalId.trim(),
          fullNameEn: fullNameEn.trim(),
          fullNameAr: fullNameAr.trim() || null,
          dateOfBirth: dateOfBirth || null,
          gender,
          nationality: nationality.trim() || null,
          phone: phone.trim() || null,
          email: email.trim() || null,
          address: address.trim() || null,
          governorate: governorate.trim() || null,
          departmentId: Number(departmentId),
          secondaryTrack,
          secondaryCertificateYear: Number(secondaryCertificateYear),
          seatNumber: seatNumber.trim() || null,
          secondaryScore: Number(secondaryScore),
          admissionYear: Number(admissionYear),
          curriculumVersionId: curriculumVersionId ? Number(curriculumVersionId) : null,
          academicAdvisorDoctorId: advisorDoctorId ? Number(advisorDoctorId) : null,
          temporaryPassword: temporaryPassword || null,
        });
        setCreatedResult(res.data);
        showToast('Student Account Created', res.message, 'success');
      } else {
        const res = await api.people.students.createTransferred({
          nationalId: nationalId.trim(),
          fullNameEn: fullNameEn.trim(),
          fullNameAr: fullNameAr.trim() || null,
          dateOfBirth: dateOfBirth || null,
          gender,
          nationality: nationality.trim() || null,
          phone: phone.trim() || null,
          email: email.trim() || null,
          address: address.trim() || null,
          governorate: governorate.trim() || null,
          departmentId: Number(departmentId),
          secondaryTrack,
          secondaryCertificateYear: Number(secondaryCertificateYear),
          seatNumber: seatNumber.trim() || null,
          secondaryScore: Number(secondaryScore),
          admissionYear: Number(admissionYear),
          curriculumVersionId: Number(curriculumVersionId),
          academicAdvisorDoctorId: advisorDoctorId ? Number(advisorDoctorId) : null,
          previousInstitution: previousInstitution.trim() || null,
          previousFacultyName: previousFacultyName.trim() || null,
          cgpa: Number(cgpa),
          completedCourseIds,
          temporaryPassword: temporaryPassword || null,
        });
        setCreatedResult(res.data);
        showToast('Transferred Student Created', res.message, 'success');
      }
    } catch (err: unknown) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to create student.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'Students', href: '#/admin/students' },
          { label: 'Create Student Account' },
        ]}
        title="Enroll New Student Account"
        subtitle="Register either a standard incoming freshman or a transferred student with equivalent completed courses."
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn btn-sm ${mode === 'regular' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMode('regular')}
            >
              Regular Student
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mode === 'transferred' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMode('transferred')}
            >
              Transferred Student
            </button>
          </div>
        }
      />

      {createdResult && (
        <div className="alert alert-info text-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            <b>Student Enrolled!</b> Code: <code className="font-mono font-bold">{createdResult.studentCode}</code> · Email:{' '}
            <b>{createdResult.email}</b>
            {createdResult.temporaryPassword && (
              <span> · Temp Password: <code className="font-mono font-bold">{createdResult.temporaryPassword}</code></span>
            )}
          </div>
          <a href="#/admin/students" className="btn btn-primary btn-xs">Back to Students</a>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-sm">
          <Icon name="alert" size="sm" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card card-pad space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="label">National ID</label><input className="input" value={nationalId} onChange={e => setNationalId(e.target.value)} required /></div>
          <div><label className="label">Full Name (EN)</label><input className="input" value={fullNameEn} onChange={e => setFullNameEn(e.target.value)} required /></div>
          <div><label className="label">Full Name (AR)</label><input className="input" dir="rtl" value={fullNameAr} onChange={e => setFullNameAr(e.target.value)} /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
          <div><label className="label">Date of Birth</label><input type="date" className="input" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} /></div>
          <div>
            <label className="label">Gender</label>
            <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div><label className="label">Nationality</label><input className="input" value={nationality} onChange={e => setNationality(e.target.value)} /></div>
          <div><label className="label">Governorate</label><input className="input" value={governorate} onChange={e => setGovernorate(e.target.value)} /></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className="label">Address</label><input className="input" value={address} onChange={e => setAddress(e.target.value)} /></div>

          <div>
            <label className="label">Department</label>
            <select className="input" value={departmentId} onChange={e => setDepartmentId(e.target.value)} required>
              <option value="">Select department...</option>
              {departments.map(d => <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Secondary Track</label>
            <select className="input" value={secondaryTrack} onChange={e => setSecondaryTrack(e.target.value as SecondaryTrack)}>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div><label className="label">Secondary Certificate Year</label><input type="number" className="input" value={secondaryCertificateYear} onChange={e => setSecondaryCertificateYear(e.target.value)} required /></div>
          <div><label className="label">Seat Number</label><input className="input" value={seatNumber} onChange={e => setSeatNumber(e.target.value)} /></div>
          <div><label className="label">Secondary Score</label><input type="number" step="0.5" className="input" value={secondaryScore} onChange={e => setSecondaryScore(e.target.value)} required /></div>
          <div><label className="label">Admission Year</label><input type="number" className="input" value={admissionYear} onChange={e => setAdmissionYear(e.target.value)} required /></div>

          <div>
            <label className="label">Curriculum Version {mode === 'transferred' ? '(Required)' : '(Optional)'}</label>
            <select className="input" value={curriculumVersionId} onChange={e => setCurriculumVersionId(e.target.value)} required={mode === 'transferred'}>
              <option value="">Default Active</option>
              {curricula.map(cv => <option key={cv.id} value={String(cv.id)}>{cv.name} (v{cv.versionNumber})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Academic Advisor (Optional)</label>
            <select className="input" value={advisorDoctorId} onChange={e => setAdvisorDoctorId(e.target.value)}>
              <option value="">None</option>
              {doctors.map(d => <option key={d.id} value={String(d.id)}>{d.fullNameEn}</option>)}
            </select>
          </div>
          <div><label className="label">Temporary Password (Optional)</label><input type="password" className="input" value={temporaryPassword} onChange={e => setTemporaryPassword(e.target.value)} /></div>
        </div>

        {mode === 'transferred' && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base">Transfer Details &amp; Equivalent Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="label">Previous Institution</label><input className="input" value={previousInstitution} onChange={e => setPreviousInstitution(e.target.value)} required /></div>
              <div><label className="label">Previous Faculty</label><input className="input" value={previousFacultyName} onChange={e => setPreviousFacultyName(e.target.value)} required /></div>
              <div><label className="label">Transferred CGPA</label><input type="number" step="0.01" className="input" value={cgpa} onChange={e => setCgpa(e.target.value)} required /></div>
            </div>
            <div>
              <label className="label">Completed Equivalent Courses ({completedCourseIds.length} selected)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                {courses.map(c => (
                  <label key={c.id} className="flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60">
                    <input type="checkbox" checked={completedCourseIds.includes(c.id)} onChange={() => toggleCourse(c.id)} />
                    <span className="font-mono font-bold">{c.code}</span>
                    <span className="truncate">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <a href="#/admin/students" className="btn btn-outline">Cancel</a>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : mode === 'regular' ? 'Create Student' : 'Create Transferred Student'}
          </button>
        </div>
      </form>
    </div>
  );
};
