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
  Bell,
  BellOff,
  BellRing,
  Mail,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from '../components/UserAvatar';

/* Settings section wrapper */
const SettingsSection = ({ title, subtitle, icon: Icon, children }) => (
  <div className="card">
    <div style={{
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-base)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-subtle)',
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={17} strokeWidth={2} />
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
    <div style={{ padding: '18px 20px' }}>
      {children}
    </div>
  </div>
);

export const SettingsView = () => {
  const {
    profile,
    expenses,
    todos,
    monthlyBudget,
    updateProfile,
    toggleTheme,
    exportDataAsJSON,
    importDataFromJSON,
    resetAllDataToDefaults,
    notifPermission,
    requestNotifications,
    showToast,
  } = useApp();

  const { currentUser, logout } = useAuth();

  const [nameInput, setNameInput] = useState(profile?.name || '');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastExportTime, setLastExportTime] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      showToast?.('Signed out successfully. See you soon!', 'info');
    } catch (err) {
      alert(err.message || 'Failed to sign out');
    }
  };

  const handleNameSave = (e) => {
    e.preventDefault();
    if (nameInput.trim()) updateProfile({ name: nameInput.trim() });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File must be under 2MB.');
      return;
    }
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.name.endsWith('.json')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') importDataFromJSON(ev.target.result);
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    exportDataAsJSON();
    setLastExportTime(new Date());
  };

  const approxSize = () => {
    const data = { profile, expenses, todos, monthlyBudget };
    const bytes = new Blob([JSON.stringify(data)]).size;
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 740 }}>

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
          Manage your personal profile, notification preferences, theme, and data backups.
        </p>
      </div>

      {/* ── Profile ── */}
      <SettingsSection title="Personal Profile" subtitle="Update your name, profile photo, and view account details" icon={User}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={(e) => {
                const o = e.currentTarget.querySelector('.avatar-overlay');
                if (o) o.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const o = e.currentTarget.querySelector('.avatar-overlay');
                if (o) o.style.opacity = 0;
              }}
            >
              <UserAvatar size="xl" />
              <div
                className="avatar-overlay"
                onClick={() => imageInputRef.current?.click()}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer',
                }}
              >
                <Camera size={20} color="#fff" />
              </div>
            </div>
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            {profile?.avatarUrl && (
              <button
                onClick={() => updateProfile({ avatarUrl: null })}
                style={{
                  fontSize: '0.6875rem', color: 'var(--color-danger)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Trash2 size={11} /> Remove photo
              </button>
            )}
          </div>

          {/* Name form */}
          <form onSubmit={handleNameSave} style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name..."
                  className="form-input"
                  maxLength={40}
                  required
                  style={{ flex: 1, fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                  <Check size={14} /> Save
                </button>
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Displayed in greetings across the application dashboard.
              </span>
            </div>

            {/* Logged in Firebase Email */}
            <div className="form-group">
              <label className="form-label">Account Email (Firebase)</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-base)',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <Mail size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {currentUser?.email || 'Authenticated User'}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--color-success)',
                  background: 'var(--accent-subtle)',
                  padding: '2px 8px',
                  borderRadius: 20,
                  border: '1px solid var(--border-base)',
                  flexShrink: 0,
                }}>
                  Active
                </span>
              </div>
            </div>

            {/* Current Session & Logout */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Session Security
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  UID: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>{currentUser?.uid ? `${currentUser.uid.substring(0, 12)}...` : 'N/A'}</code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{
                  color: 'var(--color-danger)',
                  borderColor: 'rgba(220, 38, 38, 0.3)',
                  gap: 6,
                  height: 32,
                  padding: '0 12px',
                }}
              >
                <LogOut size={13} strokeWidth={2.2} /> Sign Out
              </button>
            </div>
          </form>
        </div>
      </SettingsSection>

      {/* ── Notifications ── */}
      <SettingsSection
        title="Task Notifications"
        subtitle="Get browser alerts for overdue & due-today tasks"
        icon={notifPermission === 'granted' ? BellRing : Bell}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Status row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            padding: '14px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-base)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {notifPermission === 'granted'
                ? <BellRing size={18} color="var(--accent)" strokeWidth={2} />
                : notifPermission === 'denied'
                ? <BellOff size={18} color="var(--color-danger)" strokeWidth={2} />
                : <Bell size={18} color="var(--accent)" strokeWidth={2} />
              }
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {notifPermission === 'granted' ? 'Notifications Enabled'
                    : notifPermission === 'denied' ? 'Notifications Blocked'
                    : notifPermission === 'unsupported' ? 'Not Supported'
                    : 'Notifications Off'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {notifPermission === 'granted'
                    ? "You will receive task reminders automatically every 30 minutes"
                    : notifPermission === 'denied'
                    ? 'Go to browser Site Settings → Notifications → Allow CampusFlow'
                    : notifPermission === 'unsupported'
                    ? "Your browser doesn't support push notifications"
                    : 'Click "Enable" to activate task deadline reminders'}
                </div>
              </div>
            </div>

            {/* Action button */}
            {notifPermission !== 'unsupported' && notifPermission !== 'denied' && (
              <button
                onClick={requestNotifications}
                disabled={notifPermission === 'granted'}
                className={notifPermission === 'granted' ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                style={{ flexShrink: 0 }}
              >
                {notifPermission === 'granted'
                  ? <><Check size={13} strokeWidth={2.5} /> Enabled</>
                  : <><Bell size={13} strokeWidth={2.5} /> Enable</>}
              </button>
            )}

            {notifPermission === 'denied' && (
              <span style={{
                fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <BellOff size={13} /> Blocked in browser
              </span>
            )}
          </div>

          {/* What you'll get */}
          {notifPermission !== 'unsupported' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Notification Rules
              </div>
              {[
                { emoji: '🔴', title: 'Overdue Alerts', desc: 'Fired when you have tasks past their due date' },
                { emoji: '⏰', title: 'Due Today Reminders', desc: 'Each incomplete task due today receives a nudge' },
                { emoji: '🔄', title: 'Periodic Check', desc: 'Runs every 30 minutes in the background' },
                { emoji: '🛡️', title: 'Anti-Spam Filter', desc: "Same task will not re-notify within 6 hours" },
              ].map(({ emoji, title, desc }) => (
                <div key={title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ fontSize: '1.125rem', flexShrink: 0, lineHeight: 1.3 }}>{emoji}</span>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SettingsSection>

      {/* ── Appearance ── */}
      <SettingsSection
        title="Appearance"
        subtitle="Toggle between light and dark warm neutral themes"
        icon={profile?.theme === 'dark' ? Moon : Sun}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Color Theme</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Currently using <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{profile?.theme || 'light'}</span> theme
            </div>
          </div>
          <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
            {profile?.theme === 'dark'
              ? <><Sun size={14} style={{ color: 'var(--accent)' }} /> Switch to Light</>
              : <><Moon size={14} style={{ color: 'var(--accent)' }} /> Switch to Dark</>
            }
          </button>
        </div>
      </SettingsSection>

      {/* ── Data Portability ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-base)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--accent-subtle)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Download size={17} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Data Portability
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Export or import your complete CampusFlow backup
            </div>
          </div>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Expenses', value: expenses.length },
              { label: 'Tasks', value: todos.length },
              { label: 'Est. Size', value: approxSize() },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', padding: '12px 14px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Export card */}
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={15} color="var(--accent)" /> Export JSON Backup
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Downloads all transactions, tasks, and budgets as a valid <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem' }}>.json</code> file.
              </div>
              {lastExportTime && (
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                  <Check size={12} /> Last exported at {lastExportTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
            <button
              onClick={handleExport}
              className="btn btn-primary"
              style={{ flexShrink: 0 }}
            >
              <Download size={15} strokeWidth={2.5} /> Download Backup
            </button>
          </div>

          {/* Import card */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: isDragOver ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
              border: `2px dashed ${isDragOver ? 'var(--accent)' : 'var(--border-base)'}`,
              borderRadius: 'var(--radius-md)', padding: '22px 18px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--accent-subtle)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 4, transform: isDragOver ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s',
            }}>
              <Upload size={20} strokeWidth={2} />
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isDragOver ? 'Drop your backup file here!' : 'Drag & drop to import'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              or <span style={{ color: 'var(--accent)', fontWeight: 600 }}>click to browse</span> for a backup <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem' }}>.json</code> file
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
              ⚠️ This will update your current data with the backup contents
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleJSONFileChange} accept=".json,application/json" style={{ display: 'none' }} />

          {/* Info strip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
          }}>
            <ShieldCheck size={14} color="var(--accent)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              All records are stored <strong style={{ color: 'var(--text-primary)' }}>locally in your browser</strong> under your user session.
            </span>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="card" style={{ border: '1px solid rgba(220,38,38,0.25)' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(220,38,38,0.15)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'rgba(220,38,38,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RotateCcw size={16} color="var(--color-danger)" />
          </div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-danger)', letterSpacing: '-0.02em' }}>
            Danger Zone
          </div>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>Reset All Data</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Permanently clears all expenses, tasks, and budget settings from your local browser storage.
              </div>
            </div>
            <button onClick={() => setIsResetConfirmOpen(true)} className="btn btn-danger btn-sm" style={{ flexShrink: 0 }}>
              <RotateCcw size={13} /> Reset All Data
            </button>
          </div>
        </div>
      </div>

      {/* ── About Footer ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '16px 0', borderTop: '1px solid var(--border-base)',
        fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500,
      }}>
        <ShieldCheck size={14} color="var(--accent)" />
        <span>CampusFlow 2.0 · Firebase Auth · PWA · Local Storage First</span>
      </div>

      {/* ── Logout Confirm Modal ── */}
      {isLogoutConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsLogoutConfirmOpen(false)}>
          <div className="modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <LogOut size={20} color="var(--accent)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Sign out of CampusFlow?
                </h3>
              </div>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                You are currently signed in as <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.email}</strong>.
                Your data is securely saved. You can sign back in anytime to continue where you left off.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsLogoutConfirmOpen(false)} className="btn btn-secondary btn-sm">
                Stay Signed In
              </button>
              <button
                onClick={() => { setIsLogoutConfirmOpen(false); handleLogout(); }}
                className="btn btn-primary btn-sm"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Confirm Modal ── */}
      {isResetConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsResetConfirmOpen(false)}>
          <div className="modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={20} color="var(--color-danger)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-danger)', letterSpacing: '-0.02em' }}>
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
              <button onClick={() => setIsResetConfirmOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button
                onClick={() => { resetAllDataToDefaults(); setIsResetConfirmOpen(false); }}
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
