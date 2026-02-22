import { useMemo } from 'react';
import { useIdeasStore } from '../store/useIdeasStore';
import { STATUS_CONFIG, ALL_STATUSES } from '../types/idea';
import { DetailPanel } from './DetailPanel';
import { format } from 'date-fns';

export function DashboardView() {
    const ideas = useIdeasStore((s) => s.ideas);
    const { setSelectedIdea } = useIdeasStore();
    const selectedIdea = useIdeasStore((s) => s.ideas.find((i) => i.id === s.selectedIdeaId));

    // Memoize all derived stats so they only recalculate when ideas change
    const { total, published, building, avgProgress, withRepo, totalTodos, doneTodos, topIdeas, recentIdeas, maxCount } = useMemo(() => {
        const total = ideas.length;
        const published = ideas.filter((i) => i.status === 'published').length;
        const building = ideas.filter((i) => i.status === 'building').length;
        const avgProgress = total > 0
            ? Math.round(ideas.reduce((s, i) => s + i.progress, 0) / total)
            : 0;
        const withRepo = ideas.filter((i) => i.repoUrl).length;
        const totalTodos = ideas.reduce((s, i) => s + i.todos.length, 0);
        const doneTodos = ideas.reduce((s, i) => s + i.todos.filter((t) => t.completed).length, 0);
        const topIdeas = [...ideas]
            .filter((i) => i.status === 'building' || i.status === 'testing')
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 5);
        const recentIdeas = [...ideas]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 8);
        const maxCount = Math.max(...ALL_STATUSES.map((s) => ideas.filter((i) => i.status === s).length), 1);
        return { total, published, building, avgProgress, withRepo, totalTodos, doneTodos, topIdeas, recentIdeas, maxCount };
    }, [ideas]);

    return (
        <>
            <div className="dashboard-container">
                {/* Stats Row */}
                <div className="stats-grid">
                    {[
                        { label: 'Total Ideas', value: total, desc: `${building} in progress`, gradient: 'linear-gradient(135deg,#6366f1,#a855f7)' },
                        { label: 'Published', value: published, desc: 'shipped to the world', gradient: 'linear-gradient(135deg,#10b981,#06b6d4)' },
                        { label: 'Avg. Progress', value: `${avgProgress}%`, desc: 'across all ideas', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
                        { label: 'Have Repos', value: withRepo, desc: 'on GitHub', gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
                        { label: 'Tasks Done', value: `${doneTodos}/${totalTodos}`, desc: 'across all ideas', gradient: 'linear-gradient(135deg,#a855f7,#ec4899)' },
                    ].map(({ label, value, desc, gradient }) => (
                        <div key={label} className="stat-card">
                            <div className="stat-label">{label}</div>
                            <div className="stat-value" style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {value}
                            </div>
                            <div className="stat-desc">{desc}</div>
                        </div>
                    ))}
                </div>

                {/* Status Distribution */}
                <div className="chart-section">
                    <div className="chart-title">📊 Ideas by Status</div>
                    <div className="status-bars">
                        {ALL_STATUSES.map((s) => {
                            const cfg = STATUS_CONFIG[s];
                            const count = ideas.filter((i) => i.status === s).length;
                            const pct = (count / maxCount) * 100;
                            return (
                                <div key={s} className="status-bar-row">
                                    <span className="status-bar-label">{cfg.emoji} {cfg.label}</span>
                                    <div className="status-bar-track">
                                        <div
                                            className="status-bar-fill"
                                            style={{ width: `${pct}%`, background: cfg.color }}
                                        />
                                    </div>
                                    <span className="status-bar-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {/* In Progress */}
                    <div className="chart-section">
                        <div className="chart-title">🔨 Currently Building</div>
                        {topIdeas.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No ideas in building / testing phase</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {topIdeas.map((idea) => (
                                    <div
                                        key={idea.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedIdea(idea.id)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontSize: 16 }}>{idea.coverEmoji}</span>
                                            <span style={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {idea.title}
                                            </span>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
                                                {idea.progress}%
                                            </span>
                                        </div>
                                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#6366f1,#a855f7)', width: `${idea.progress}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recently Updated */}
                    <div className="chart-section">
                        <div className="chart-title">🕐 Recently Updated</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {recentIdeas.map((idea) => (
                                <div
                                    key={idea.id}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' }}
                                    onClick={() => setSelectedIdea(idea.id)}
                                >
                                    <span style={{ fontSize: 14 }}>{idea.coverEmoji}</span>
                                    <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                                        {idea.title}
                                    </span>
                                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)', flexShrink: 0 }}>
                                        {format(new Date(idea.updatedAt), 'MMM d')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="chart-section">
                    <div className="chart-title">🔥 Ideas by Priority</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {(['critical', 'high', 'medium', 'low'] as const).map((p) => {
                            const colors: Record<string, string> = {
                                critical: '#ef4444',
                                high: '#f97316',
                                medium: '#eab308',
                                low: '#6b7280',
                            };
                            const count = ideas.filter((i) => i.priority === p).length;
                            return (
                                <div key={p} style={{ flex: 1, minWidth: 100, background: 'var(--bg-input)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: colors[p] }}>{count}</div>
                                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: 2 }}>{p}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
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
