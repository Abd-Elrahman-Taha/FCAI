import React, { useEffect } from 'react';
import { Icon } from '../icons/Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  iconName?: string;
  tone?: 'info' | 'danger' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  iconName = 'info',
  tone = 'info',
  size = 'md',
  children,
  footer
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal ${size === 'lg' ? 'lg' : ''}`}>
        <div className="modal-head">
          <div className={`modal-ico ${tone}`}>
            <Icon name={iconName} size="md" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="x" size="sm" />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};
