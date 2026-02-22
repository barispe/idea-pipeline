import { format } from 'date-fns';
import { useIdeasStore, useFilteredIdeas } from '../store/useIdeasStore';
import { StatusBadge, PriorityBadge } from './Badges';
import { DetailPanel } from './DetailPanel';

export function TimelineView() {
    const { setSelectedIdea } = useIdeasStore();
    const ideas = useFilteredIdeas();
    const selectedIdea = useIdeasStore((s) => s.ideas.find((i) => i.id === s.selectedIdeaId));

    // Group by updated month
    const sorted = [...ideas].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const groups: Record<string, typeof sorted> = {};
    for (const idea of sorted) {
        const key = format(new Date(idea.updatedAt), 'MMMM yyyy');
        if (!groups[key]) groups[key] = [];
        groups[key].push(idea);
    }

    if (ideas.length === 0) {
        return (
            <div className="list-container flex-center">
                <div className="empty-state">
                    <span className="empty-state-icon">🗓️</span>
                    <span className="empty-state-title">No ideas match your filters</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="timeline-container">
                {Object.entries(groups).map(([month, items]) => (
                    <div key={month} className="timeline-group">
                        <div className="timeline-group-label">{month}</div>
                        {items.map((idea) => (
                            <div
                                key={idea.id}
                                className="timeline-item"
                                onClick={() => setSelectedIdea(idea.id)}
                            >
                                <span style={{ fontSize: 22, flexShrink: 0 }}>{idea.coverEmoji}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {idea.title}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {idea.description}
                                    </div>
                                    {idea.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                                            {idea.tags.slice(0, 4).map((t) => (
                                                <span key={t} className="tag-chip">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                                    <StatusBadge status={idea.status} small />
                                    <PriorityBadge priority={idea.priority} />
                                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                                        {format(new Date(idea.updatedAt), 'MMM d')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
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
