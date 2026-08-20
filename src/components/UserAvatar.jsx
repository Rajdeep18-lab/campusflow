import React from 'react';
import { useApp } from '../context/AppContext';

const sizeMap = {
  sm: { box: 30, text: '0.75rem', font: 600, border: 2 },
  md: { box: 36, text: '0.875rem', font: 700, border: 2 },
  lg: { box: 56, text: '1.25rem', font: 700, border: 2 },
  xl: { box: 80, text: '2rem', font: 800, border: 2.5 },
};

export const UserAvatar = ({ size = 'md', className = '' }) => {
  const { profile } = useApp();
  const name = profile?.name || 'Student';
  const avatarUrl = profile?.avatarUrl;
  const initial = name.trim().charAt(0).toUpperCase() || 'S';
  const s = sizeMap[size] || sizeMap.md;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={className}
        style={{
          width: s.box,
          height: s.box,
          borderRadius: '50%',
          objectFit: 'cover',
          border: `${s.border}px solid var(--accent-border)`,
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      title={name}
      className={className}
      style={{
        width: s.box,
        height: s.box,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E8A33D, #d9922c)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0F172A',
        fontFamily: 'var(--font-heading)',
        fontSize: s.text,
        fontWeight: s.font,
        border: `${s.border}px solid rgba(232, 163, 61, 0.4)`,
        userSelect: 'none',
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {initial}
    </div>
  );
};
