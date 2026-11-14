import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  X,
  LogOut,
  FileText,
  AlertTriangle,
  User,
  Shield,
  Bell,
  Sliders,
  Globe,
  Palette,
  Check,
} from 'lucide-react';
import { useApp, defaultPreferences, CURRENCY_SYMBOLS } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/categoryColors';

export const SettingsView = () => {
  const {
    profile,
    preferences,
    updatePreferences,
    exportDataAsJSON,
    importDataFromJSON,
    resetAllDataToDefaults,
    setIsReportModalOpen,
    notifPermission,
    requestNotifications,
    setActivePage,
    showToast,
  } = useApp();

  const {
    currentUser,
    logout,
    resetPassword,
    deleteUserAccount,
  } = useAuth();

  const fileInputRef = useRef(null);

  // Clear data modal state
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Delete account modal state
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountText, setDeleteAccountText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState('');

  // Reset password state
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const displayName = profile?.name || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Student');
  const initial = (displayName.charAt(0) || 'S').toUpperCase();
  const emailVal = currentUser?.email || 'student@campus.edu';

  // Handle Import JSON
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

  // Confirm Reset Data
  const handleConfirmClearAll = () => {
    if (deleteConfirmationText.trim().toUpperCase() === 'DELETE') {
      resetAllDataToDefaults();
      setIsClearModalOpen(false);
      setDeleteConfirmationText('');
      showToast('All user data reset to fresh state', 'info');
    }
  };

  // Confirm Delete Account
  const handleConfirmDeleteAccount = async () => {
    if (deleteAccountText.trim().toUpperCase() !== 'DELETE MY ACCOUNT') return;

    try {
      setIsDeletingAccount(true);
      setDeleteAccountError('');
      resetAllDataToDefaults();
      await deleteUserAccount();
      showToast('Your account and data have been deleted.', 'info');
    } catch (err) {
      setDeleteAccountError(err.message || 'Recent login required to delete account. Please sign out and log in again, then retry.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Handle Send Password Reset
  const handleSendPasswordReset = async () => {
    if (!currentUser?.email) return;
    try {
      setIsSendingReset(true);
      await resetPassword(currentUser.email);
      setResetSent(true);
      showToast(`Password reset link sent to ${currentUser.email}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to send reset email', 'danger');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{
            fontSize: '1.375rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            margin: 0,
          }}>
            Settings & Preferences
          </h1>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginTop: 4,
            margin: 0,
          }}>
            Configure appearance, currencies, expense defaults, and data backups
          </p>
        </div>

        <button
          onClick={() => setActivePage('profile')}
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
          <User size={13} />
          View Full Profile
        </button>
      </div>

      {/* ── 1. Appearance ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Palette size={16} color="var(--accent)" />
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Appearance & Theme
          </h2>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 14px' }}>
          Choose your visual mode or follow your system-level dark mode preference.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          maxWidth: 420,
        }}>
          {[
            { id: 'light', label: 'Light' },
            { id: 'dark', label: 'Dark' },
            { id: 'system', label: 'System Default' },
          ].map(opt => {
            const isSelected = (preferences.themeMode || 'dark') === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updatePreferences({ themeMode: opt.id })}
                style={{
                  height: 38,
                  borderRadius: 'var(--radius-control)',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-canvas)',
                  color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                {isSelected && <Check size={13} strokeWidth={2.5} />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 2. Regional Preferences ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Globe size={16} color="var(--accent)" />
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Regional Preferences
          </h2>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
          Set your preferred display currency and calendar formatting. Existing amounts remain intact without currency conversion.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {/* Currency selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Display Currency
            </label>
            <select
              value={preferences.currency || 'INR'}
              onChange={e => updatePreferences({ currency: e.target.value })}
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
                cursor: 'pointer',
              }}
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="JPY">JPY (¥) — Japanese Yen</option>
              <option value="CAD">CAD (C$) — Canadian Dollar</option>
              <option value="AUD">AUD (A$) — Australian Dollar</option>
            </select>
          </div>

          {/* Date format */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Date Format
            </label>
            <select
              value={preferences.dateFormat || 'DD/MM/YYYY'}
              onChange={e => updatePreferences({ dateFormat: e.target.value })}
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
                cursor: 'pointer',
              }}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (14/11/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (11/14/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-11-14)</option>
            </select>
          </div>

          {/* First day of week */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              First Day of Week
            </label>
            <select
              value={preferences.firstDayOfWeek || 'Monday'}
              onChange={e => updatePreferences({ firstDayOfWeek: e.target.value })}
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
                cursor: 'pointer',
              }}
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── 3. Expense Preferences ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Sliders size={16} color="var(--accent)" />
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Expense Defaults
          </h2>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
          Speed up logging by pre-selecting your most common category and payment method.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {/* Default Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Default Category
            </label>
            <select
              value={preferences.defaultCategory || 'Food'}
              onChange={e => updatePreferences({ defaultCategory: e.target.value })}
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
                cursor: 'pointer',
              }}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Default Payment Method */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Default Payment Method
            </label>
            <select
              value={preferences.defaultPaymentMethod || 'UPI'}
              onChange={e => updatePreferences({ defaultPaymentMethod: e.target.value })}
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
                cursor: 'pointer',
              }}
            >
              {PAYMENT_METHODS.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expense confirmation toast toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              Show confirmation after adding an expense
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Displays brief toast notification with the logged amount
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.expenseConfirmation ?? true}
            onChange={e => updatePreferences({ expenseConfirmation: e.target.checked })}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
        </div>
      </section>

      {/* ── 4. Notifications ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={16} color="var(--accent)" />
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Notification Alerts
            </h2>
          </div>
          {notifPermission !== 'granted' && (
            <button
              onClick={requestNotifications}
              className="btn btn-secondary"
              style={{ height: 30, padding: '0 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}
            >
              Enable Browser Alerts
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
          Functional alerts for budget thresholds and overdue deadlines.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Budget Limit Alerts */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Budget Limit Alerts
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Notify when spending reaches 80% and 100% of monthly budget
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifBudgetLimit ?? true}
              onChange={e => updatePreferences({ notifBudgetLimit: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Task Reminders */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Task & Deadline Reminders
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Periodic alerts for tasks scheduled for today and overdue items
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifTaskReminders ?? true}
              onChange={e => updatePreferences({ notifTaskReminders: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </section>

      {/* ── 5. Data Management ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px',
      }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          Data Management & Reports
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
          Export your complete account data or generate a financial PDF statement.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {/* Download PDF report button */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="btn btn-secondary"
            style={{
              height: 40,
              padding: '0 14px',
              borderRadius: 'var(--radius-control)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <FileText size={15} color="var(--accent)" />
            <span>Monthly PDF Report</span>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={exportDataAsJSON}
            className="btn btn-secondary"
            style={{
              height: 40,
              padding: '0 14px',
              borderRadius: 'var(--radius-control)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Download size={15} />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{
              height: 40,
              padding: '0 14px',
              borderRadius: 'var(--radius-control)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Upload size={15} />
            <span>Import Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleJSONFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Reset Data Danger zone trigger */}
        <div style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--danger)' }}>
              Clear Application Data
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Reset expenses, tasks, and budgets for your user account
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDeleteConfirmationText('');
              setIsClearModalOpen(true);
            }}
            className="btn btn-secondary"
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 'var(--radius-control)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--danger)',
            }}
          >
            Clear Data
          </button>
        </div>
      </section>

      {/* ── 6. Account & Security ── */}
      <section style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Shield size={16} color="var(--accent)" />
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Account & Security
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Account info row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {emailVal}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendPasswordReset}
              disabled={isSendingReset || resetSent}
              className="btn btn-secondary"
              style={{
                height: 32,
                padding: '0 14px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {resetSent ? 'Reset Link Sent' : isSendingReset ? 'Sending...' : 'Reset Password'}
            </button>
          </div>

          {/* Sign Out row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Sign Out
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Log out of your CampusFlow account
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary"
              style={{
                height: 32,
                padding: '0 14px',
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

          {/* Delete Account */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--danger)' }}>
                Delete Account
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Permanently delete your account and all associated data
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDeleteAccountText('');
                setDeleteAccountError('');
                setIsDeleteAccountModalOpen(true);
              }}
              className="btn btn-secondary"
              style={{
                height: 32,
                padding: '0 14px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--danger)',
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* ── Clear All Data Confirmation Modal ── */}
      {isClearModalOpen && (
        <div className="modal-overlay" onClick={() => setIsClearModalOpen(false)}>
          <div
            className="modal-card"
            style={{
              maxWidth: 420,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-modal)',
              padding: 24,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-control)',
                  background: 'rgba(180,35,24,0.1)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AlertTriangle size={16} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Clear All Data?
                </h3>
              </div>
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="btn-icon"
                style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
              This will permanently delete all your expenses, tasks, budgets, and custom categories stored on this device.
            </p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
                Type <strong style={{ color: 'var(--danger)' }}>DELETE</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={e => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
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
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="btn btn-secondary"
                style={{ height: 36, padding: '0 14px', borderRadius: 'var(--radius-control)', fontSize: '0.8125rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                style={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: 'var(--radius-control)',
                  background: deleteConfirmationText.trim().toUpperCase() === 'DELETE' ? 'var(--danger)' : 'var(--border)',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: deleteConfirmationText.trim().toUpperCase() === 'DELETE' ? 'pointer' : 'not-allowed',
                }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Account Confirmation Modal ── */}
      {isDeleteAccountModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteAccountModalOpen(false)}>
          <div
            className="modal-card"
            style={{
              maxWidth: 420,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-modal)',
              padding: 24,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-control)',
                  background: 'rgba(180,35,24,0.1)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AlertTriangle size={16} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--danger)', margin: 0 }}>
                  Delete Account?
                </h3>
              </div>
              <button
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="btn-icon"
                style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px' }}>
              This will permanently delete your authentication account from Firebase and remove all your data. This action cannot be undone.
            </p>

            {deleteAccountError && (
              <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-control)', background: 'rgba(180,35,24,0.08)', border: '1px solid var(--danger)', fontSize: '0.75rem', color: 'var(--danger)', marginBottom: 14 }}>
                {deleteAccountError}
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
                Type <strong style={{ color: 'var(--danger)' }}>DELETE MY ACCOUNT</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteAccountText}
                onChange={e => setDeleteAccountText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
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
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="btn btn-secondary"
                style={{ height: 36, padding: '0 14px', borderRadius: 'var(--radius-control)', fontSize: '0.8125rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                disabled={deleteAccountText.trim().toUpperCase() !== 'DELETE MY ACCOUNT' || isDeletingAccount}
                style={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: 'var(--radius-control)',
                  background: deleteAccountText.trim().toUpperCase() === 'DELETE MY ACCOUNT' ? 'var(--danger)' : 'var(--border)',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: deleteAccountText.trim().toUpperCase() === 'DELETE MY ACCOUNT' && !isDeletingAccount ? 'pointer' : 'not-allowed',
                }}
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
