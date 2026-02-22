import { format } from 'date-fns';
import { useIdeasStore, useFilteredIdeas } from '../store/useIdeasStore';
import { StatusBadge, PriorityBadge, ProgressBar } from './Badges';
import { DetailPanel } from './DetailPanel';
import { Github, ExternalLink } from 'lucide-react';

export function ListView() {
    const { setSelectedIdea } = useIdeasStore();
    const ideas = useFilteredIdeas();
    const selectedIdea = useIdeasStore((s) => s.ideas.find((i) => i.id === s.selectedIdeaId));

    if (ideas.length === 0) {
        return (
            <div className="list-container">
                <div className="empty-state">
                    <span className="empty-state-icon">🔍</span>
                    <span className="empty-state-title">No ideas match your filters</span>
                    <span className="empty-state-desc">Try adjusting your search or filters</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="list-container">
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
