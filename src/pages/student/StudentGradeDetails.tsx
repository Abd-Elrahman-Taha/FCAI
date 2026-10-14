import React from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';

export const StudentGradeDetails: React.FC = () => {
  const courseGrade = {
    courseCode: 'CS301',
    courseName: 'Design & Analysis of Algorithms',
    credits: 3,
    instructor: 'Dr. Mona Abdelrahman',
    totalObtained: 94,
    totalMax: 100,
    letterGrade: 'A',
    gradePoints: 3.7,
    status: 'Official Dean Approved & Published',
    components: [
      { name: 'Midterm Written Examination', obtained: 18, max: 20, weight: '20%', evaluator: 'Dr. Mona Abdelrahman' },
      { name: 'Practical Lab Exam & Quizzes', obtained: 19, max: 20, weight: '20%', evaluator: 'Eng. Youssef Khaled (TA)' },
      { name: 'Assignments & Coursework Tasks', obtained: 15, max: 15, weight: '15%', evaluator: 'TA / Doctor' },
      { name: 'Attendance & Class Engagement', obtained: 5, max: 5, weight: 'Compulsory 75% Rule', evaluator: 'QR Session Logs' },
      { name: 'Final Written Assessment', obtained: 37, max: 40, weight: '40%', evaluator: 'Control Committee' }
    ],
    scaleReference: [
      { letter: 'A+', range: '95–100%', points: 4.0 },
      { letter: 'A', range: '90–94%', points: 3.7 },
      { letter: 'B+', range: '85–89%', points: 3.3 },
      { letter: 'B', range: '80–84%', points: 3.0 },
      { letter: 'C+', range: '75–79%', points: 2.7 },
      { letter: 'C', range: '70–74%', points: 2.4 },
      { letter: 'D', range: '60–69%', points: 2.0 },
      { letter: 'F', range: '< 60%', points: 0.0 }
    ]
  };

  return (
    <div>
      <PageHead
        title={`Screen 27: Course Grade Breakdown · ${courseGrade.courseCode}`}
        subtitle={`${courseGrade.courseName} · Lead: ${courseGrade.instructor}`}
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Grades', href: '#/student/grades' },
          { label: courseGrade.courseCode }
        ]}
      />

      {/* Grade Hero Card */}
      <div className="card p-5 mb-5" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <div className="row-between wrap gap-3">
          <div>
            <span className="badge badge-success mb-2">{courseGrade.status}</span>
            <h2 style={{ fontSize: '22px', fontWeight: 750 }}>
              {courseGrade.courseCode} · {courseGrade.courseName}
            </h2>
            <div className="sub text-xs mt-1">3.0 Credit Hours · Fall 2026 Academic Term</div>
          </div>
          <div className="text-right">
            <span className="sub text-xs block">Final Letter Grade</span>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)' }}>
              {courseGrade.letterGrade}
            </div>
            <div className="bold text-sm">{courseGrade.totalObtained} / {courseGrade.totalMax} ({courseGrade.gradePoints} Points)</div>
          </div>
        </div>
      </div>

      <div className="grid g-3 mb-6">
        <div className="col-span-2">
          {/* Detailed Component Breakdown */}
          <div className="card p-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
              Assessment Component Scores
            </h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Obtained Marks</th>
                    <th>Max Marks</th>
                    <th>Weight</th>
                    <th>Evaluated By</th>
                  </tr>
                </thead>
                <tbody>
                  {courseGrade.components.map(c => (
                    <tr key={c.name}>
                      <td className="bold">{c.name}</td>
                      <td>
                        <strong style={{ fontSize: '15px', color: 'var(--color-primary)' }}>
                          {c.obtained}
                        </strong>
                      </td>
                      <td>{c.max} pts</td>
                      <td><span className="badge badge-neutral">{c.weight}</span></td>
                      <td className="sub text-xs">{c.evaluator}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--color-bg-subtle)', fontWeight: 700 }}>
                    <td>Total Composite Score</td>
                    <td style={{ color: 'var(--color-primary)', fontSize: '16px' }}>{courseGrade.totalObtained}</td>
                    <td>{courseGrade.totalMax} pts</td>
                    <td>100%</td>
                    <td>Official Grade Package</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          {/* Institutional Grade Scale Reference */}
          <div className="card p-5">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
              BSU Credit Hour Grading Scale
            </h4>
            <div className="table-responsive">
              <table className="table compact">
                <thead>
                  <tr>
                    <th>Letter</th>
                    <th>Percentage</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {courseGrade.scaleReference.map(s => (
                    <tr key={s.letter} style={{ background: s.letter === courseGrade.letterGrade ? 'var(--color-bg-subtle)' : 'transparent' }}>
                      <td className="bold">{s.letter}</td>
                      <td>{s.range}</td>
                      <td>{s.points.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
