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
        await store.setItem(idea.id, idea);
    },

    async delete(id: string): Promise<void> {
        await store.removeItem(id);
    },

    async clear(): Promise<void> {
        await store.clear();
    },
};
