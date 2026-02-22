import { useState } from 'react';
import type { Idea, IdeaStatus, Priority, IdeaCategory } from '../types/idea';
import { STATUS_CONFIG, ALL_STATUSES } from '../types/idea';
import { useIdeasStore } from '../store/useIdeasStore';
import { X } from 'lucide-react';
import { EMOJIS } from '../lib/constants';

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
            <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">✨ {title}</span>
                    <button className="panel-close" onClick={onClose} aria-label="Close form"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Emoji — A1: each emoji is a <button> */}
                        <div className="field-group">
                            <label className="field-label" id="emoji-label">Icon</label>
                            <div className="emoji-row" role="group" aria-labelledby="emoji-label">
                                {EMOJIS.map((e) => (
                                    <button
                                        key={e}
                                        type="button"
                                        className={`emoji-opt ${form.coverEmoji === e ? 'selected' : ''}`}
                                        onClick={() => set('coverEmoji', e)}
                                        aria-label={`Select emoji ${e}`}
                                        aria-pressed={form.coverEmoji === e}
                                    >{e}</button>
                                ))}
                            </div>
                        </div>

                        {/* Title — A3: <label htmlFor> */}
                        <div className="field-group">
                            <label className="field-label" htmlFor="form-title">Title *</label>
                            <input
                                id="form-title"
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
                            <label className="field-label" htmlFor="form-desc">Description</label>
                            <textarea
                                id="form-desc"
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
                                <label className="field-label" htmlFor="form-status">Status</label>
                                <select
                                    id="form-status"
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
                                <label className="field-label" htmlFor="form-priority">Priority</label>
                                <select
                                    id="form-priority"
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
                                <label className="field-label" htmlFor="form-category">Category</label>
                                <select
                                    id="form-category"
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
                                <label className="field-label" htmlFor="form-date">Target Date</label>
                                <input
                                    id="form-date"
                                    className="field-input"
                                    type="date"
                                    value={form.targetDate}
                                    onChange={(e) => set('targetDate', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="field-group">
                            <label className="field-label" htmlFor="form-tags">Tags (comma separated)</label>
                            <input
                                id="form-tags"
                                className="field-input"
                                placeholder="AI, CLI, Python..."
                                value={form.tags}
                                onChange={(e) => set('tags', e.target.value)}
                            />
                        </div>

                        {/* Tech Stack */}
                        <div className="field-group">
                            <label className="field-label" htmlFor="form-stack">Tech Stack (comma separated)</label>
                            <input
                                id="form-stack"
                                className="field-input"
                                placeholder="React, Node.js, PostgreSQL..."
                                value={form.techStack}
                                onChange={(e) => set('techStack', e.target.value)}
                            />
                        </div>

                        <div className="fields-row">
                            {/* Repo */}
                            <div className="field-group">
                                <label className="field-label" htmlFor="form-repo">Repo URL</label>
                                <input
                                    id="form-repo"
                                    className="field-input"
                                    placeholder="https://github.com/..."
                                    value={form.repoUrl}
                                    onChange={(e) => set('repoUrl', e.target.value)}
                                />
                            </div>

                            {/* Demo */}
                            <div className="field-group">
                                <label className="field-label" htmlFor="form-demo">Demo / Live URL</label>
                                <input
                                    id="form-demo"
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
