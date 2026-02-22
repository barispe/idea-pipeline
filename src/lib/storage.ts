import localforage from 'localforage';
import type { Idea } from '../types/idea';


const store = localforage.createInstance({
    name: 'idea-pipeline',
    storeName: 'ideas',
});

export const storage = {
    async getAll(): Promise<Idea[]> {
        const keys = await store.keys();
        const ideas = await Promise.all(keys.map((k) => store.getItem<Idea>(k)));
        return (ideas.filter(Boolean) as Idea[]).sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    },

    async get(id: string): Promise<Idea | null> {
        return store.getItem<Idea>(id);
    },

    async save(idea: Idea): Promise<void> {
        try {
            await store.setItem(idea.id, idea);
        } catch (err) {
            console.error('[storage] Failed to save idea:', idea.id, err);
            throw err; // re-throw so the store's action can surface it if needed
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await store.removeItem(id);
        } catch (err) {
            console.error('[storage] Failed to delete idea:', id, err);
            throw err;
        }
    },

    async clear(): Promise<void> {
        try {
            await store.clear();
        } catch (err) {
            console.error('[storage] Failed to clear store:', err);
            throw err;
        }
    },
};
