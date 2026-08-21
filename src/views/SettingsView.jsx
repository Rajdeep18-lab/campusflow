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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';

/* Settings section wrapper */
const SettingsSection = ({ title, subtitle, icon: Icon, iconColor = 'var(--accent)', children }) => (
  <div className="card">
    <div className="card-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34,
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={16} color={iconColor} strokeWidth={2} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem', fontWeight: 700,
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
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
  } = useApp();

  const [nameInput,          setNameInput]          = useState(profile?.name || '');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDragOver,         setIsDragOver]         = useState(false);
  const [lastExportTime,     setLastExportTime]     = useState(null);
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>

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
          Manage your profile, notifications, theme, and local data preferences.
        </p>
      </div>

      {/* ── Profile ── */}
      <SettingsSection title="Personal Profile" subtitle="Update your name and avatar" icon={User}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={e => { const o = e.currentTarget.querySelector('.avatar-overlay'); if (o) o.style.opacity = 1; }}
              onMouseLeave={e => { const o = e.currentTarget.querySelector('.avatar-overlay'); if (o) o.style.opacity = 0; }}
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
          <form onSubmit={handleNameSave} style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
                  placeholder="Your name..." className="form-input" maxLength={40} required
                  style={{ flex: 1, fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                  <Check size={13} /> Save
                </button>
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Displayed in greetings across the application.
              </span>
            </div>
          </form>
        </div>
      </SettingsSection>

      {/* ── Notifications ── */}
      <SettingsSection
        title="Task Notifications"
        subtitle="Get browser reminders for overdue & due-today tasks"
        icon={notifPermission === 'granted' ? BellRing : Bell}
        iconColor="#f59e0b"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Status row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            padding: '14px 16px', borderRadius: 12,
            background: notifPermission === 'granted'
              ? 'rgba(5,150,105,0.08)' : notifPermission === 'denied'
              ? 'rgba(220,38,38,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${
              notifPermission === 'granted' ? 'rgba(5,150,105,0.25)'
              : notifPermission === 'denied' ? 'rgba(220,38,38,0.25)'
              : 'rgba(245,158,11,0.25)'
            }`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {notifPermission === 'granted'
                ? <BellRing size={18} color="#059669" strokeWidth={2} />
                : notifPermission === 'denied'
                ? <BellOff size={18} color="#dc2626" strokeWidth={2} />
                : <Bell size={18} color="#f59e0b" strokeWidth={2} />
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
                    ? "You'll receive task reminders automatically every 30 min"
                    : notifPermission === 'denied'
                    ? 'Go to browser Site Settings → Notifications → Allow CampusFlow'
                    : notifPermission === 'unsupported'
                    ? "Your browser doesn't support push notifications"
                    : 'Tap "Enable" to start getting task deadline reminders'}
                </div>
              </div>
            </div>

            {/* Action button */}
            {notifPermission !== 'unsupported' && notifPermission !== 'denied' && (
              <button
                onClick={requestNotifications}
                disabled={notifPermission === 'granted'}
                style={{
                  height: 36, padding: '0 16px', borderRadius: 10, border: 'none',
                  cursor: notifPermission === 'granted' ? 'default' : 'pointer',
                  background: notifPermission === 'granted'
                    ? 'rgba(5,150,105,0.15)'
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: notifPermission === 'granted' ? '#059669' : '#fff',
                  fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.2s',
                }}
              >
                {notifPermission === 'granted'
                  ? <><Check size={13} strokeWidth={2.5} /> Enabled</>
                  : <><Bell size={13} strokeWidth={2.5} /> Enable</>}
              </button>
            )}

            {notifPermission === 'denied' && (
              <span style={{
                fontSize: '0.75rem', color: '#dc2626', fontWeight: 600,
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
                What you'll receive
              </div>
              {[
                { emoji: '🔴', title: 'Overdue Alerts', desc: 'Fired when you have tasks past their due date' },
                { emoji: '⏰', title: 'Due Today Reminders', desc: 'Each incomplete task due today gets a nudge' },
                { emoji: '🔄', title: 'Auto Check', desc: 'Checks every 30 minutes while the app is open' },
                { emoji: '🛑', title: 'No Spam', desc: "Same task won't re-notify for 6 hours" },
              ].map(({ emoji, title, desc }) => (
                <div key={title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
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
        subtitle="Toggle between dark and light themes"
        icon={profile?.theme === 'dark' ? Moon : Sun}
        iconColor={profile?.theme === 'dark' ? 'var(--accent)' : '#f59e0b'}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Color Theme</div>
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

      {/* ── Data Portability ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 'var(--radius-md)',
              background: 'var(--accent-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Download size={16} color="var(--accent)" strokeWidth={2} />
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
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Expenses', value: expenses.length, color: '#E8A33D', bg: 'rgba(232,163,61,0.10)', border: 'rgba(232,163,61,0.2)' },
              { label: 'Tasks', value: todos.length, color: '#6C8EF5', bg: 'rgba(108,142,245,0.10)', border: 'rgba(108,142,245,0.2)' },
              { label: 'Est. Size', value: approxSize(), color: 'var(--color-success)', bg: 'rgba(52,199,123,0.10)', border: 'rgba(52,199,123,0.2)' },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label} style={{
                background: bg, border: `1px solid ${border}`,
                borderRadius: 'var(--radius-md)', padding: '12px 14px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Export card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(232,163,61,0.10) 0%, rgba(217,146,44,0.06) 100%)',
            border: '1px solid rgba(232,163,61,0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={15} color="#E8A33D" /> Export JSON Backup
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Downloads all data as a <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem' }}>.json</code> file.
              </div>
              {lastExportTime && (
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                  <Check size={11} /> Last exported at {lastExportTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
            <button
              onClick={handleExport}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #E8A33D, #d9922c)',
                color: '#0F172A', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 700,
                boxShadow: '0 4px 14px rgba(232,163,61,0.35)',
                flexShrink: 0,
              }}
            >
              <Download size={15} strokeWidth={2.5} /> Download Backup
            </button>
          </div>

          {/* Import card */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: isDragOver ? 'rgba(108,142,245,0.12)' : 'rgba(108,142,245,0.05)',
              border: `2px dashed ${isDragOver ? 'rgba(108,142,245,0.7)' : 'rgba(108,142,245,0.3)'}`,
              borderRadius: 'var(--radius-lg)', padding: '22px 18px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(108,142,245,0.12)', border: '1px solid rgba(108,142,245,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 4, transform: isDragOver ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s',
            }}>
              <Upload size={20} color="#6C8EF5" strokeWidth={2} />
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isDragOver ? 'Drop your backup file here!' : 'Drag & drop to import'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              or <span style={{ color: '#6C8EF5', fontWeight: 600 }}>click to browse</span> for a backup <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem' }}>.json</code> file
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
              ⚠️ This will overwrite your current local data
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleJSONFileChange} accept=".json,application/json" style={{ display: 'none' }} />

          {/* Info strip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
          }}>
            <ShieldCheck size={13} color="var(--color-success)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              All data is stored <strong style={{ color: 'var(--text-secondary)' }}>100% locally</strong> in your browser. CampusFlow never sends your data to any server.
            </span>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(239,68,68,0.12)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--radius-md)',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Reset All Local Data</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Permanently deletes all expenses, tasks, budget, and profile settings.
              </div>
            </div>
            <button onClick={() => setIsResetConfirmOpen(true)} className="btn btn-danger btn-sm" style={{ flexShrink: 0 }}>
              <RotateCcw size={12} /> Reset All Data
            </button>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '20px 0', borderTop: '1px solid var(--border-base)',
        fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500,
      }}>
        <ShieldCheck size={14} color="var(--accent)" />
        <span>CampusFlow v1.1.0 · PWA · 100% Offline · Local Storage</span>
      </div>

      {/* ── Reset Confirm Modal ── */}
      {isResetConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsResetConfirmOpen(false)}>
          <div className="modal-card max-w-md" onClick={e => e.stopPropagation()}>
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
