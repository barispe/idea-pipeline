import { useState } from 'react';
import { useIdeasStore, DEFAULT_CATEGORIES } from '../store/useIdeasStore';
import { ALL_STATUSES, STATUS_CONFIG } from '../types/idea';
import { LayoutDashboard, List, Columns2, Clock, Plus, Flame, Star, X, Check } from 'lucide-react';

interface SidebarProps {
    onNewIdea: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
    project: '🔨',
    app: '📱',
    other: '✨',
};

function getCategoryEmoji(cat: string) {
    return CATEGORY_EMOJI[cat] ?? '🏷️';
}

export function Sidebar({ onNewIdea }: SidebarProps) {
    const { view, setView, filters, setFilters, ideas, categories, addCategory, removeCategory } = useIdeasStore();
    const filteredStatus = filters.status;
    const [addingCat, setAddingCat] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    const allTags = Array.from(new Set(ideas.flatMap((i) => i.tags))).sort();

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">💡</div>
                <span className="sidebar-logo-name">Idea Pipeline</span>
            </div>

            {/* New Idea Button */}
            <div className="sidebar-section">
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onNewIdea}>
                    <Plus size={15} /> New Idea
                </button>
            </div>

            {/* Views */}
            <div className="sidebar-section">
                <div className="sidebar-section-label">Views</div>
                {[
                    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="nav-icon" /> },
                    { key: 'board', label: 'Board', icon: <Columns2 className="nav-icon" /> },
                    { key: 'list', label: 'All Ideas', icon: <List className="nav-icon" />, count: ideas.length },
                    { key: 'timeline', label: 'Timeline', icon: <Clock className="nav-icon" /> },
                ].map(({ key, label, icon, count }) => (
                    <div
                        key={key}
                        className={`sidebar-nav-item ${view === key ? 'active' : ''}`}
                        onClick={() => setView(key as typeof view)}
                    >
                        {icon}
                        {label}
                        {count !== undefined && <span className="nav-count">{count}</span>}
                    </div>
                ))}
            </div>

            {/* Status Filter */}
            <div className="sidebar-section">
                <div className="sidebar-section-label">Status</div>
                <div
                    className={`sidebar-nav-item ${filteredStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilters({ status: 'all' })}
                >
                    <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</span>
                    All Statuses
                    <span className="nav-count">{ideas.length}</span>
                </div>
                {ALL_STATUSES.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const count = ideas.filter((i) => i.status === s).length;
                    return (
                        <div
                            key={s}
                            className={`sidebar-nav-item ${filteredStatus === s ? 'active' : ''}`}
                            onClick={() => setFilters({ status: s })}
                        >
                            <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {cfg.emoji}
                            </span>
                            {cfg.label}
                            <span className="nav-count">{count}</span>
                        </div>
                    );
                })}
            </div>

            {/* Priority Filter */}
            <div className="sidebar-section">
                <div className="sidebar-section-label">Priority</div>
                {[
                    { key: 'all', label: 'All Priorities', icon: <Star className="nav-icon" /> },
                    { key: 'critical', label: 'Critical', icon: <Flame className="nav-icon" style={{ color: '#ef4444' }} /> },
                    { key: 'high', label: 'High', icon: <Flame className="nav-icon" style={{ color: '#f97316' }} /> },
                    { key: 'medium', label: 'Medium', icon: <Star className="nav-icon" style={{ color: '#eab308' }} /> },
                    { key: 'low', label: 'Low', icon: <Star className="nav-icon" style={{ color: '#6b7280' }} /> },
                ].map(({ key, label, icon }) => {
                    const count = key === 'all' ? ideas.length : ideas.filter((i) => i.priority === key).length;
                    return (
                        <div
                            key={key}
                            className={`sidebar-nav-item ${filters.priority === key ? 'active' : ''}`}
                            onClick={() => setFilters({ priority: key })}
                        >
                            {icon}
                            {label}
                            {count > 0 && <span className="nav-count">{count}</span>}
                        </div>
                    );
                })}
            </div>

            {/* Category */}
            <div className="sidebar-section">
                <div className="sidebar-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Category
                    <button
                        className="sidebar-add-cat-btn"
                        title="Add custom category"
                        onClick={() => { setAddingCat(true); setNewCatName(''); }}
                    >
                        <Plus size={11} />
                    </button>
                </div>

                {/* All row */}
                <div
                    className={`sidebar-nav-item ${filters.category === 'all' ? 'active' : ''}`}
                    style={{ fontSize: 12.5 }}
                    onClick={() => setFilters({ category: 'all' })}
                >
                    <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</span>
                    All
                    <span className="nav-count">{ideas.length}</span>
                </div>

                {categories.map((cat) => {
                    const count = ideas.filter((i) => i.category === cat).length;
                    const isBuiltIn = (DEFAULT_CATEGORIES as readonly string[]).includes(cat);
                    return (
                        <div
                            key={cat}
                            className={`sidebar-nav-item ${filters.category === cat ? 'active' : ''}`}
                            style={{ fontSize: 12.5 }}
                            onClick={() => setFilters({ category: cat })}
                        >
                            <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {getCategoryEmoji(cat)}
                            </span>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </span>
                            {count > 0 && <span className="nav-count">{count}</span>}
                            {!isBuiltIn && (
                                <button
                                    className="cat-remove-btn"
                                    title={`Remove "${cat}" category`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (filters.category === cat) setFilters({ category: 'all' });
                                        removeCategory(cat);
                                    }}
                                >
                                    <X size={10} />
                                </button>
                            )}
                        </div>
                    );
                })}

                {/* Inline add form */}
                {addingCat && (
                    <div className="cat-add-row">
                        <input
                            className="cat-add-input"
                            placeholder="Category name..."
                            value={newCatName}
                            autoFocus
                            onChange={(e) => setNewCatName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addCategory(newCatName);
                                    setAddingCat(false);
                                } else if (e.key === 'Escape') {
                                    setAddingCat(false);
                                }
                            }}
                        />
                        <button
                            className="cat-confirm-btn"
                            onClick={() => { addCategory(newCatName); setAddingCat(false); }}
                            title="Add"
                        >
                            <Check size={11} />
                        </button>
                        <button
                            className="cat-cancel-btn"
                            onClick={() => setAddingCat(false)}
                            title="Cancel"
                        >
                            <X size={11} />
                        </button>
                    </div>
                )}
            </div>

            {/* Top Tags */}
            {allTags.length > 0 && (
                <div className="sidebar-section">
                    <div className="sidebar-section-label">Tags</div>
                    {allTags.slice(0, 15).map((tag) => {
                        const count = ideas.filter((i) => i.tags.includes(tag)).length;
                        return (
                            <div
                                key={tag}
                                className={`sidebar-nav-item ${filters.tag === tag ? 'active' : ''}`}
                                style={{ fontSize: 12 }}
                                onClick={() => setFilters({ tag: filters.tag === tag ? 'all' : tag })}
                            >
                                <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)' }}>#</span>
                                {tag}
                                <span className="nav-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
