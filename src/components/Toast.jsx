import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICON_MAP = {
  success: { Icon: CheckCircle2, color: 'var(--color-success)' },
  danger:  { Icon: AlertCircle,  color: 'var(--color-danger)' },
  info:    { Icon: Info,         color: 'var(--color-info)' },
};

export const Toast = () => {
  const { toastMessage } = useApp();
  if (!toastMessage) return null;

  const type = toastMessage.type || 'success';
  const config = ICON_MAP[type] || ICON_MAP.success;
  const { Icon, color } = config;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        className="toast"
        role="alert"
        aria-live="polite"
        style={{
          borderLeft: `3px solid ${color}`,
          pointerEvents: 'auto',
        }}
      >
        <Icon
          size={16}
          color={color}
          strokeWidth={2.2}
          style={{ flexShrink: 0 }}
        />
        <span style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
        }}>
          {toastMessage.message}
        </span>
      </div>
    </div>
  );
};
