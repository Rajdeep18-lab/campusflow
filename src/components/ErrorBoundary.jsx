import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary — catches any JS runtime error and shows a recovery screen
 * instead of a blank white/dark screen.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[CampusFlow] App crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {/* Logo */}
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg, #059669, #0F766E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 8px 32px rgba(5,150,105,0.35)',
        }}>
          <span style={{ fontSize: 28 }}>📚</span>
        </div>

        <h2 style={{
          fontSize: '1.25rem', fontWeight: 800,
          color: '#F1F5F9', marginBottom: 8, letterSpacing: '-0.03em',
        }}>
          Something went wrong
        </h2>
        <p style={{
          fontSize: '0.875rem', color: '#64748B',
          lineHeight: 1.6, marginBottom: 24, maxWidth: 300,
        }}>
          CampusFlow ran into an issue. Your data is safe — tap below to reload.
        </p>

        <button
          onClick={() => window.location.reload()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg, #059669, #0F766E)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: '0.9375rem', fontWeight: 700,
            boxShadow: '0 4px 16px rgba(5,150,105,0.4)',
          }}
        >
          <RefreshCw size={16} /> Reload App
        </button>

        <p style={{ fontSize: '0.6875rem', color: '#334155', marginTop: 16 }}>
          Error: {this.state.error?.message || 'Unknown error'}
        </p>
      </div>
    );
  }
}
