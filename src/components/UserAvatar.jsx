import React from 'react';
import { useApp } from '../context/AppContext';

const sizeMap = {
  sm: { box: 32, text: '0.75rem', font: 700, border: 2 },
  md: { box: 38, text: '0.875rem', font: 700, border: 2 },
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
        background: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'var(--font-heading)',
        fontSize: s.text,
        fontWeight: s.font,
        border: `${s.border}px solid var(--accent-border)`,
        boxShadow: '0 2px 6px var(--accent-glow)',
        userSelect: 'none',
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {initial}
    </div>
  );
};
