import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminRegulations: React.FC = () => {
  const { showToast } = useAuth();
  const [regulations, setRegulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');

  useEffect(() => {
    fakeApi.getAdminRegulations().then(res => {
      setRegulations(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    const newDoc = {
      id: `reg_${Date.now()}`,
      title: docTitle,
      version: 'v1.0',
      effectiveYear: '2026–Present',
      status: 'Active',
      pages: 18,
      description: 'Institutional policy uploaded for AI RAG embedding and student portal grounding.'
    };
    setRegulations(prev => [newDoc, ...prev]);
    showToast(`Uploaded "${docTitle}" into AI Knowledge Base.`, 'success');
    setShowUploadModal(false);
    setDocTitle('');
  };

  return (
    <div>
      <PageHead
        title="Faculty Bylaws &amp; RAG Knowledge Base"
        subtitle="Manage official college regulatory documents feeding the AI Academic Advisor and student portal"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Regulations' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            <Icon name="upload" /> Upload Bylaw PDF
          </button>
        }
      />

      <div className="alert alert-info mb-5">
        <Icon name="info" />
        <div>
          <strong>Strict Grounding Guarantee:</strong> The student AI Study Assistant and Academic Advisor are strictly bounded by the documents hosted in this repository. Hallucinated answers outside these approved PDFs are suppressed.
        </div>
      </div>

      <div className="grid g-2">
        {regulations.map(reg => (
          <div key={reg.id} className="card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="row-between mb-3">
                <span className="badge badge-primary">{reg.version}</span>
                <span className="badge badge-success">{reg.status}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{reg.title}</h3>
              <p className="sub text-xs mb-4">{reg.description}</p>

              <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)', fontSize: '12px' }}>
                <div className="row-between mb-1">
                  <span className="sub">Effective Period:</span>
                  <strong>{reg.effectiveYear}</strong>
                </div>
                <div className="row-between">
                  <span className="sub">Document Extent:</span>
                  <strong>{reg.pages} Pages (Indexed for RAG)</strong>
                </div>
              </div>
            </div>

            <div className="row gap-2">
              <button className="btn btn-secondary btn-sm flex-1" onClick={() => showToast(`Indexing vector embeddings for ${reg.title}`, 'info')}>
                <Icon name="activity" /> Re-index Vectors
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Downloading ${reg.title}`, 'info')}>
                <Icon name="download" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-head">
              <h3>Upload Regulation Document</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowUploadModal(false)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-4">
              <div className="form-group mb-3">
                <label className="form-label">Document Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. FCAI BSU Disciplinary Code 2026"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">PDF File (&lt; 25MB)</label>
                <div className="file-drop-area p-5 text-center border-dashed">
                  <Icon name="upload" size="md" className="mb-2" />
                  <div className="bold text-xs">Click or drag official PDF here</div>
                  <div className="sub text-xs">Vector chunking occurs automatically upon upload</div>
                </div>
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
