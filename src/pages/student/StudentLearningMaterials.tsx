import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const StudentLearningMaterials: React.FC = () => {
  const { showToast } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('CS301');

  useEffect(() => {
    fakeApi.getLearningMaterials(selectedCourse).then(res => {
      setMaterials(res);
      setLoading(false);
    });
  }, [selectedCourse]);

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 19: Course Learning Materials &amp; Lecture Slides"
        subtitle="Official course handouts, weekly presentation decks, lab exercise manuals, and code samples"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Learning Materials' }
        ]}
      />

      {/* Course Filter Bar */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <span className="sub">Select Course:</span>
            <select
              className="select"
              style={{ width: 'auto' }}
              value={selectedCourse}
              onChange={e => { setLoading(true); setSelectedCourse(e.target.value); }}
            >
              <option value="CS301">CS301 · Design &amp; Analysis of Algorithms</option>
              <option value="IS305">IS305 · Database Systems II</option>
              <option value="AI302">AI302 · Machine Learning Fundamentals</option>
              <option value="CS305">CS305 · Operating Systems Internals</option>
            </select>
          </div>
          <div className="chip chip-info">{materials.length} Documents Available</div>
        </div>
      </div>

      {/* Materials List */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Week / Unit</th>
                <th>Lecture / Material Title</th>
                <th>File Format</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.id}>
                  <td><span className="badge badge-primary">{m.week}</span></td>
                  <td>
                    <div className="bold">{m.title}</div>
                    <code className="text-xs sub">{m.file}</code>
                  </td>
                  <td>
                    <span className="chip chip-neutral" style={{ fontSize: '11px' }}>
                      <Icon name="file" size="sm" /> PDF Document
                    </span>
                  </td>
                  <td className="sub text-xs">{m.size}</td>
                  <td className="sub text-xs">{m.uploadDate}</td>
                  <td>
                    <div className="row gap-1">
                      <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Opening ${m.file} in browser viewer...`, 'info')}>
                        <Icon name="eye" /> View
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Downloading ${m.file}...`, 'success')}>
                        <Icon name="download" /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
