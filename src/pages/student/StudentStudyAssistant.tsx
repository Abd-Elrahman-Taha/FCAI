import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import type { StudyDocument, ChatMessage } from '../../types';

export const StudentStudyAssistant: React.FC = () => {
  const { showToast } = useAuth();
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<StudyDocument | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fakeApi.getStudyDocuments().then(docs => {
      setDocuments(docs);
      if (docs.length > 0) {
        handleSelectDoc(docs[0]);
      }
    });
  }, []);

  const handleSelectDoc = async (doc: StudyDocument) => {
    setActiveDoc(doc);
    const chat = await fakeApi.getPdfChat(doc.id);
    setMessages(chat);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || !activeDoc || isSending) return;

    setInputMsg('');
    setIsSending(true);

    // Optimistically show user message
    const tempUserMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const aiReply = await fakeApi.sendPdfChatMessage(activeDoc.id, text);
      setMessages(prev => [...prev, aiReply]);
    } catch (err: any) {
      showToast('Error', 'Failed to generate study answer.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Invalid File Type', 'The Study Assistant only accepts PDF documents.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File Too Large', 'Maximum allowed PDF size is 10 MB.', 'error');
      return;
    }

    setUploadLoading(true);
    try {
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const created = await fakeApi.uploadStudyPdf(file.name, sizeStr);
      setDocuments(prev => [created, ...prev]);
      handleSelectDoc(created);
      showToast('PDF Indexed', `Loaded ${created.title} into AI Study Tutor.`, 'success');
    } catch (err: any) {
      showToast('Error', 'Could not upload PDF.', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div>
      <PageHead
        title="AI Student Study Assistant"
        desc="Interactive PDF study tutor constrained strictly to official course lecture documents."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Study Assistant']]}
      />

      {/* PDF Scope Rule Banner */}
      <div className="alert alert-info mb-6">
        <Icon name="shieldCheck" />
        <div>
          <b>Strict Document Grounding Guarantee:</b>
          <p>
            This AI tutor answers strictly from the text within your uploaded PDF lecture slides. It does not pull unverified general internet responses. If a topic is not in the PDF, it will explicitly inform you.
          </p>
        </div>
      </div>

      <div className="grid g-main" style={{ alignItems: 'start' }}>
        {/* Left: Chat Window */}
        <div className="card col" style={{ minHeight: '620px', height: 'calc(100vh - 260px)' }}>
          {/* Chat Header */}
          <div className="card-head" style={{ background: 'var(--surface-2)' }}>
            {activeDoc ? (
              <div className="row gap-3">
                <div className="file-ico doc">PDF</div>
                <div>
                  <b style={{ fontSize: '14px' }}>{activeDoc.title}</b>
                  <div className="text-xs muted">
                    {activeDoc.pageCount} Pages • {activeDoc.fileSize} • Uploaded {activeDoc.uploadDate}
                  </div>
                </div>
              </div>
            ) : (
              <b>Select a document to begin</b>
            )}
            <span className="badge b-success no-dot">Context Ready</span>
          </div>

          {/* Chat Messages Log */}
          <div
            className="card-body"
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '20px'
            }}
          >
            {messages.length === 0 ? (
              <div className="state py-8">
                <div className="state-art info"><Icon name="sparkles" size="xl" /></div>
                <h3>Ask Anything from {activeDoc?.title}</h3>
                <p className="text-xs muted">
                  Use the quick action prompts below or ask specific questions about algorithms, definitions, or code.
                </p>
              </div>
            ) : (
              messages.map(m => (
                <div
                  key={m.id}
                  className={`chat-bubble ${m.sender === 'student' ? 'me' : 'ai'}`}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
                  {m.citation && (
                    <div className="mt-2">
                      <span className="cite"><Icon name="book" size="sm" /> Citation: {m.citation}</span>
                    </div>
                  )}
                  <div className="chat-meta text-right">{m.timestamp}</div>
                </div>
              ))
            )}

            {isSending && (
              <div className="chat-bubble ai row gap-2" style={{ width: 'fit-content' }}>
                <span className="spinner" style={{ width: '16px', height: '16px' }} />
                <span className="text-xs muted">Searching PDF text &amp; formulating verified answer…</span>
              </div>
            )}
          </div>

          {/* Quick Action Prompt Chips */}
          <div style={{ padding: '8px 16px', background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
            <div className="row gap-2 wrap">
              <span className="text-xs muted fw-6">Quick Prompts:</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', height: '26px', padding: '0 8px', background: '#fff', border: '1px solid var(--border)' }}
                onClick={() => handleSendMessage('Summarize this PDF')}
              >
                Summarize this PDF
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', height: '26px', padding: '0 8px', background: '#fff', border: '1px solid var(--border)' }}
                onClick={() => handleSendMessage('Explain the core algorithm with complexity analysis')}
              >
                Explain core algorithm
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', height: '26px', padding: '0 8px', background: '#fff', border: '1px solid var(--border)' }}
                onClick={() => handleSendMessage('Generate expected examination questions')}
              >
                Generate expected exam questions
              </button>
            </div>
          </div>

          {/* Chat Input Field */}
          <form
            className="row gap-2"
            style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              className="input"
              placeholder={`Ask a question grounded exclusively in ${activeDoc?.title || 'this PDF'}…`}
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              disabled={isSending || !activeDoc}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!inputMsg.trim() || isSending || !activeDoc}
            >
              <Icon name="send" />
            </button>
          </form>
        </div>

        {/* Right: Uploaded Study Documents Catalog */}
        <div className="col gap-4">
          <div className="card card-pad">
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
              Upload Study Material
            </h3>
            <p className="text-xs muted mb-4">
              Upload PDF lecture slides (Max 10 MB). Once uploaded, documents cannot be replaced if chat history exists.
            </p>

            <label className="upload" style={{ padding: '20px' }}>
              <div className="u-ico" style={{ width: '40px', height: '40px', margin: '0 auto 8px' }}>
                <Icon name="uploadCloud" size="md" />
              </div>
              <b style={{ fontSize: '13px' }}>{uploadLoading ? 'Indexing PDF…' : 'Upload New Course PDF'}</b>
              <p className="text-xs muted mt-1">PDF format only (Max 10MB)</p>
              <input
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleUploadPdf}
                disabled={uploadLoading}
              />
            </label>
          </div>

          <div className="card">
            <div className="card-head">
              <h3><Icon name="files" size="sm" /> My Study Documents ({documents.length})</h3>
            </div>
            <div className="list">
              {documents.map(doc => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    className="list-item hover cursor-pointer"
                    style={{
                      background: isSelected ? 'var(--blue-50)' : undefined,
                      borderLeft: isSelected ? '3px solid var(--navy-800)' : undefined
                    }}
                    onClick={() => handleSelectDoc(doc)}
                  >
                    <div className="file-ico doc">PDF</div>
                    <div className="li-main">
                      <b>{doc.title}</b>
                      <span>{doc.fileSize} • {doc.pageCount} Pages • {doc.uploadDate}</span>
                    </div>
                    {isSelected && <span className="badge b-info no-dot">Active</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
