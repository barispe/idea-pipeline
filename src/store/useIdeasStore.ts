import { create } from 'zustand';
import type { Idea, IdeaStatus, Todo, LogEntry } from '../types/idea';
import { storage } from '../lib/storage';
import { SEED_IDEAS } from '../lib/seedData';
import localforage from 'localforage';

const CATEGORIES_KEY = '__idea_pipeline_categories__';
const DB_VERSION_KEY = '__idea_pipeline_version__';
const CURRENT_DB_VERSION = '2'; // bump this to wipe + re-seed on next load

export const DEFAULT_CATEGORIES = ['project', 'app', 'other'] as const;

interface Filters {
    search: string;
    status: IdeaStatus | 'all';
    priority: string;
    tag: string;
    category: string;
}

interface IdeasStore {
    ideas: Idea[];
    filters: Filters;
    selectedIdeaId: string | null;
    view: 'board' | 'list' | 'timeline' | 'dashboard';
    loading: boolean;
    savedAt: number | null;  // epoch ms, updated on every mutation → drives save toast
    categories: string[];    // built-in + custom
    // Actions
    loadIdeas: () => Promise<void>;
    createIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'todos' | 'logs'>) => Promise<void>;
    updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
    deleteIdea: (id: string) => Promise<void>;
    addTodo: (ideaId: string, text: string) => Promise<void>;
    toggleTodo: (ideaId: string, todoId: string) => Promise<void>;
    deleteTodo: (ideaId: string, todoId: string) => Promise<void>;
    addLog: (ideaId: string, message: string, type?: LogEntry['type']) => Promise<void>;
    setFilters: (filters: Partial<Filters>) => void;
    setSelectedIdea: (id: string | null) => void;
    setView: (view: IdeasStore['view']) => void;
    changeStatus: (id: string, newStatus: IdeaStatus) => Promise<void>;
    exportIdeas: () => void;
    importIdeas: (file: File) => Promise<void>;
    addCategory: (name: string) => Promise<void>;
    removeCategory: (name: string) => Promise<void>;
}

