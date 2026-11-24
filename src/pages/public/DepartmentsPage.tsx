/**
 * Public Departments Showcase Page
 *
 * Connected to confirmed public Swagger endpoints:
 * - GET /api/departments/lookup
 * - GET /api/departments/{id}
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import type { DepartmentDetailDto, DepartmentLookupDto } from '../../types/api';
import { PublicHeader } from '../../components/common/PublicHeader';
import { PublicFooter } from '../../components/common/PublicFooter';
import { BottomNav } from '../../components/layout/BottomNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DepartmentsPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [departments, setDepartments] = useState<DepartmentLookupDto[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DepartmentDetailDto | null>(null);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.departments
      .getLookup()
      .then(list => {
        if (cancelled) return;
        setDepartments(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
        }
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to load departments directory.');
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    let cancelled = false;
    api.departments
      .getPublicById(selectedId)
      .then(detail => {
        if (!cancelled) setSelectedDetail(detail);
      })
      .catch(() => {
        if (!cancelled) setSelectedDetail(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleSelect = (id: number) => {
    if (id === selectedId) return;
    setLoadingDetail(true);
    setSelectedId(id);
  };

  const activeLookup = departments.find(d => d.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <PublicHeader activeNav="departments" />

      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-14 overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] -top-28 -left-20 bg-blue-500/15 dark:bg-cyan-500/15" />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] top-1/2 -right-20 bg-cyan-400/15 dark:bg-blue-600/15" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Icon name="layers" size="sm" />
            <span>FCAI BENI SUEF UNIVERSITY · LIVE DEPARTMENTS DIRECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Academic Specializations &amp;{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#0284c7] bg-clip-text text-transparent">
              Departments
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Explore live academic and administrative departments registered in the FCAI BSU platform.
          </p>

          {loadingList ? (
            <div className="pt-6 text-sm text-slate-500">Loading departments...</div>
          ) : error ? (
            <div className="pt-6 max-w-xl mx-auto">
              <div className="alert alert-danger text-sm justify-center">
                <Icon name="alert" size="sm" />
                <span>{error}</span>
              </div>
            </div>
          ) : departments.length === 0 ? (
            <div className="pt-6 text-sm text-slate-500">No departments are currently published.</div>
          ) : (
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              {departments.map(d => {
                const isCurrent = selectedId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelect(d.id)}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'cta-primary scale-105 shadow-lg'
                        : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-cyan-500/25 hover:border-cyan-400/50'
                    }`}
                  >
                    <Icon name="building" size="sm" />
                    <span>{d.code || `#${d.id}`} · {d.nameEn || d.nameAr}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {activeLookup && (
        <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-14 flex-1">
          <div className="max-w-5xl mx-auto">
            <motion.div
              key={activeLookup.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-400/30 space-y-6"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-cyan-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#38bdf8] flex items-center justify-center text-[#021024] shadow-lg font-black text-xl">
                    {selectedDetail?.code || activeLookup.code || 'DEPT'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {selectedDetail?.nameEn || activeLookup.nameEn}
                      </h2>
                      {(selectedDetail?.nameAr || activeLookup.nameAr) && (
                        <span className="text-base text-slate-400 dark:text-cyan-300/80 font-bold">
                          ({selectedDetail?.nameAr || activeLookup.nameAr})
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-cyan-600 dark:text-cyan-300 font-semibold tracking-wide">
                      {selectedDetail?.type || activeLookup.type || 'Department'}
                    </span>
                  </div>
                </div>

                {selectedDetail && (
                  <span className={selectedDetail.isActive ? 'chip chip-primary' : 'chip chip-danger'}>
                    {selectedDetail.isActive ? 'Active Department' : 'Inactive'}
                  </span>
                )}
              </div>

              {loadingDetail ? (
                <p className="text-sm text-slate-500">Loading department details...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card p-5">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Head of Department
                    </span>
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedDetail?.headDoctorNameEn || 'Not assigned yet'}
                    </div>
                    {selectedDetail?.headDoctorNameAr && (
                      <div className="text-sm text-slate-500 dark:text-slate-300 mt-1" dir="rtl">
                        {selectedDetail.headDoctorNameAr}
                      </div>
                    )}
                  </div>
                  <div className="card p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        Course Catalog
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Browse live university courses and curriculum requirements inside the portal.
                      </p>
                    </div>
                    <div className="mt-4">
                      <a
                        href={isAuthenticated ? `#/${role}/courses` : '#/login'}
                        className="cta-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black"
                      >
                        {isAuthenticated ? 'Open Course Catalog' : 'Sign In to Explore Courses'}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <PublicFooter />
      <BottomNav activePath="departments" />
      <MobileDrawer activePath="departments" />
      <ScrollToTop />
    </div>
  );
};
