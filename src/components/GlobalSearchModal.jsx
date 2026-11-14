import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, CheckSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryColor } from '../utils/categoryColors';

export const GlobalSearchModal = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    expenses,
    todos,
    setActivePage,
    setEditingExpense,
    toggleTodoCompleted,
    formatCurrency,
    formatDate,
    customCategories,
    theme,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      } else if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const handleClose = () => {
    setIsGlobalSearchOpen(false);
    setQuery('');
  };

  const q = query.trim().toLowerCase();

  const filteredExpenses = q
    ? expenses.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q)) ||
        e.amount.toString().includes(q)
      )
    : [];

  const filteredTodos = q
    ? todos.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q)
      )
    : [];

  const hasResults = filteredExpenses.length > 0 || filteredTodos.length > 0;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        style={{
          width: '100%',
          maxWidth: 540,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-modal)',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search header row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
        }}>
          <Search size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search expenses, tasks, categories..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="btn-icon"
              aria-label="Clear"
              style={{ width: 22, height: 22, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
          <kbd style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            fontFamily: 'inherit',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '12px 16px' }}>
          {!query.trim() ? (
            <div style={{ padding: '36px 12px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Start typing to search expenses and tasks...
            </div>
          ) : !hasResults ? (
            <div style={{ padding: '36px 12px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              No results found for <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>"{query}"</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Expenses list */}
              {filteredExpenses.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Expenses ({filteredExpenses.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {filteredExpenses.map(exp => {
                      const color = getCategoryColor(exp.category, theme, customCategories);
                      return (
                        <div
                          key={exp.id}
                          onClick={() => {
                            handleClose();
                            setActivePage('expenses');
                            setEditingExpense(exp);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-control)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-canvas)',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {exp.title}
                              </div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                                {exp.category} · <span className="num">{formatDate(exp.date)}</span>
                              </div>
                            </div>
                          </div>
                          <span className="num" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12 }}>
                            {formatCurrency(exp.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks list */}
              {filteredTodos.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Tasks ({filteredTodos.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {filteredTodos.map(todo => (
                      <div
                        key={todo.id}
                        onClick={() => {
                          handleClose();
                          setActivePage('todos');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-control)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-canvas)',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={e => {
                              e.stopPropagation();
                              toggleTodoCompleted(todo.id);
                            }}
                            style={{ width: 14, height: 14, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div style={{
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {todo.title}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                              {todo.priority} priority · <span className="num">{todo.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-canvas)',
          fontSize: '0.6875rem',
          color: 'var(--text-muted)',
        }}>
          <span>Press ESC or click outside to dismiss</span>
          <span>CampusFlow 2.0</span>
        </div>
      </div>
    </div>
  );
};
