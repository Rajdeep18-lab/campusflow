import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  X,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const SettingsView = () => {
  const {
    profile,
    expenses,
    monthlyBudget,
    updateProfile,
    toggleTheme,
    exportDataAsJSON,
    importDataFromJSON,
    resetAllDataToDefaults,
    saveMonthlyBudget,
    notifPermission,
    requestNotifications,
    showToast,
  } = useApp();

  const { currentUser, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [nameInput, setNameInput] = useState(profile?.name || '');
  const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? String(monthlyBudget) : '');
  const [hasUnsavedName, setHasUnsavedName] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthExpenses = expenses.filter(e => e.date && e.date.startsWith(monthPrefix));
  const monthSpent = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const displayName = profile?.name || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Rajdeep');
  const initial = (displayName.charAt(0) || 'R').toUpperCase();
  const emailVal = currentUser?.email || 'rajdeep@college.edu';
  const isDark = profile?.theme === 'dark';

  const handleNameChange = (e) => {
    setNameInput(e.target.value);
    setHasUnsavedName(e.target.value !== (profile?.name || ''));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateProfile({ name: nameInput.trim() });
      setHasUnsavedName(false);
      showToast?.('Profile updated successfully', 'success');
    }
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val >= 0) {
      saveMonthlyBudget(val);
      showToast?.('Budget limit saved', 'success');
    }
  };

  const handleJSONFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        importDataFromJSON(ev.target.result);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmClearAll = () => {
    if (deleteConfirmationText.trim().toUpperCase() === 'DELETE') {
      resetAllDataToDefaults();
      setIsClearModalOpen(false);
      setDeleteConfirmationText('');
      showToast?.('All data has been reset', 'info');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      {/* ── Page Header ── */}
      <div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          lineHeight: 1.25,
        }}>
          Settings
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>
          Manage your profile, appearance, budget and data.
        </p>
      </div>

      {/* ── Card 1: Profile ── */}
      <div className="card">
        <div style={{ marginBottom: 14 }}>
          <div className="card-title">Profile</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
            Your name is used in the greeting.
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Avatar circle + Name input */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div
              className="sidebar-avatar-circle"
              style={{ width: 38, height: 38, fontSize: '15px', marginTop: 20 }}
            >
              {initial}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={handleNameChange}
                  className="form-input"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={emailVal}
                  readOnly
                  disabled
                  className="form-input"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text-muted)',
                    cursor: 'not-allowed',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!hasUnsavedName}
            >
              Save changes
            </button>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {hasUnsavedName ? 'You have unsaved changes' : 'No unsaved changes'}
            </span>
          </div>
        </form>
      </div>

      {/* ── Card 2: Appearance ── */}
      <div className="card">
        <div style={{ marginBottom: 14 }}>
          <div className="card-title">Appearance</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
            Applies instantly on this device.
          </div>
        </div>

        <div className="segmented-control" style={{ width: 140 }}>
          <button
            onClick={() => { if (isDark) toggleTheme(); }}
            className={`segment-btn${!isDark ? ' active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Light
          </button>
          <button
            onClick={() => { if (!isDark) toggleTheme(); }}
            className={`segment-btn${isDark ? ' active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Dark
          </button>
        </div>
      </div>

      {/* ── Card 3: Monthly budget ── */}
      <div className="card">
        <div style={{ marginBottom: 14 }}>
          <div className="card-title">Monthly budget</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
            Used for budget remaining and analytics.
          </div>
        </div>

        <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-group" style={{ maxWidth: 260 }}>
            <label className="form-label">Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>
                ₹
              </span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="0"
                className="form-input"
                style={{ paddingLeft: 26 }}
              />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
              ₹{monthSpent.toLocaleString('en-IN')} used this month
            </span>
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              Save budget
            </button>
          </div>
        </form>
      </div>

      {/* ── Card 4: Notifications ── */}
      <div className="card">
        <div style={{ marginBottom: 14 }}>
          <div className="card-title">Notifications</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
            Reminders for deadlines on this device.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
              Deadline reminders
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
              Notify me the day before a task is due
            </div>
          </div>

          {/* Toggle Switch */}
          <label style={{ position: 'relative', display: 'inline-block', width: 38, height: 22, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notifPermission === 'granted'}
              onChange={requestNotifications}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: notifPermission === 'granted' ? 'var(--accent-solid)' : 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 22,
              transition: 'all 0.2s ease',
            }}>
              <span style={{
                position: 'absolute',
                left: notifPermission === 'granted' ? 18 : 2,
                top: 2,
                width: 16,
                height: 16,
                backgroundColor: '#FFFFFF',
                borderRadius: '50%',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </span>
          </label>
        </div>
      </div>

      {/* ── Card 5: Backup and restore ── */}
      <div className="card">
        <div style={{ marginBottom: 14 }}>
          <div className="card-title">Backup and restore</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
            Export everything as a JSON file, or restore from one.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={exportDataAsJSON} className="btn btn-secondary">
            <Download size={14} strokeWidth={1.75} />
            <span>Export data</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary">
            <Upload size={14} strokeWidth={1.75} />
            <span>Import data</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleJSONFileChange}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 10 }}>
          Importing replaces your current data. Export a backup first.
        </div>
      </div>

      {/* ── Card 6: Danger Zone / Clear all data ── */}
      <div className="card" style={{ border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              Clear all data
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
              Permanently delete all expenses, tasks, your budget and profile from this device.
            </div>
          </div>

          <button
            onClick={() => setIsClearModalOpen(true)}
            className="btn btn-danger"
          >
            Clear all data...
          </button>
        </div>
      </div>

      {/* Sign Out Row */}
      {currentUser && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
          <button
            onClick={logout}
            className="btn btn-secondary"
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={14} strokeWidth={1.75} />
            <span>Sign out of CampusFlow</span>
          </button>
        </div>
      )}

      {/* ── Clear All Data Confirmation Modal (Screen 10 in PDF) ── */}
      {isClearModalOpen && (
        <div className="modal-overlay" onClick={() => setIsClearModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Clear all data?</span>
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="btn-icon"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                This permanently deletes all expenses, tasks, your budget and profile from this device. This cannot be undone.
              </p>

              {/* Tip Callout */}
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-control)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                Tip: export a backup first from Settings.
              </div>

              {/* DELETE confirmation prompt */}
              <div className="form-group">
                <label className="form-label">Type DELETE to confirm</label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  className="form-input form-input-modal"
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => { setIsClearModalOpen(false); setDeleteConfirmationText(''); }}
                className="btn btn-secondary btn-modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                className="btn btn-danger-solid btn-modal"
              >
                Clear all data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
