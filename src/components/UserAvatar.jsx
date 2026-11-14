import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const sizeMap = {
  sm: { box: 32, text: '0.75rem', font: 700 },
  md: { box: 38, text: '0.875rem', font: 700 },
  lg: { box: 56, text: '1.25rem', font: 700 },
  xl: { box: 72, text: '1.75rem', font: 700 },
};

export const UserAvatar = ({ size = 'md', className = '' }) => {
  const { profile } = useApp();
  const { currentUser } = useAuth();

  const name = profile?.name || currentUser?.displayName || 'Student';
  const avatarUrl = profile?.avatarUrl || currentUser?.photoURL;
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
          border: '1px solid var(--border)',
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
        fontSize: s.text,
        fontWeight: s.font,
        border: '1px solid var(--border)',
        userSelect: 'none',
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {initial}
    </div>
  );
};
