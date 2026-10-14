import React from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorCourseContent: React.FC = () => {
  const { showToast } = useAuth();

  const contentModules = [
    {
      module: 'Unit 1: Asymptotic Foundations & Recurrences',
      status: 'Published',
      items: [
        { type: 'Lecture Deck', title: 'Lecture 1: Growth of Functions & Master Theorem', file: 'lec1_slides.pdf', date: 'Oct 01' },
        { type: 'Problem Set', title: 'Assignment 1: Recurrence Tree Proofs', file: 'assign1_spec.pdf', date: 'Oct 03' }
      ]
    },
    {
      module: 'Unit 2: Divide and Conquer Paradigms',
      status: 'Published',
      items: [
        { type: 'Lecture Deck', title: 'Lecture 2: Strassen Matrix Multiplication', file: 'lec2_strassen.pdf', date: 'Oct 08' },
        { type: 'Lab Manual', title: 'Lab 2: Closest Pair Implementation', file: 'lab2_manual.pdf', date: 'Oct 09' }
      ]
    },
    {
      module: 'Unit 3: Dynamic Programming & Memoization',
      status: 'Active (Current)',
      items: [
        { type: 'Lecture Deck', title: 'Lecture 3-4: 0/1 Knapsack & Matrix Chain', file: 'lec3_dp.pdf', date: 'Oct 12' },
        { type: 'Assignment', title: 'Assignment 3: Dynamic Programming Skeleton', file: 'assign3_dp.zip', date: 'Oct 14' }
      ]
    }
  ];

  return (
    <div>
      <PageHead
        title="Screen 45: Course Content Hierarchy Management"
        subtitle="Organize curriculum modules, lecture slides, assignments, and digital resources for CS301"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'CourseOfferings', href: '#/doctor/offerings' },
          { label: 'Content Management' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/lectures" className="btn btn-primary">
              <Icon name="upload" /> Upload Lecture Material
            </a>
          </div>
        }
      />

      <div className="stack gap-4" style={{ maxWidth: '900px' }}>
        {contentModules.map((mod, idx) => (
          <div key={idx} className="card p-5">
            <div className="row-between mb-3">
              <div className="row gap-2">
                <span className="badge badge-primary">Module {idx + 1}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 750 }}>{mod.module}</h3>
              </div>
              <span className={`badge ${mod.status.includes('Active') ? 'badge-warning' : 'badge-success'}`}>
                {mod.status}
              </span>
            </div>

            <div className="stack gap-2">
              {mod.items.map((it, i) => (
                <div key={i} className="card p-3 row-between" style={{ background: 'var(--color-bg-page)' }}>
                  <div className="row gap-2">
                    <Icon name="file" size="sm" />
                    <div>
                      <strong className="text-sm block">{it.title}</strong>
                      <span className="sub text-xs">{it.type} · <code>{it.file}</code> · {it.date}</span>
                    </div>
                  </div>
                  <div className="row gap-1">
                    <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Archived ${it.title}`, 'info')}>
                      Archive
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Editing ${it.title}`, 'info')}>
                      <Icon name="edit" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
