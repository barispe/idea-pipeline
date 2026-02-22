import { useRef } from 'react';
import { useIdeasStore } from '../store/useIdeasStore';
import { LayoutDashboard, Columns2, List, Clock, Search, AlignLeft, Download, Upload } from 'lucide-react';

const VIEW_LABELS: Record<string, string> = {
    dashboard: '📊 Dashboard',
    board: '🗂️ Kanban Board',
    list: '📋 All Ideas',
    timeline: '🕐 Timeline',
};

interface HeaderProps {
    onNewIdea: () => void;
}

export function Header({ onNewIdea }: HeaderProps) {
    const { view, setView, filters, setFilters, exportIdeas, importIdeas } = useIdeasStore();
    const importRef = useRef<HTMLInputElement>(null);

    function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) importIdeas(file);
        e.target.value = '';
    }

    return (
        <div className="header">
            <span className="header-title">{VIEW_LABELS[view] ?? 'Ideas'}</span>

            <div className="header-search">
                <Search size={14} className="search-icon" />
                <input
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
                    onClick={exportIdeas}
                >
                    <Download size={14} />
                    <span>Export</span>
                </button>
                <button
                    className="btn btn-ghost header-icon-btn"
                    title="Import ideas from JSON"
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
                            onClick={() => setView(key as typeof view)}
                            style={{ border: 'none' }}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
