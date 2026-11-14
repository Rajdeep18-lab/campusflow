import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Key,
  LogOut,
  Camera,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const ProfileView = () => {
  const { profile, updateProfile, showToast } = useApp();
  const {
    currentUser,
    logout,
    resetPassword,
    updateUserPassword,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name || currentUser?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Password reset sub-state
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordSent, setPasswordSent] = useState(false);

  // Direct password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fileInputRef = useRef(null);

  // Derived account metadata
  const email = currentUser?.email || 'student@campus.edu';
  const displayName = profile?.name || currentUser?.displayName || email.split('@')[0];
  const avatarUrl = profile?.avatarUrl || currentUser?.photoURL;
  const initial = (displayName.charAt(0) || 'S').toUpperCase();

  // Provider detection
  const providerId = currentUser?.providerData?.[0]?.providerId || 'password';
  const isGoogle = providerId.includes('google');
  const providerLabel = isGoogle ? 'Google Account' : 'Email & Password';

  // Account creation date
  const creationTime = currentUser?.metadata?.creationTime;
  const memberSince = creationTime
    ? new Date(creationTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'November 2026';

  const isEmailVerified = currentUser?.emailVerified;

  // Handle Save Profile Name
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    try {
      setIsSaving(true);
      await updateProfile({ name: nameInput.trim() });
      setIsEditing(false);
      showToast('Profile name updated successfully!', 'success');
    } catch {
      showToast('Failed to update profile name', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Avatar Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');

    // Check size limit (max 1.5MB for local base64 storage)
    if (file.size > 1.5 * 1024 * 1024) {
      setPhotoError('Image size must be under 1.5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === 'string') {
        try {
          await updateProfile({ avatarUrl: dataUrl });
          showToast('Profile photo updated!', 'success');
        } catch {
          setPhotoError('Failed to save profile photo');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    try {
      await updateProfile({ avatarUrl: null });
      showToast('Profile photo removed', 'info');
    } catch {
      showToast('Failed to remove photo', 'danger');
    }
  };

  // Send Password Reset Link
  const handleSendResetEmail = async () => {
    if (!currentUser?.email) return;
    try {
      setIsResettingPassword(true);
      await resetPassword(currentUser.email);
      setPasswordSent(true);
      showToast(`Password reset link sent to ${currentUser.email}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to send password reset email', 'danger');
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Handle Direct Password Update
  const handleDirectPasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await updateUserPassword(newPassword);
      showToast('Password changed successfully!', 'success');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password. You may need to re-login first.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
      {/* ── Page Header ── */}
      <div>
        <h1 style={{
          fontSize: '1.375rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          lineHeight: 1.25,
          margin: 0,
        }}>
          Profile & Account
        </h1>
        <p style={{
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          marginTop: 4,
          margin: 0,
        }}>
          Manage your personal details, credentials, and account settings
        </p>
      </div>

      {/* ── Section 1: Profile Information Card ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Personal Information
          </h2>
          {!isEditing ? (
            <button
              onClick={() => {
                setNameInput(displayName);
                setIsEditing(true);
              }}
              className="btn btn-secondary"
              style={{
                height: 32,
                padding: '0 14px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Photo & Name Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          {/* Avatar with Camera Trigger */}
          <div style={{ position: 'relative' }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border)',
                }}
              />
            ) : (
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#FFFFFF',
                fontSize: '1.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '-0.02em',
              }}>
                {initial}
              </div>
            )}

            {/* Photo upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload new photo"
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <Camera size={13} strokeWidth={2.2} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              {email}
            </div>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  marginTop: 6,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--danger)',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Remove photo
              </button>
            )}
            {photoError && (
              <div style={{ fontSize: '0.6875rem', color: 'var(--danger)', marginTop: 4 }}>
                {photoError}
              </div>
            )}
          </div>
        </div>

        {/* Editable Name Form or Static View */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Full Name / Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-canvas)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                autoFocus
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="submit"
                disabled={isSaving || !nameInput.trim()}
                className="btn btn-primary"
                style={{
                  height: 36,
                  padding: '0 18px',
                  borderRadius: 'var(--radius-control)',
                  background: 'var(--accent)',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 'var(--radius-control)',
                  fontSize: '0.8125rem',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-control)', background: 'var(--bg-canvas)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'block' }}>
                Full Name
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginTop: 4, display: 'block' }}>
                {displayName}
              </span>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-control)', background: 'var(--bg-canvas)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'block' }}>
                Email Address
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginTop: 4, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {email}
              </span>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-control)', background: 'var(--bg-canvas)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'block' }}>
                Account Created
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginTop: 4, display: 'block' }}>
                {memberSince}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ── Section 2: Account Details Card ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px 20px',
      }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>
          Account Status & Authentication
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Provider row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--border)',
            background: 'var(--bg-canvas)',
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Authentication Provider
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Signed in using {providerLabel}
              </div>
            </div>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 9999,
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
            }}>
              {providerLabel}
            </span>
          </div>

          {/* Account status row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--border)',
            background: 'var(--bg-canvas)',
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Account Status
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Scoped private storage active
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                Active
              </span>
            </div>
          </div>

          {/* Email verification status row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--border)',
            background: 'var(--bg-canvas)',
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Email Verification
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {isEmailVerified ? 'Your email address is verified' : 'Verified through Firebase Authentication'}
              </div>
            </div>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 9999,
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
            }}>
              Verified
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 3: Security & Credentials Card ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px 20px',
      }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>
          Security & Password
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Password Reset */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--border)',
            background: 'var(--bg-canvas)',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Password Management
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {passwordSent
                  ? 'A password reset link was sent to your email.'
                  : 'Receive a password reset link at your registered email address.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleSendResetEmail}
                disabled={isResettingPassword || passwordSent}
                className="btn btn-secondary"
                style={{
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 'var(--radius-control)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Key size={13} />
                {passwordSent ? 'Link Sent' : isResettingPassword ? 'Sending...' : 'Send Reset Link'}
              </button>

              {!isGoogle && (
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="btn btn-secondary"
                  style={{
                    height: 34,
                    padding: '0 14px',
                    borderRadius: 'var(--radius-control)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  Change Password
                </button>
              )}
            </div>
          </div>

          {/* Sign Out Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--border)',
            background: 'var(--bg-canvas)',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Session & Sign Out
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Safely end your session on this device.
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary"
              style={{
                height: 34,
                padding: '0 16px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Direct Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div
            className="modal-card"
            style={{
              maxWidth: 400,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-modal)',
              padding: 24,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-icon"
                style={{ width: 26, height: 26, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            {passwordError && (
              <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-control)', background: 'rgba(180,35,24,0.08)', border: '1px solid var(--danger)', fontSize: '0.75rem', color: 'var(--danger)', marginBottom: 14 }}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handleDirectPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 10px',
                    borderRadius: 'var(--radius-control)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-canvas)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 10px',
                    borderRadius: 'var(--radius-control)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-canvas)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-secondary"
                  style={{ height: 34, padding: '0 14px', borderRadius: 'var(--radius-control)', fontSize: '0.75rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="btn btn-primary"
                  style={{
                    height: 34,
                    padding: '0 16px',
                    borderRadius: 'var(--radius-control)',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

