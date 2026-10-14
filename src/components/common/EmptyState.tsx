import React from 'react';
import { Icon } from '../icons/Icon';

interface EmptyStateProps {
  iconName?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  tone?: 'info' | 'warning' | 'danger' | 'success';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'inbox',
  title,
  description,
  actionText,
  onAction,
  tone = 'info'
}) => {
  return (
    <div className="state">
      <div className={`state-art ${tone === 'info' ? '' : tone}`}>
        <Icon name={iconName} size="xl" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary mt-4" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
