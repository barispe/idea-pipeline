import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { marked } from 'marked';
import {
    X, Github, ExternalLink, Check, Trash2, Plus,
    ChevronDown, Clock, Calendar, Eye, Edit2
} from 'lucide-react';
import type { Idea, IdeaStatus } from '../types/idea';
import { ALL_STATUSES, STATUS_CONFIG, PRIORITY_CONFIG } from '../types/idea';
import { useIdeasStore } from '../store/useIdeasStore';
import { EMOJIS } from '../lib/constants';
// categories pulled from store so custom categories appear here too
import { StatusBadge, PriorityBadge, ProgressBar } from './Badges';

type Tab = 'overview' | 'todos' | 'notes' | 'log';

interface DetailPanelProps {
    idea: Idea;
    onClose: () => void;
}

export function DetailPanel({ idea, onClose }: DetailPanelProps) {
    const { updateIdea, deleteIdea, addTodo, toggleTodo, deleteTodo, addLog, changeStatus, categories } = useIdeasStore();

    const [tab, setTab] = useState<Tab>('overview');
    const [todoInput, setTodoInput] = useState('');
    const [logInput, setLogInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [notesPreview, setNotesPreview] = useState(false);

    const notesHtml = useMemo(
        () => marked(idea.notes || '_No notes yet. Switch to Edit to start writing._') as string,
        [idea.notes]
    );

    function update(field: keyof Idea, value: unknown) {
        updateIdea(idea.id, { [field]: value });
    }

    function isValidUrl(url: string) {
        if (!url) return true; // empty is fine
        try { new URL(url); return true; } catch { return false; }
    }

    function handleStatusChange(newStatus: IdeaStatus) {
        changeStatus(idea.id, newStatus);
    }

    function handleAddTodo() {
        const text = todoInput.trim();
        if (!text) return;
        addTodo(idea.id, text);
        setTodoInput('');
    }

    function handleAddLog() {
        const msg = logInput.trim();
        if (!msg) return;
        addLog(idea.id, msg, 'manual');
        setLogInput('');
    }

    function handleDelete() {
        if (confirmDelete) {
            deleteIdea(idea.id);
            onClose();
        } else {
            setConfirmDelete(true);
        }
    }

    const doneTodos = idea.todos.filter((t) => t.completed).length;

    return (
        <>
            <div className="panel-overlay" onClick={onClose} />
            <div className="detail-panel">
                {/* Header */}
                <div className="panel-header">
                    <div
                        className="panel-emoji"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        title="Click to change emoji"
                    >
                        {idea.coverEmoji}
                    </div>
                    <div className="panel-header-info">
                        <textarea
                            className="panel-title"
                            rows={2}
                            value={idea.title}
                            onChange={(e) => update('title', e.target.value)}
                        />
                        <div className="panel-header-badges">
                            <StatusBadge status={idea.status} small />
                            <PriorityBadge priority={idea.priority} />
                            {idea.todos.length > 0 && (
                                <span className="tag-chip">{doneTodos}/{idea.todos.length} tasks</span>
                            )}
                        </div>
                    </div>
                    <button className="panel-close" onClick={onClose}><X size={18} /></button>
                </div>

                {/* Emoji picker */}
                {showEmojiPicker && (
                    <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
                        <div className="emoji-row">
                            {EMOJIS.map((e) => (
                                <div
                                    key={e}
                                    className={`emoji-opt ${idea.coverEmoji === e ? 'selected' : ''}`}
                                    onClick={() => { update('coverEmoji', e); setShowEmojiPicker(false); }}
                                >{e}</div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="panel-tabs">
                    {(['overview', 'todos', 'notes', 'log'] as Tab[]).map((t) => (
                        <button key={t} className={`panel-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                            {t === 'overview' && '📊 Overview'}
                            {t === 'todos' && `✅ Tasks ${idea.todos.length > 0 ? `(${doneTodos}/${idea.todos.length})` : ''}`}
                            {t === 'notes' && '📝 Notes'}
                            {t === 'log' && '📜 Log'}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="panel-body">

                    {/* ─── OVERVIEW TAB ─── */}
                    {tab === 'overview' && (
                        <>
                            {/* Description */}
                            <div className="field-group">
                                <div className="field-label">Description</div>
                                <textarea
                                    className="field-textarea"
                                    value={idea.description}
                                    onChange={(e) => update('description', e.target.value)}
                                    placeholder="Describe the idea..."
                                    style={{ minHeight: 80 }}
                                />
                            </div>

                            {/* Status */}
                            <div className="field-group">
                                <div className="field-label">Status</div>
                                <div className="status-select-row">
                                    {ALL_STATUSES.map((s) => {
                                        const cfg = STATUS_CONFIG[s];
                                        return (
                                            <div
                                                key={s}
                                                className={`status-option ${idea.status === s ? 'selected' : ''}`}
                                                style={{ color: cfg.color, background: cfg.bg }}
                                                onClick={() => handleStatusChange(s)}
                                            >
                                                {cfg.emoji} {cfg.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="fields-row">
                                {/* Priority */}
                                <div className="field-group">
                                    <div className="field-label">Priority</div>
                                    <select
                                        className="field-select"
                                        value={idea.priority}
                                        onChange={(e) => update('priority', e.target.value)}
                                    >
                                        {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                                            <option key={p} value={p}>
                                                {PRIORITY_CONFIG[p].label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category — uses store categories so custom ones appear */}
                                <div className="field-group">
                                    <div className="field-label">Category</div>
                                    <select
                                        className="field-select"
                                        value={idea.category}
                                        onChange={(e) => update('category', e.target.value)}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="progress-section">
                                <div className="progress-header">
                                    <div className="field-label">Progress</div>
                                    <span className="progress-value">{idea.progress}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={idea.progress}
                                    onChange={(e) => update('progress', Number(e.target.value))}
                                />
                                <ProgressBar value={idea.progress} height={6} />
                            </div>

                            {/* Tech Stack */}
                            <div className="field-group">
                                <div className="field-label">Tech Stack</div>
                                <input
                                    className="field-input"
                                    placeholder="React, Node.js..."
                                    value={idea.techStack.join(', ')}
                                    onChange={(e) =>
                                        update('techStack', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
                                    }
                                />
                                {idea.techStack.length > 0 && (
                                    <div className="tech-tags" style={{ marginTop: 6 }}>
                                        {idea.techStack.map((t) => (
                                            <span key={t} className="tech-tag">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="field-group">
                                <div className="field-label">Tags</div>
                                <input
                                    className="field-input"
                                    placeholder="AI, CLI, Python..."
                                    value={idea.tags.join(', ')}
                                    onChange={(e) =>
                                        update('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
                                    }
                                />
                            </div>

                            {/* Target Date */}
                            <div className="field-group">
                                <div className="field-label"><Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />Target Date</div>
                                <div className="date-clear-row">
                                    <input
                                        className="field-input"
                                        type="date"
                                        style={{ flex: 1 }}
                                        value={idea.targetDate ?? ''}
                                        onChange={(e) => update('targetDate', e.target.value || null)}
                                    />
                                    {idea.targetDate && (
                                        <button
                                            className="date-clear-btn"
                                            title="Clear target date"
                                            onClick={() => update('targetDate', null)}
                                        >
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Repo URL */}
                            <div className="field-group">
                                <div className="field-label">Repository URL</div>
                                <div className="link-row">
                                    <Github size={14} className="link-icon" />
                                    <input
                                        placeholder="https://github.com/..."
                                        value={idea.repoUrl}
                                        onChange={(e) => update('repoUrl', e.target.value)}
                                        className={idea.repoUrl && !isValidUrl(idea.repoUrl) ? 'input-invalid' : ''}
                                    />
                                    {idea.repoUrl && isValidUrl(idea.repoUrl) && (
                                        <button className="link-open-btn" onClick={() => window.open(idea.repoUrl, '_blank')}>
                                            <ExternalLink size={13} />
                                        </button>
                                    )}
                                </div>
                                {idea.repoUrl && !isValidUrl(idea.repoUrl) && (
                                    <span className="url-warning">Not a valid URL (must start with https://)</span>
                                )}
                            </div>

                            {/* Demo URL */}
                            <div className="field-group">
                                <div className="field-label">Demo / Live URL</div>
                                <div className="link-row">
                                    <ExternalLink size={14} className="link-icon" />
                                    <input
                                        placeholder="https://..."
                                        value={idea.demoUrl}
                                        onChange={(e) => update('demoUrl', e.target.value)}
                                        className={idea.demoUrl && !isValidUrl(idea.demoUrl) ? 'input-invalid' : ''}
                                    />
                                    {idea.demoUrl && isValidUrl(idea.demoUrl) && (
                                        <button className="link-open-btn" onClick={() => window.open(idea.demoUrl, '_blank')}>
                                            <ExternalLink size={13} />
                                        </button>
                                    )}
                                </div>
                                {idea.demoUrl && !isValidUrl(idea.demoUrl) && (
                                    <span className="url-warning">Not a valid URL (must start with https://)</span>
                                )}
                            </div>

                            {/* Meta */}
                            <div style={{ display: 'flex', gap: 16, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={11} /> Created {format(new Date(idea.createdAt), 'MMM d, yyyy')}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={11} /> Updated {format(new Date(idea.updatedAt), 'MMM d, yyyy')}
                                </div>
                            </div>

                            {/* Delete */}
                            <div style={{ paddingTop: 4 }}>
                                {confirmDelete ? (
                                    <div className="delete-confirm-row">
                                        <span className="delete-confirm-label">⚠️ This cannot be undone.</span>
                                        <button className="btn btn-danger" onClick={handleDelete} style={{ padding: '6px 14px' }}>
                                            Yes, delete
                                        </button>
                                        <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)} style={{ padding: '6px 14px' }}>
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button className="btn btn-danger" onClick={handleDelete} style={{ width: '100%', justifyContent: 'center' }}>
                                        <Trash2 size={14} />
                                        Delete Idea
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* ─── TODOS TAB ─── */}
                    {tab === 'todos' && (
                        <>
                            <div className="todo-input-row">
                                <input
                                    className="todo-add-input"
                                    placeholder="Add a task..."
                                    value={todoInput}
                                    onChange={(e) => setTodoInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                                />
                                <button className="btn btn-primary" onClick={handleAddTodo} style={{ padding: '8px 12px' }}>
                                    <Plus size={15} />
                                </button>
                            </div>

                            {idea.todos.length === 0 ? (
                                <div className="empty-state">
                                    <span className="empty-state-icon">✅</span>
                                    <span className="empty-state-title">No tasks yet</span>
                                    <span className="empty-state-desc">Break this idea into actionable steps</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {idea.todos.map((todo) => (
                                        <div key={todo.id} className="todo-item">
                                            <div
                                                className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                                                onClick={() => toggleTodo(idea.id, todo.id)}
                                            >
                                                {todo.completed && <Check size={11} color="#fff" strokeWidth={3} />}
                                            </div>
                                            <span className={`todo-text ${todo.completed ? 'done' : ''}`}>
                                                {todo.text}
                                            </span>
                                            <button className="todo-delete" onClick={() => deleteTodo(idea.id, todo.id)}>
                                                <X size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* ─── NOTES TAB ─── */}
                    {tab === 'notes' && (
                        <div className="field-group" style={{ flex: 1 }}>
                            <div className="notes-tab-header">
                                <div className="field-label">Notes</div>
                                <div className="notes-toggle">
                                    <button
                                        className={`notes-toggle-btn${!notesPreview ? ' active' : ''}`}
                                        onClick={() => setNotesPreview(false)}
                                        title="Edit"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        className={`notes-toggle-btn${notesPreview ? ' active' : ''}`}
                                        onClick={() => setNotesPreview(true)}
                                        title="Preview rendered markdown"
                                    >
                                        <Eye size={12} /> Preview
                                    </button>
                                </div>
                            </div>
                            {notesPreview ? (
                                <div
                                    className="notes-preview"
                                    dangerouslySetInnerHTML={{ __html: notesHtml }}
                                />
                            ) : (
                                <textarea
                                    className="field-textarea"
                                    value={idea.notes}
                                    onChange={(e) => update('notes', e.target.value)}
                                    placeholder="Supports markdown: **bold**, _italic_, ## headings, - lists, [links](url)..."
                                    style={{ minHeight: 300, lineHeight: 1.7 }}
                                />
                            )}
                        </div>
                    )}

                    {/* ─── LOG TAB ─── */}
                    {tab === 'log' && (
                        <>
                            <div className="todo-input-row">
                                <input
                                    className="todo-add-input"
                                    placeholder="Add a manual log entry..."
                                    value={logInput}
                                    onChange={(e) => setLogInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
                                />
                                <button className="btn btn-primary" onClick={handleAddLog} style={{ padding: '8px 12px' }}>
                                    <Plus size={15} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {idea.logs.map((log) => (
                                    <div key={log.id} className={`log-entry ${log.type}`}>
                                        <div className="log-dot" />
                                        <div>
                                            <div className="log-message">{log.message}</div>
                                            <div className="log-time">
                                                {format(new Date(log.createdAt), 'MMM d, yyyy · h:mm a')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
