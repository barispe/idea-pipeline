import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useIdeasStore, useFilteredIdeas } from '../store/useIdeasStore';
import { StatusBadge, PriorityBadge, ProgressBar } from './Badges';
import { DetailPanel } from './DetailPanel';
import { Github, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'updatedAt' | 'createdAt' | 'title' | 'progress' | 'priority';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER: Record<string, number> = {
    critical: 3,
    high: 2,
    medium: 1,
    low: 0,
};

const SORT_OPTIONS: { key: SortField; label: string }[] = [
    { key: 'updatedAt', label: 'Updated' },
    { key: 'createdAt', label: 'Created' },
    { key: 'title', label: 'Title' },
    { key: 'progress', label: 'Progress' },
    { key: 'priority', label: 'Priority' },
];

export function ListView() {
    const { setSelectedIdea, ideas: allIdeas, filters } = useIdeasStore();
    const filtered = useFilteredIdeas();
    const selectedIdea = useIdeasStore((s) => s.ideas.find((i) => i.id === s.selectedIdeaId));

    const [sortField, setSortField] = useState<SortField>('updatedAt');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    function handleSort(field: SortField) {
        if (field === sortField) {
            setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    }

    const ideas = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case 'updatedAt':
                    cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                    break;
                case 'createdAt':
                    cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'title':
                    cmp = a.title.localeCompare(b.title);
                    break;
                case 'progress':
                    cmp = a.progress - b.progress;
                    break;
                case 'priority':
                    cmp = (PRIORITY_ORDER[a.priority] ?? 0) - (PRIORITY_ORDER[b.priority] ?? 0);
                    break;
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortField, sortDir]);

    const hasFiltersApplied =
        filters.search !== '' ||
        filters.status !== 'all' ||
        filters.priority !== 'all' ||
        filters.tag !== 'all' ||
        filters.category !== 'all';

    if (ideas.length === 0) {
        return (
            <div className="list-container">
                <div className="empty-state">
                    {allIdeas.length === 0 ? (
                        <>
                            <span className="empty-state-icon">💡</span>
                            <span className="empty-state-title">No ideas yet</span>
                            <span className="empty-state-desc">Click "New Idea" in the sidebar to capture your first idea!</span>
                        </>
                    ) : (
                        <>
                            <span className="empty-state-icon">🔍</span>
                            <span className="empty-state-title">No ideas match your filters</span>
                            <span className="empty-state-desc">
                                {hasFiltersApplied
                                    ? 'Try adjusting your search or clearing the active filters in the sidebar.'
                                    : 'No ideas in this view.'}
                            </span>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="list-container">
                {/* Sort Bar */}
                <div className="list-sort-bar">
                    <span className="list-sort-label">Sort by</span>
                    {SORT_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            className={`list-sort-btn${sortField === key ? ' active' : ''}`}
                            onClick={() => handleSort(key)}
                            aria-pressed={sortField === key}
                            title={`Sort by ${label}`}
                        >
                            {label}
                            {sortField === key && (
                                sortDir === 'desc'
                                    ? <ChevronDown size={12} />
                                    : <ChevronUp size={12} />
                            )}
                        </button>
                    ))}
                    <span className="list-sort-count">{ideas.length} idea{ideas.length !== 1 ? 's' : ''}</span>
                </div>

                {ideas.map((idea) => {
                    const doneTodos = idea.todos.filter((t) => t.completed).length;
                    return (
                        <div key={idea.id} className="list-row" onClick={() => setSelectedIdea(idea.id)}>
                            <span className="list-row-emoji">{idea.coverEmoji}</span>
                            <div className="list-row-info">
                                <div className="list-row-title">{idea.title}</div>
                                <div className="list-row-desc">{idea.description}</div>
                                {idea.progress > 0 && <ProgressBar value={idea.progress} />}
                            </div>
                            <div className="list-row-meta">
                                <StatusBadge status={idea.status} small />
                                <PriorityBadge priority={idea.priority} />
                                {idea.todos.length > 0 && (
                                    <span className="tag-chip">{doneTodos}/{idea.todos.length}</span>
                                )}
                                {idea.repoUrl && <Github size={14} color="var(--text-muted)" />}
                                {idea.demoUrl && <ExternalLink size={14} color="var(--text-muted)" />}
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                    {format(new Date(idea.updatedAt), 'MMM d')}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedIdea && (
                <DetailPanel
                    idea={selectedIdea}
                    onClose={() => setSelectedIdea(null)}
                />
            )}
        </>
    );
}
