import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../icons/Icon';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalTone = 'default' | 'info' | 'warning' | 'danger' | 'success';

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  iconName?: string;
  tone?: ModalTone;
  size?: ModalSize;
  busy?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const SIZE_WIDTH: Record<ModalSize, string> = {
  sm: '440px',
  md: '540px',
  lg: '680px',
  xl: '820px',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconName,
  tone = 'default',
  size = 'md',
  busy = false,
  footer,
  children,
}) => {
  const visible = Boolean(open ?? isOpen);
  const resolvedIcon = icon ?? iconName;

  useEffect(() => {
    if (!visible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, busy, onClose]);

  if (!visible) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        className="modal"
        style={{ maxWidth: SIZE_WIDTH[size] }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-head-bar">
          <div className="flex items-start gap-3 min-w-0">
            {resolvedIcon && (
              <div className={`modal-head-icon ${tone === 'danger' || tone === 'warning' ? 'danger' : ''}`}>
                <Icon name={resolvedIcon} size="md" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-bold leading-snug">{title}</h3>
              {subtitle && <p className="text-xs muted mt-0.5 leading-relaxed">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close modal"
            disabled={busy}
            onClick={onClose}
          >
            <Icon name="x" size="sm" />
          </button>
        </div>

        <div className="modal-body-scroll">{children}</div>

        {footer && <div className="modal-foot-bar">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
