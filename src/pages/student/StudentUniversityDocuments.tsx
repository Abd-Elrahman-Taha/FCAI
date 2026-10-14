import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const StudentUniversityDocuments: React.FC = () => {
  const { showToast } = useAuth();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getUniversityDocuments().then(res => {
      setDocs(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={3} />;

  return (
    <div>
      <PageHead
        title="Screen 36: Official University Documents &amp; Certificates"
        subtitle="Repository of signed student certificates, transcripts, and official letters issued by the Dean Office"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Official Documents' }
        ]}
      />

      <div className="grid g-3">
        {docs.map(doc => (
          <div key={doc.id} className="card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="row-between mb-3">
                <span className="badge badge-primary">{doc.type}</span>
                <span className="badge badge-success">{doc.status}</span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>{doc.title}</h3>
              <p className="sub text-xs mb-3">Issued by Dean Executive Office · Sealed &amp; QR Verified</p>

              <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)', fontSize: '12px' }}>
                <div className="row-between mb-1">
                  <span className="sub">Date of Issue:</span>
                  <strong>{doc.issueDate}</strong>
                </div>
                <div className="row-between">
                  <span className="sub">Digital File:</span>
                  <code>{doc.file}</code>
                </div>
              </div>
            </div>

            <div className="row gap-2">
              <button className="btn btn-secondary btn-sm flex-1" onClick={() => showToast(`Opening certified viewer for ${doc.title}...`, 'info')}>
                <Icon name="eye" /> View Certified
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => showToast(`Downloading signed ${doc.file}...`, 'success')}>
                <Icon name="download" /> Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
