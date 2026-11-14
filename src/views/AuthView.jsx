import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthView = () => {
  const {
    login,
    signup,
    resetPassword,
    authError,
    setAuthError,
  } = useAuth();

  // 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status states
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError('');
    setAuthError?.(null);
    setResetSent(false);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || /[A-Z]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak. Add more characters.', color: '#B42318' };
    if (score === 2) return { score: 2, text: 'Fair. Use 8 or more characters with numbers.', color: '#A06A15' };
    if (score === 3) return { score: 3, text: 'Good. Use 8 or more characters with a number.', color: '#2E7D4F' };
    return { score: 4, text: 'Strong password.', color: '#2E7D4F' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = !confirmPassword || password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError?.(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setLoading(true);
      try {
        await resetPassword(email.trim());
        setResetSent(true);
      } catch (err) {
        setLocalError(err.message || 'Failed to send reset link.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setLocalError('You must agree to the Terms and Privacy Policy.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else if (mode === 'signup') {
        await signup(email.trim(), password, name.trim());
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setLocalError('Google Sign-in can be configured via Firebase Console. Please sign in with email and password.');
  };

  const currentError = localError || authError;

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', background: 'var(--bg)' }}>
      {/* ── Left Brand Panel (Desktop >= 1024px, Pages 7 & 8 in PDF) ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: 560,
          minWidth: 560,
          background: '#1F4D3A',
          color: '#FFFFFF',
          padding: '56px 64px',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 7,
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '16px',
            color: '#FFFFFF',
          }}>
            C
          </div>
          <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            CampusFlow
          </span>
        </div>

        {/* Center Headline & Features */}
        <div style={{ maxWidth: 440 }}>
          <h1 style={{
            fontSize: '34px',
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            marginBottom: 16,
          }}>
            {mode === 'signup'
              ? 'Start the semester in control.'
              : 'One calm place for your money, tasks and deadlines.'}
          </h1>

          <p style={{
            fontSize: '15px',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.82)',
            marginBottom: 32,
          }}>
            {mode === 'signup'
              ? 'Set a budget, add your deadlines and see where your money goes. It takes under a minute to get started.'
              : 'Track every rupee, stay on budget and never miss a submission. Your data stays on your device.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              'Expenses, budget and analytics',
              'Tasks and deadlines in one calendar',
              'Works offline, backup anytime',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '14px', color: '#FFFFFF' }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Check size={12} strokeWidth={2.5} color="#FFFFFF" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)' }}>
          {mode === 'signup' ? 'Free for students. No card needed.' : 'Built for students'}
        </div>
      </div>

      {/* ── Right Form Panel (All Viewports) ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        minHeight: '100vh',
      }}>
        {/* Mobile Header (< 1024px) */}
        <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: 'var(--accent-solid)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '15px',
          }}>
            C
          </div>
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
            CampusFlow
          </span>
        </div>

        {/* Form Container (max-width 380px per handoff) */}
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* ── MODE: FORGOT PASSWORD (Page 9 in PDF) ── */}
          {mode === 'forgot' ? (
            !resetSent ? (
              /* Step 1: Request a link */
              <div className="card" style={{ padding: '24px', border: '1px solid var(--border)' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 7,
                  background: 'var(--accent-tint)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Lock size={18} strokeWidth={2} />
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>
                  Reset your password
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 20 }}>
                  Enter the email you signed up with. We will send you a link to choose a new password.
                </p>

                {currentError && (
                  <div className="form-error" style={{ marginBottom: 14 }}>
                    {currentError}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajdeep@college.edu"
                      className="form-input form-input-auth"
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-auth"
                  >
                    {loading ? 'Sending link…' : 'Send reset link'}
                  </button>
                </form>

                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="card-action-link"
                    style={{ background: 'none', border: 'none', fontSize: '13px' }}
                  >
                    ← Back to sign in
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Confirmation */
              <div className="card" style={{ padding: '24px', border: '1px solid var(--border)' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 7,
                  background: 'var(--accent-tint)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <CheckCircle2 size={20} strokeWidth={2} />
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>
                  Check your email
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  We sent a reset link to <strong style={{ color: 'var(--text)' }}>{email}</strong>. It expires in 60 minutes.
                </p>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: 7,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.45,
                  marginBottom: 20,
                }}>
                  Not there? Check your spam folder, or request another link in a minute.
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-secondary btn-auth"
                  style={{ width: '100%', marginBottom: 14 }}
                >
                  {loading ? 'Sending…' : 'Resend email'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="card-action-link"
                    style={{ background: 'none', border: 'none', fontSize: '13px' }}
                  >
                    ← Back to sign in
                  </button>
                </div>
              </div>
            )
          ) : (
            /* ── MODES: SIGN IN & SIGN UP (Pages 7 & 8 in PDF) ── */
            <div>
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>
                  {mode === 'login' ? 'Sign in to continue to CampusFlow.' : 'Get set up in under a minute.'}
                </p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                className="btn btn-secondary btn-auth"
                style={{ width: '100%', gap: 10, background: 'var(--surface)', fontWeight: 500 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
              </button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '20px 0',
                color: 'var(--text-disabled)',
                fontSize: '12px',
              }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span>{mode === 'login' ? 'or sign in with email' : 'or use your email'}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              {/* Error banner */}
              {currentError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 7,
                  background: 'rgba(180, 35, 24, 0.08)',
                  border: '1px solid rgba(180, 35, 24, 0.25)',
                  color: 'var(--danger)',
                  fontSize: '13px',
                  lineHeight: 1.4,
                  marginBottom: 16,
                }}>
                  {currentError}
                </div>
              )}

              {/* Form fields */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajdeep Singh"
                      className="form-input form-input-auth"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajdeep@college.edu"
                    className="form-input form-input-auth"
                    required
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="card-action-link"
                        style={{ background: 'none', border: 'none', fontSize: '12px' }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="form-input form-input-auth"
                      style={{ paddingRight: 40 }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="btn-icon"
                      style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30 }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Password strength indicator (Sign Up, Page 8 in PDF) */}
                  {mode === 'signup' && password.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: 'flex', gap: 4, height: 3, marginBottom: 6 }}>
                        {[1, 2, 3, 4].map(step => (
                          <div
                            key={step}
                            style={{
                              flex: 1,
                              borderRadius: 2,
                              background: step <= strength.score ? strength.color : 'var(--surface-2)',
                              transition: 'background 0.2s',
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: '11px', color: strength.color }}>
                        {strength.text}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password field (Sign Up) */}
                {mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label">Confirm password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`form-input form-input-auth${!passwordsMatch ? ' error' : ''}`}
                      required
                    />
                    {!passwordsMatch && (
                      <div className="form-error" style={{ marginTop: 2 }}>
                        ⓘ Passwords do not match.
                      </div>
                    )}
                  </div>
                )}

                {/* Checkbox row */}
                {mode === 'login' ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'var(--text)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ width: 16, height: 16, borderRadius: 4, accentColor: 'var(--accent-solid)' }}
                    />
                    <span>Remember me</span>
                  </label>
                ) : (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'var(--text)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      style={{ width: 16, height: 16, borderRadius: 4, accentColor: 'var(--accent-solid)' }}
                    />
                    <span>I agree to the Terms and Privacy Policy.</span>
                  </label>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-auth"
                  style={{ width: '100%', marginTop: 4 }}
                >
                  {loading
                    ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
                    : (mode === 'login' ? 'Sign in' : 'Create account')}
                </button>
              </form>

              {/* Bottom switch link */}
              <div style={{ marginTop: 20, textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                {mode === 'login' ? (
                  <>
                    New to CampusFlow?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="card-action-link"
                      style={{ background: 'none', border: 'none', color: 'var(--accent-solid)', fontWeight: 600 }}
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="card-action-link"
                      style={{ background: 'none', border: 'none', color: 'var(--accent-solid)', fontWeight: 600 }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
