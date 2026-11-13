import React, { useState } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(13, 17, 23, 0.92)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      padding: 24,
      animation: 'overlayIn 0.3s ease forwards',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-2xl)',
        width: '100%',
        maxWidth: 420,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        animation: 'modalIn 0.35s var(--ease-spring) forwards',
        textAlign: 'center',
      }}>
        {/* Top accent bar */}
        <div style={{
          height: 4,
          background: 'var(--accent)',
        }} />

        <div style={{ padding: '32px 24px' }}>
          {/* Icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-2xl)',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(31,77,58,0.25)',
          }}>
            <GraduationCap size={32} color="#FFFFFF" strokeWidth={2} />
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 8,
            lineHeight: 1.2,
          }}>
            Welcome to CampusFlow
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: 24,
            maxWidth: 320,
            margin: '0 auto 24px',
          }}>
            Your personal hub for tracking expenses and managing tasks — beautifully, privately, offline.
          </p>

          {/* Name form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">What should we call you?</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your first name..."
                className="form-input"
                style={{ fontSize: '0.9375rem', textAlign: 'center' }}
                autoFocus
                maxLength={40}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ marginTop: 4 }}
              disabled={!name.trim()}
            >
              <Sparkles size={16} strokeWidth={2} />
              Get Started →
            </button>
          </form>

          {/* Footer note */}
          <p style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            marginTop: 20,
            lineHeight: 1.5,
          }}>
            100% offline · All data stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
};
