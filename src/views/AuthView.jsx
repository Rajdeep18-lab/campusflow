import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthView = () => {
  const {
    login,
    signup,
    resetPassword,
    authError,
    setAuthError,
    isFirebaseConfigured,
  } = useAuth();

  // 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Theme toggle state (sync with document theme)
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  });

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    setIsDark(!isDark);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError('');
    setAuthError?.(null);
    setResetSent(false);
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Please enter your email address.';
    }
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address (e.g. student@college.edu).';
    }

    if (mode === 'forgot') return null;

    if (!password) {
      return 'Please enter your password.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        return 'Passwords do not match.';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError?.(null);

    const validationMsg = validate();
    if (validationMsg) {
      setLocalError(validationMsg);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'signup') {
        await signup(email, password, name);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const currentError = localError || authError;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting effects */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(232, 163, 61, 0.14) 0%, rgba(108, 142, 245, 0.08) 50%, transparent 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '400px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(52, 199, 123, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top bar controls */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {isDark ? (
            <Sun size={17} color="var(--accent)" strokeWidth={2.2} />
          ) : (
            <Moon size={17} color="var(--accent)" strokeWidth={2.2} />
          )}
        </button>
      </div>

      {/* Main Auth Container */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          zIndex: 1,
          animation: 'modalIn 0.35s var(--ease-spring) forwards',
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-xl)',
              background: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              boxShadow: '0 8px 24px var(--accent-glow)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h10a6 6 0 0 1 0 12H4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12h7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.625rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            CampusFlow
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Smart student hub for expenses, budgets & tasks
          </p>
        </div>

        {/* Firebase Config Notice banner if environment variables are not yet setup */}
        {!isFirebaseConfigured && (
          <div
            style={{
              marginBottom: 18,
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              lineHeight: 1.45,
            }}
          >
            <AlertCircle size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong>Firebase Setup Note:</strong> Environment variables (<code>VITE_FIREBASE_API_KEY</code>, etc.) are not yet defined.
              Check the <code>.env.example</code> file to connect your Firebase project.
            </div>
          </div>
        )}

        {/* Auth Card */}
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-base)',
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              height: 4,
              background: 'var(--accent)',
            }}
          />

          {/* Mode Switcher Tabs (Login vs Signup) */}
          {mode !== 'forgot' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderBottom: '1px solid var(--border-base)',
                background: 'var(--bg-secondary)',
              }}
            >
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{
                  padding: '14px 16px',
                  background: mode === 'login' ? 'var(--bg-card)' : 'transparent',
                  color: mode === 'login' ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: mode === 'login' ? '2px solid var(--accent)' : '2px solid transparent',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                style={{
                  padding: '14px 16px',
                  background: mode === 'signup' ? 'var(--bg-card)' : 'transparent',
                  color: mode === 'signup' ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: mode === 'signup' ? '2px solid var(--accent)' : '2px solid transparent',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Card Body */}
          <div style={{ padding: '28px 24px' }}>
            {/* Header info */}
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1875rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: 4,
                }}
              >
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h2>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
                {mode === 'login' && 'Sign in to access your expenses, tasks and analytics.'}
                {mode === 'signup' && 'Start organizing your college budget and campus workflow.'}
                {mode === 'forgot' && 'Enter your registered email and we will send a reset link.'}
              </p>
            </div>

            {/* Error banner */}
            {currentError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-danger-bg)',
                  border: '1px solid rgba(229, 72, 77, 0.35)',
                  color: 'var(--color-danger)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.45,
                  marginBottom: 18,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{currentError}</span>
              </div>
            )}

            {/* Password Reset Confirmation Banner */}
            {resetSent && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-success-bg)',
                  border: '1px solid rgba(52, 199, 123, 0.35)',
                  color: 'var(--color-success)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  marginBottom: 18,
                }}
              >
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <strong>Reset link dispatched!</strong> Please check your inbox for instructions to reset your password.
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Name field for signup */}
              {mode === 'signup' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-name">
                    Full Name / Nickname
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                        display: 'flex',
                      }}
                    >
                      <User size={16} />
                    </div>
                    <input
                      id="auth-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alex Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ paddingLeft: 38, fontSize: '0.875rem' }}
                      autoComplete="name"
                      maxLength={50}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
                      display: 'flex',
                    }}
                  >
                    <Mail size={16} />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    className="form-input"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: 38, fontSize: '0.875rem' }}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password fields for Login and Signup */}
              {mode !== 'forgot' && (
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="auth-password" style={{ marginBottom: 0 }}>
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '0.75rem',
                          color: 'var(--accent)',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative', marginTop: 6 }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                        display: 'flex',
                      }}
                    >
                      <Lock size={16} />
                    </div>
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: 38, paddingRight: 38, fontSize: '0.875rem' }}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        padding: 4,
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password field for Signup */}
              {mode === 'signup' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-confirm-password">
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                        display: 'flex',
                      }}
                    >
                      <Lock size={16} />
                    </div>
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingLeft: 38, paddingRight: 38, fontSize: '0.875rem' }}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 6,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px var(--accent-glow)',
                  transition: 'all 0.15s ease',
                }}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg
                      style={{ animation: 'spin 1s linear infinite' }}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" />
                    </svg>
                    Please wait...
                  </span>
                ) : (
                  <>
                    {mode === 'login' && (
                      <>
                        Sign In <ArrowRight size={16} strokeWidth={2.5} />
                      </>
                    )}
                    {mode === 'signup' && (
                      <>
                        Create Account <Sparkles size={16} strokeWidth={2.5} />
                      </>
                    )}
                    {mode === 'forgot' && (
                      <>
                        Send Reset Link <KeyRound size={16} strokeWidth={2.5} />
                      </>
                    )}
                  </>
                )}
              </button>

              {/* Forgot password back link */}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 0',
                    textAlign: 'center',
                  }}
                >
                  ← Back to Sign In
                </button>
              )}
            </form>
          </div>

          {/* Footer notice */}
          <div
            style={{
              padding: '14px 24px',
              background: 'var(--bg-tertiary)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Secure Firebase Authentication · UID Scoped Data</span>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
            marginTop: 20,
          }}
        >
          {['🔒 Isolated Data', '⚡ Offline First', '📊 Expense Hub', '🎯 Smart Tasks'].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                borderRadius: 20,
                padding: '4px 10px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

