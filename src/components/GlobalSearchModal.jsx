import React, { useState, useEffect } from 'react';
import { Search, X, CreditCard, CheckSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GlobalSearchModal = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    expenses,
    todos,
    setActivePage,
    setEditingExpense,
    toggleTodoCompleted,
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
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-base)',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: 560,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          animation: 'modalIn var(--duration-slow) var(--ease-spring) forwards',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 16px',
          borderBottom: '1px solid var(--border-base)',
          background: 'var(--bg-secondary)',
          height: 56,
        }}>
          <Search size={17} color="var(--accent)" strokeWidth={2} style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search expenses, categories, tasks..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              fontWeight: 400,
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          <button onClick={handleClose} className="btn-icon" aria-label="Close search">
            <X size={15} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {!query.trim() ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}>
              Type to search across your expenses and tasks...
            </div>
          ) : !hasResults ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}>
              No results found for <strong style={{ color: 'var(--text-secondary)' }}>"{query}"</strong>
            </div>
          ) : (
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Expenses */}
              {filteredExpenses.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <CreditCard size={11} color="var(--accent)" />
                    Expenses ({filteredExpenses.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {filteredExpenses.map(exp => (
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
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--accent-border)';
                          e.currentTarget.style.background = 'var(--bg-active)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.background = 'var(--bg-tertiary)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                            background: 'var(--accent-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent)',
                          }}>₹</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{
                              fontSize: '0.875rem', fontWeight: 600,
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {exp.title}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                              {exp.category} · <span style={{ fontFamily: 'var(--font-mono)' }}>{exp.date}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.875rem', fontWeight: 700,
                          color: 'var(--color-success)',
                          flexShrink: 0, marginLeft: 12,
                        }}>
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {filteredTodos.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <CheckSquare size={11} color="var(--accent-blue)" />
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
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.12s',
                          gap: 10,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(108,142,245,0.3)';
                          e.currentTarget.style.background = 'rgba(108,142,245,0.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.background = 'var(--bg-tertiary)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={e => { e.stopPropagation(); toggleTodoCompleted(todo.id); }}
                            style={{ width: 14, height: 14, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div style={{
                              fontSize: '0.875rem', fontWeight: 600,
                              color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {todo.title}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                              {todo.priority} priority · Due <span style={{ fontFamily: 'var(--font-mono)' }}>{todo.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
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
          padding: '10px 16px',
          borderTop: '1px solid var(--border-base)',
          background: 'var(--bg-tertiary)',
          fontSize: '0.6875rem',
          color: 'var(--text-muted)',
        }}>
          <span>Results update as you type</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={{
              padding: '2px 5px',
              borderRadius: 4,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-base)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              fontFamily: 'inherit',
            }}>
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
