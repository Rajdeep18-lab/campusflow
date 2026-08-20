import React, { useState, useRef } from 'react';
import {
  User,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Check,
  ShieldCheck,
  Camera,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';

/* Settings section wrapper */
const SettingsSection = ({ title, subtitle, icon: Icon, iconColor = 'var(--accent)', children }) => (
  <div className="card">
    <div className="card-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={16} color={iconColor} strokeWidth={2} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="card-body">
      {children}
    </div>
  </div>
);

export const SettingsView = () => {
  const {
    profile,
    updateProfile,
    toggleTheme,
    exportDataAsJSON,
    importDataFromJSON,
    resetAllDataToDefaults,
  } = useApp();

  const [nameInput,          setNameInput]          = useState(profile?.name || '');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const fileInputRef  = useRef(null);
  const imageInputRef = useRef(null);

  const handleNameSave = (e) => {
    e.preventDefault();
    if (nameInput.trim()) updateProfile({ name: nameInput.trim() });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('File must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => updateProfile({ avatarUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleJSONFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') importDataFromJSON(ev.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="animate-fade-in"
      style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}
    >
      {/* Page Header */}
      <div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.375rem', fontWeight: 800,
          letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2,
        }}>
          Settings
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Manage your profile, theme, and local data preferences.
        </p>
      </div>

      {/* ── Profile ── */}
      <SettingsSection
        title="Personal Profile"
        subtitle="Update your name and avatar"
        icon={User}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: 24,
        }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={e => {
                const overlay = e.currentTarget.querySelector('.avatar-overlay');
                if (overlay) overlay.style.opacity = 1;
              }}
              onMouseLeave={e => {
                const overlay = e.currentTarget.querySelector('.avatar-overlay');
                if (overlay) overlay.style.opacity = 0;
              }}
            >
              <UserAvatar size="xl" />
              <div
                className="avatar-overlay"
                onClick={() => imageInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  cursor: 'pointer',
                }}
              >
                <Camera size={20} color="#fff" />
              </div>
            </div>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {profile?.avatarUrl && (
              <button
                onClick={() => updateProfile({ avatarUrl: null })}
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Trash2 size={11} />
                Remove photo
              </button>
            )}
          </div>

          {/* Name form */}
          <form
            onSubmit={handleNameSave}
            style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="Your name..."
                  className="form-input"
                  maxLength={40}
                  required
                  style={{ flex: 1, fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                  <Check size={13} />
                  Save
                </button>
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Displayed in greetings across the application.
              </span>
            </div>
          </form>
        </div>
      </SettingsSection>

      {/* ── Appearance ── */}
      <SettingsSection
        title="Appearance"
        subtitle="Toggle between dark and light themes"
        icon={profile?.theme === 'dark' ? Moon : Sun}
        iconColor={profile?.theme === 'dark' ? 'var(--accent)' : '#f59e0b'}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}>
              Color Theme
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Currently: <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{profile?.theme || 'dark'}</span> mode
            </div>
          </div>
          <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
            {profile?.theme === 'dark'
              ? <><Sun size={13} color="#f59e0b" /> Switch to Light</>
              : <><Moon size={13} color="var(--accent)" /> Switch to Dark</>
            }
          </button>
        </div>
      </SettingsSection>

      {/* ── Data Backup ── */}
      <SettingsSection
        title="Data Portability"
        subtitle="Export or import all data as a JSON file"
        icon={Download}
      >
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          CampusFlow is entirely offline. Your data lives in browser local storage.
          Export a backup to preserve your data or transfer it to another device.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={exportDataAsJSON} className="btn btn-primary btn-sm">
            <Download size={13} />
            Export JSON Backup
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary btn-sm"
          >
            <Upload size={13} style={{ color: 'var(--accent)' }} />
            Import JSON Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleJSONFileChange}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />
        </div>
      </SettingsSection>

      {/* ── Danger Zone ── */}
      <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(239,68,68,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RotateCcw size={16} color="var(--color-danger)" />
          </div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-danger)', letterSpacing: '-0.02em' }}>
            Danger Zone
          </div>
        </div>
        <div className="card-body">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Reset All Local Data
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Permanently deletes all expenses, tasks, budget, and profile settings.
              </div>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="btn btn-danger btn-sm"
              style={{ flexShrink: 0 }}
            >
              <RotateCcw size={12} />
              Reset All Data
            </button>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '20px 0',
        borderTop: '1px solid var(--border-base)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontWeight: 500,
      }}>
        <ShieldCheck size={14} color="var(--accent)" />
        <span>CampusFlow v1.0.0 · 100% Offline · Local Storage</span>
      </div>

      {/* ── Reset Confirmation Modal ── */}
      {isResetConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsResetConfirmOpen(false)}>
          <div className="modal-card max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={20} color="var(--color-danger)" />
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-danger)',
                  letterSpacing: '-0.02em',
                }}>
                  Are you absolutely sure?
                </h3>
              </div>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                This will permanently erase all your expenses, tasks, budget limits, and profile data from local storage.
                <strong style={{ color: 'var(--text-primary)' }}> This action cannot be undone.</strong>
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsResetConfirmOpen(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllDataToDefaults();
                  setIsResetConfirmOpen(false);
                }}
                className="btn btn-danger btn-sm"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
