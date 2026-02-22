import { useRef } from 'react';
import { useIdeasStore } from '../store/useIdeasStore';
import { LayoutDashboard, Columns2, List, Clock, Search, AlignLeft, Download, Upload, X, Keyboard, Sun, Moon } from 'lucide-react';

const VIEW_LABELS: Record<string, string> = {
    dashboard: '📊 Dashboard',
    board: '🗂️ Kanban Board',
    list: '📋 All Ideas',
    timeline: '🕐 Timeline',
};

interface HeaderProps {
    onNewIdea: () => void;
    onShowShortcuts: () => void;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

export function Header({ onNewIdea, onShowShortcuts, theme, onToggleTheme }: HeaderProps) {
    const { view, setView, filters, setFilters, exportIdeas, importIdeas, importError, clearImportError } = useIdeasStore();
    const importRef = useRef<HTMLInputElement>(null);

    async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        await importIdeas(file);
        // Only reset the file input when import succeeded (no error in store)
        if (!useIdeasStore.getState().importError) {
            e.target.value = '';
        }
    }

    return (
        <>
            {/* Import error banner */}
            {importError && (
                <div className="import-error-banner" role="alert">
                    <span>{importError}</span>
                    <button
                        className="import-error-close"
                        onClick={() => { clearImportError(); if (importRef.current) importRef.current.value = ''; }}
                        aria-label="Dismiss error"
                    >
                        <X size={13} />
                    </button>
                </div>
            )}

            <div className="header">
                <span className="header-title">{VIEW_LABELS[view] ?? 'Ideas'}</span>

                <div className="header-search">
                    <Search size={14} className="search-icon" />
                    <input
                        className="search-input"
                        aria-label="Search ideas"
                        placeholder="Search ideas..."
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                    />
                </div>

                <div className="header-actions">
                    {/* Export / Import */}
                    <button
                        className="btn btn-ghost header-icon-btn"
                        title="Export ideas to JSON"
                        aria-label="Export ideas to JSON"
                        onClick={exportIdeas}
                    >
                        <Download size={14} />
                        <span>Export</span>
                    </button>
                    <button
                        className="btn btn-ghost header-icon-btn"
                        title="Import ideas from JSON"
                        aria-label="Import ideas from JSON"
                        onClick={() => importRef.current?.click()}
                    >
                        <Upload size={14} />
                        <span>Import</span>
                    </button>
                    <input
                        ref={importRef}
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleImport}
                    />

                    {/* Theme toggle */}
                    <button
                        className="btn btn-ghost header-icon-btn"
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        onClick={onToggleTheme}
                    >
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    </button>

                    {/* Keyboard shortcuts help */}
                    <button
                        className="btn btn-ghost header-icon-btn"
                        title="Keyboard shortcuts (?)"
                        aria-label="Show keyboard shortcuts"
                        onClick={onShowShortcuts}
                    >
                        <Keyboard size={14} />
                    </button>

                    {/* View switcher */}
                    <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: 3 }}>
                        {[
                            { key: 'dashboard', icon: <LayoutDashboard size={14} />, label: 'Dashboard' },
                            { key: 'board', icon: <Columns2 size={14} />, label: 'Board' },
                            { key: 'list', icon: <AlignLeft size={14} />, label: 'List' },
                            { key: 'timeline', icon: <Clock size={14} />, label: 'Timeline' },
                        ].map(({ key, icon, label }) => (
                            <button
                                key={key}
                                className={`btn-icon ${view === key ? 'active' : ''}`}
                                title={label}
                                aria-label={label}
                                aria-pressed={view === key}
                                onClick={() => setView(key as typeof view)}
                                style={{ border: 'none' }}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
