import type { Idea } from '../types/idea';

function ago(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
}

export const SEED_IDEAS: Idea[] = [
    // 1. Spark — fresh idea, nothing started
    {
        id: 'seed-1',
        title: 'AI Receipt Scanner',
        description: 'Snap a photo of any receipt and automatically extract merchant, amount, date, and category. Syncs with a simple expense dashboard. Solves the painful "shoebox of receipts" problem at tax time.',
        status: 'spark',
        priority: 'medium',
        category: 'app',
        coverEmoji: '🧾',
        tags: ['AI', 'Finance', 'Mobile'],
        techStack: ['React Native', 'OpenAI Vision', 'Supabase'],
        progress: 0,
        notes: '',
        repoUrl: '',
        demoUrl: '',
        todos: [],
        logs: [
            { id: 'sl-1', message: 'Idea captured', type: 'status_change', createdAt: ago(3) },
        ],
        targetDate: null,
        createdAt: ago(3),
        updatedAt: ago(3),
    },

    // 2. Planned — thought through, not started building yet
    {
        id: 'seed-2',
        title: 'Habit Streak Tracker',
        description: 'Minimal daily habit tracker with a beautiful streak visualization. No accounts, no ads — just a PWA that lives in your browser. Focus on making the streak visually satisfying so you never want to break the chain.',
        status: 'planned',
        priority: 'high',
        category: 'app',
        coverEmoji: '🔥',
        tags: ['Productivity', 'PWA', 'No-Auth'],
        techStack: ['React', 'TypeScript', 'IndexedDB'],
        progress: 0,
        notes: 'Look at Jerry Seinfeld\'s "don\'t break the chain" method for UX inspiration.\nKeep it to a single screen — no navigation.',
        repoUrl: '',
        demoUrl: '',
        todos: [
            { id: 'st-1', text: 'Sketch wireframes for the main dashboard', completed: true, createdAt: ago(5) },
            { id: 'st-2', text: 'Decide on data model (habits + entries)', completed: true, createdAt: ago(5) },
            { id: 'st-3', text: 'Set up Vite + PWA plugin', completed: false, createdAt: ago(2) },
            { id: 'st-4', text: 'Build streak calculation logic', completed: false, createdAt: ago(2) },
        ],
        logs: [
            { id: 'sl-2a', message: 'Status changed: spark → planned', type: 'status_change', createdAt: ago(4) },
            { id: 'sl-2b', message: 'Added wireframe notes and initial todos', type: 'note', createdAt: ago(2) },
        ],
        targetDate: null,
        createdAt: ago(7),
        updatedAt: ago(2),
    },

    // 3. Building — actively in progress
    {
        id: 'seed-3',
        title: 'Dev Portfolio Generator',
        description: 'Point it at your GitHub username and it auto-generates a slick portfolio site by analysing your repos, readme quality, and commit history. Deploy to GitHub Pages in one click.',
        status: 'building',
        priority: 'high',
        category: 'project',
        coverEmoji: '🚀',
        tags: ['Dev Tools', 'GitHub', 'CLI'],
        techStack: ['Node.js', 'GitHub API', 'Astro'],
        progress: 45,
        notes: 'Use Octokit for GitHub API. Astro static site generation keeps it fast.\nConsider a CLI (`npx portfolio-gen <username>`) as the primary interface.',
        repoUrl: 'https://github.com/you/portfolio-gen',
        demoUrl: '',
        todos: [
            { id: 'st-5', text: 'GitHub API integration — fetch repos + stats', completed: true, createdAt: ago(14) },
            { id: 'st-6', text: 'Design the default portfolio theme', completed: true, createdAt: ago(10) },
            { id: 'st-7', text: 'Build repo card component with language colors', completed: true, createdAt: ago(8) },
            { id: 'st-8', text: 'One-click GitHub Pages deploy script', completed: false, createdAt: ago(5) },
            { id: 'st-9', text: 'Support custom domain in config file', completed: false, createdAt: ago(5) },
            { id: 'st-10', text: 'Write README with usage examples', completed: false, createdAt: ago(3) },
        ],
        logs: [
            { id: 'sl-3a', message: 'Status changed: spark → building', type: 'status_change', createdAt: ago(14) },
            { id: 'sl-3b', message: 'GitHub API integration done — 300+ repos tested', type: 'manual', createdAt: ago(8) },
            { id: 'sl-3c', message: 'Core theme looking great, deploy step next', type: 'manual', createdAt: ago(3) },
        ],
        targetDate: null,
        createdAt: ago(20),
        updatedAt: ago(3),
    },

    // 4. Testing — built, now being validated
    {
        id: 'seed-4',
        title: 'Focus Timer (Pomodoro+)',
        description: 'A beautiful, distraction-free Pomodoro timer with ambient soundscapes, session history, and a weekly focus report. Works offline as a PWA. Inspired by the minimalism of Oak and the data depth of Toggl.',
        status: 'testing',
        priority: 'medium',
        category: 'app',
        coverEmoji: '⏱️',
        tags: ['Productivity', 'PWA', 'Offline'],
        techStack: ['Svelte', 'Web Audio API', 'IndexedDB'],
        progress: 80,
        notes: 'Beta testers love the ambient sounds. Main feedback: add keyboard shortcuts (space to start/pause).',
        repoUrl: 'https://github.com/you/focus-timer',
        demoUrl: 'https://focus-timer-demo.vercel.app',
        todos: [
            { id: 'st-11', text: 'Add keyboard shortcut: Space = start/pause', completed: false, createdAt: ago(2) },
            { id: 'st-12', text: 'Fix audio not resuming after tab switch on iOS Safari', completed: false, createdAt: ago(2) },
            { id: 'st-13', text: 'Write 5 app store screenshots', completed: false, createdAt: ago(1) },
        ],
        logs: [
            { id: 'sl-4a', message: 'Status changed: building → testing', type: 'status_change', createdAt: ago(7) },
            { id: 'sl-4b', message: 'Sent to 8 beta testers', type: 'manual', createdAt: ago(7) },
            { id: 'sl-4c', message: 'Collected first round of feedback — mostly positive', type: 'manual', createdAt: ago(2) },
        ],
        targetDate: null,
        createdAt: ago(30),
        updatedAt: ago(1),
    },

    // 5. Published — shipped and live
    {
        id: 'seed-5',
        title: 'Idea Pipeline',
        description: 'A beautiful, local-first Kanban board for managing your project and app ideas. Drag ideas through stages, track progress, write notes and todos — all stored in IndexedDB with zero accounts required. (You\'re using it right now! 👋)',
        status: 'published',
        priority: 'high',
        category: 'project',
        coverEmoji: '💡',
        tags: ['Productivity', 'Open Source', 'Local-First'],
        techStack: ['React', 'TypeScript', 'Vite', 'Zustand', 'dnd-kit'],
        progress: 100,
        notes: 'Ship early, iterate fast. The best dogfooding tool is the one you actually use every day.',
        repoUrl: 'https://github.com/barispe/idea-pipeline',
        demoUrl: '',
        todos: [
            { id: 'st-14', text: 'Export / Import JSON', completed: true, createdAt: ago(1) },
            { id: 'st-15', text: '"Saved" toast notification', completed: true, createdAt: ago(1) },
            { id: 'st-16', text: 'Custom categories', completed: true, createdAt: ago(1) },
        ],
        logs: [
            { id: 'sl-5a', message: 'Status changed: building → testing', type: 'status_change', createdAt: ago(5) },
            { id: 'sl-5b', message: 'Status changed: testing → published', type: 'status_change', createdAt: ago(1) },
            { id: 'sl-5c', message: 'Open-sourced on GitHub 🎉', type: 'manual', createdAt: ago(1) },
        ],
        targetDate: null,
        createdAt: ago(30),
        updatedAt: ago(0),
    },
];
