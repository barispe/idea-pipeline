import type { Idea } from '../types/idea';
import { StatusBadge, PriorityBadge, ProgressBar } from './Badges';
import { Github, ExternalLink } from 'lucide-react';

interface IdeaCardProps {
    idea: Idea;
    onClick: () => void;
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
    const doneTodos = idea.todos.filter((t) => t.completed).length;

    return (
        <div className="idea-card" onClick={onClick}>
            <span className="card-emoji">{idea.coverEmoji}</span>
            <div className="card-title">{idea.title}</div>
            {idea.description && (
                <div className="card-desc">{idea.description}</div>
            )}

            {idea.tags.length > 0 && (
                <div className="card-tags">
                    {idea.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                    {idea.tags.length > 3 && (
                        <span className="tag-chip">+{idea.tags.length - 3}</span>
                    )}
                </div>
            )}

            {idea.progress > 0 && <ProgressBar value={idea.progress} />}

            <div className="card-meta">
                <PriorityBadge priority={idea.priority} />
                {idea.todos.length > 0 && (
                    <span className="tag-chip">
                        {doneTodos}/{idea.todos.length} tasks
                    </span>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                    {idea.repoUrl && (
                        <span title="Has repo" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                            <Github size={12} />
                        </span>
                    )}
                    {idea.demoUrl && (
                        <span title="Has demo" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                            <ExternalLink size={12} />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
