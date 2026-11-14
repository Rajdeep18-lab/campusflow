import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingModal = () => {
  const { profile, completeOnboarding } = useApp();
  const [name, setName] = useState('');

  if (profile?.isOnboarded) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) completeOnboarding(name.trim());
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(28,27,24,0.6)' }}>
      <div
        className="modal-card"
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-modal)',
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        {/* Brand Icon */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-control)',
          background: 'var(--accent)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 700,
          margin: '0 auto 16px',
        }}>
          C
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          margin: '0 0 6px',
        }}>
          Welcome to CampusFlow
        </h2>
        <p style={{
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          margin: '0 auto 20px',
          maxWidth: 300,
        }}>
          Keep track of your campus expenses and tasks in one quiet, calm place.
        </p>

        {/* Name Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'left' }}>
            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              What is your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rajdeep"
              className="form-input"
              style={{
                width: '100%',
                height: 38,
                padding: '0 12px',
                borderRadius: 'var(--radius-control)',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
              autoFocus
              maxLength={40}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              height: 38,
              borderRadius: 'var(--radius-control)',
              background: 'var(--accent)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
            }}
            disabled={!name.trim()}
          >
            <Sparkles size={15} />
            Get started
          </button>
        </form>

        <p style={{
          fontSize: '0.6875rem',
          color: 'var(--text-muted)',
          marginTop: 16,
          marginBottom: 0,
        }}>
          Data is saved on this device and synced with your account.
        </p>
      </div>
    </div>
  );
};
