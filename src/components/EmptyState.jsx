import React from 'react';
import { Plus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state animate-fade-in">
      {Icon && (
        <div className="empty-icon-wrap">
          <Icon size={30} color="var(--accent)" strokeWidth={1.6} />
        </div>
      )}

      <h3 style={{
        fontSize: '1.0625rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
        marginBottom: 8,
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        maxWidth: 380,
        lineHeight: 1.65,
        marginBottom: actionLabel ? 24 : 0,
      }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          <Plus size={14} strokeWidth={2.5} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
