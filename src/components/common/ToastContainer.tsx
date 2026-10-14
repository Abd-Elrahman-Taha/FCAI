import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../icons/Icon';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="toasts" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''}`}>
          <div className="t-ico">
            <Icon
              name={t.type === 'error' ? 'alertCircle' : t.type === 'info' ? 'info' : 'checkCircle'}
              size="sm"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{t.title}</b>
            <p>{t.message}</p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 0, color: 'rgba(255,255,255,.6)', cursor: 'pointer', padding: 0 }}
            aria-label="Close notification"
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
      ))}
    </div>
  );
};