function makeId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useIdeasStore = create<IdeasStore>((set, get) => ({
    ideas: [],
    filters: { search: '', status: 'all', priority: 'all', tag: 'all', category: 'all' },
    selectedIdeaId: null,
    view: 'board',
    loading: true,
    savedAt: null,
    categories: [...DEFAULT_CATEGORIES],

    loadIdeas: async () => {
        try {
            // Version check — wipe and re-seed if the DB version has changed
            const storedVersion = await localforage.getItem<string>(DB_VERSION_KEY);
            if (storedVersion !== CURRENT_DB_VERSION) {
                await storage.clear();
                await localforage.removeItem(CATEGORIES_KEY);
                await localforage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
            }

            let ideas = await storage.getAll();
            if (ideas.length === 0) {
                // Seed in parallel for speed
                await Promise.all(SEED_IDEAS.map((idea) => storage.save(idea)));
                ideas = await storage.getAll();
            }
            // Load custom categories from storage
            const saved = await localforage.getItem<string[]>(CATEGORIES_KEY);
            const categories = saved ?? [...DEFAULT_CATEGORIES];
            set({ ideas, loading: false, categories });
        } catch (err) {
            console.error('Failed to load ideas from storage:', err);
            // Fall back to in-memory seed data so the app still works
            set({ ideas: SEED_IDEAS, loading: false });
        }
    },


    createIdea: async (ideaData) => {
        const idea: Idea = {
            ...ideaData,
            id: makeId(),
            todos: [],
            logs: [
                {
                    id: makeId(),
                    message: `Idea created with status: ${ideaData.status}`,
                    type: 'status_change',
                    createdAt: new Date().toISOString(),
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await storage.save(idea);
        set((s) => ({ ideas: [idea, ...s.ideas], savedAt: Date.now() }));
    },

    updateIdea: async (id, updates) => {
        const idea = get().ideas.find((i) => i.id === id);
        if (!idea) return;
        const updated: Idea = { ...idea, ...updates, updatedAt: new Date().toISOString() };
        await storage.save(updated);
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? updated : i)), savedAt: Date.now() }));
    },

    deleteIdea: async (id) => {
        await storage.delete(id);
        set((s) => ({
            ideas: s.ideas.filter((i) => i.id !== id),
            selectedIdeaId: s.selectedIdeaId === id ? null : s.selectedIdeaId,
            savedAt: Date.now(),
        }));
    },

    addTodo: async (ideaId, text) => {
        const idea = get().ideas.find((i) => i.id === ideaId);
        if (!idea) return;
        const todo: Todo = {
            id: makeId(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const updated: Idea = {
            ...idea,
            todos: [...idea.todos, todo],
            updatedAt: new Date().toISOString(),
        };
        await storage.save(updated);
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === ideaId ? updated : i)), savedAt: Date.now() }));
    },

    toggleTodo: async (ideaId, todoId) => {
        const idea = get().ideas.find((i) => i.id === ideaId);
        if (!idea) return;
        const updated: Idea = {
            ...idea,
            todos: idea.todos.map((t) =>
                t.id === todoId ? { ...t, completed: !t.completed } : t
            ),
            updatedAt: new Date().toISOString(),
        };
        await storage.save(updated);
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === ideaId ? updated : i)), savedAt: Date.now() }));
    },

    deleteTodo: async (ideaId, todoId) => {
        const idea = get().ideas.find((i) => i.id === ideaId);
        if (!idea) return;
        const updated: Idea = {
            ...idea,
            todos: idea.todos.filter((t) => t.id !== todoId),
            updatedAt: new Date().toISOString(),
        };
        await storage.save(updated);
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === ideaId ? updated : i)), savedAt: Date.now() }));
    },

    addLog: async (ideaId, message, type = 'manual') => {
        const idea = get().ideas.find((i) => i.id === ideaId);
        if (!idea) return;
        const log: LogEntry = {
            id: makeId(),
            message,
            type,
            createdAt: new Date().toISOString(),
        };
        const updated: Idea = {
            ...idea,
            logs: [log, ...idea.logs],
            updatedAt: new Date().toISOString(),
        };
        await storage.save(updated);
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === ideaId ? updated : i)), savedAt: Date.now() }));
    },

    changeStatus: async (id, newStatus) => {
        const idea = get().ideas.find((i) => i.id === id);
        if (!idea) return;
        const log: LogEntry = {
            id: makeId(),
            message: `Status changed from ${idea.status} → ${newStatus}`,
            type: 'status_change',
            createdAt: new Date().toISOString(),
        };
        const updated: Idea = {
            ...idea,
            status: newStatus,
            logs: [log, ...idea.logs],
            updatedAt: new Date().toISOString(),
        };
        await storage.save(updated);
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? updated : i)), savedAt: Date.now() }));
    },

    setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters } })),

    setSelectedIdea: (id) => set({ selectedIdeaId: id }),

    setView: (view) => set({ view }),

    addCategory: async (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const { categories } = get();
        if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return;
        const next = [...categories, trimmed];
        await localforage.setItem(CATEGORIES_KEY, next);
        set({ categories: next });
    },

    removeCategory: async (name: string) => {
        const { categories } = get();
        const next = categories.filter((c) => c !== name);
        await localforage.setItem(CATEGORIES_KEY, next);
        set({ categories: next });
    },

    exportIdeas: () => {
        const { ideas } = get();
        const json = JSON.stringify(ideas, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ideas-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importIdeas: async (file: File) => {
        const text = await file.text();
        let imported: Idea[];
        try {
            imported = JSON.parse(text);
            if (!Array.isArray(imported)) throw new Error('Not an array');
        } catch {
            alert('Invalid JSON file. Please export from Idea Pipeline first.');
            return;
        }
        // Merge: imported ideas win over existing ones with same id
        const existing = get().ideas;
        const merged = [...existing];
        for (const idea of imported) {
            const idx = merged.findIndex((i) => i.id === idea.id);
            if (idx >= 0) merged[idx] = idea;
            else merged.push(idea);
        }
        await Promise.all(merged.map((idea) => storage.save(idea)));
        set({ ideas: merged, savedAt: Date.now() });
    },
}));

export function useFilteredIdeas() {
    const { ideas, filters } = useIdeasStore();
    return ideas.filter((idea) => {
        if (filters.search) {
            const q = filters.search.toLowerCase();
            if (
                !idea.title.toLowerCase().includes(q) &&
                !idea.description.toLowerCase().includes(q) &&
                !idea.tags.some((t) => t.toLowerCase().includes(q))
            )
                return false;
        }
        if (filters.status !== 'all' && idea.status !== filters.status) return false;
        if (filters.priority !== 'all' && idea.priority !== filters.priority) return false;
        if (filters.tag !== 'all' && !idea.tags.includes(filters.tag)) return false;
        if (filters.category !== 'all' && idea.category !== filters.category) return false;
        return true;
    });
}
