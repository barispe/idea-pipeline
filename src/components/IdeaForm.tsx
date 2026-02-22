import { useState } from 'react';
import type { Idea, IdeaStatus, Priority, IdeaCategory } from '../types/idea';
import { STATUS_CONFIG, ALL_STATUSES } from '../types/idea';
import { useIdeasStore } from '../store/useIdeasStore';
import { X } from 'lucide-react';

const EMOJIS = ['💡', '🤖', '🔨', '🚀', '🎮', '📱', '🔬', '🧪', '🌱', '💰', '🔐', '🎯',
    '🌐', '🗺️', '📋', '⚡', '🛡️', '🔄', '📝', '🎬', '🏠', '🔊', '🍞', '🏊', '🐾', '🎤',
    '⚖️', '🌡️', '👴', '🗃️', '📡', '🔒', '📵', '🕸️', '👁️', '🏗️', '🔀', '🌉', '🔬', '💓'];

interface IdeaFormProps {
    onClose: () => void;
    onSubmit: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'todos' | 'logs'>) => void;
    initial?: Partial<Idea>;
    title?: string;
}

export function IdeaForm({ onClose, onSubmit, initial, title = 'New Idea' }: IdeaFormProps) {
    const { categories } = useIdeasStore();
    const [form, setForm] = useState({
        title: initial?.title ?? '',
        description: initial?.description ?? '',
        status: (initial?.status ?? 'spark') as IdeaStatus,
        priority: (initial?.priority ?? 'medium') as Priority,
        category: (initial?.category ?? 'project') as IdeaCategory,
        coverEmoji: initial?.coverEmoji ?? '💡',
        tags: initial?.tags?.join(', ') ?? '',
        techStack: initial?.techStack?.join(', ') ?? '',
        repoUrl: initial?.repoUrl ?? '',
        demoUrl: initial?.demoUrl ?? '',
        notes: initial?.notes ?? '',
        progress: initial?.progress ?? 0,
        targetDate: initial?.targetDate ?? '',
    });

    function set(key: string, value: string | number) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.title.trim()) return;
        onSubmit({
            title: form.title.trim(),
            description: form.description.trim(),
            status: form.status,
            priority: form.priority,
            category: form.category,
            coverEmoji: form.coverEmoji,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
            repoUrl: form.repoUrl.trim(),
            demoUrl: form.demoUrl.trim(),
            notes: form.notes.trim(),
            progress: form.progress,
            targetDate: form.targetDate || null,
        });
        onClose();
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">✨ {title}</span>
                    <button className="panel-close" onClick={onClose}><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Emoji */}
                        <div className="field-group">
                            <div className="field-label">Icon</div>
                            <div className="emoji-row">
                                {EMOJIS.map((e) => (
                                    <div
                                        key={e}
                                        className={`emoji-opt ${form.coverEmoji === e ? 'selected' : ''}`}
                                        onClick={() => set('coverEmoji', e)}
                                    >{e}</div>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="field-group">
                            <div className="field-label">Title *</div>
                            <input
                                className="field-input"
                                placeholder="What's the idea?"
                                value={form.title}
                                onChange={(e) => set('title', e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        {/* Description */}
                        <div className="field-group">
                            <div className="field-label">Description</div>
                            <textarea
                                className="field-textarea"
                                placeholder="Describe the problem it solves..."
                                value={form.description}
                                onChange={(e) => set('description', e.target.value)}
                                style={{ minHeight: 70 }}
                            />
                        </div>

                        <div className="fields-row">
                            {/* Status */}
                            <div className="field-group">
                                <div className="field-label">Status</div>
                                <select
                                    className="field-select"
                                    value={form.status}
                                    onChange={(e) => set('status', e.target.value)}
                                >
                                    {ALL_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div className="field-group">
                                <div className="field-label">Priority</div>
                                <select
                                    className="field-select"
                                    value={form.priority}
                                    onChange={(e) => set('priority', e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="fields-row">
                            {/* Category */}
                            <div className="field-group">
                                <div className="field-label">Category</div>
                                <select
                                    className="field-select"
                                    value={form.category}
                                    onChange={(e) => set('category', e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Target Date */}
                            <div className="field-group">
                                <div className="field-label">Target Date</div>
                                <input
                                    className="field-input"
                                    type="date"
                                    value={form.targetDate}
                                    onChange={(e) => set('targetDate', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="field-group">
                            <div className="field-label">Tags (comma separated)</div>
                            <input
                                className="field-input"
                                placeholder="AI, CLI, Python..."
                                value={form.tags}
                                onChange={(e) => set('tags', e.target.value)}
                            />
                        </div>

                        {/* Tech Stack */}
                        <div className="field-group">
                            <div className="field-label">Tech Stack (comma separated)</div>
                            <input
                                className="field-input"
                                placeholder="React, Node.js, PostgreSQL..."
                                value={form.techStack}
                                onChange={(e) => set('techStack', e.target.value)}
                            />
                        </div>

                        <div className="fields-row">
                            {/* Repo */}
                            <div className="field-group">
                                <div className="field-label">Repo URL</div>
                                <input
                                    className="field-input"
                                    placeholder="https://github.com/..."
                                    value={form.repoUrl}
                                    onChange={(e) => set('repoUrl', e.target.value)}
                                />
                            </div>

                            {/* Demo */}
                            <div className="field-group">
                                <div className="field-label">Demo / Live URL</div>
                                <input
                                    className="field-input"
                                    placeholder="https://..."
                                    value={form.demoUrl}
                                    onChange={(e) => set('demoUrl', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">✨ Create Idea</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
