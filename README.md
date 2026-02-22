# 💡 Idea Pipeline

> A beautiful, local-first Kanban board for managing your project and app ideas — built with React, TypeScript, and Vite.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Built with React](https://img.shields.io/badge/Built_with-React_19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

---

## Table of Contents

1. [What Is Idea Pipeline?](#what-is-idea-pipeline)
2. [Features](#features)
3. [How It Works](#how-it-works)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running Locally](#running-locally)
   - [Building for Production](#building-for-production)
7. [Using the App](#using-the-app)
   - [Board View](#board-view)
   - [List View](#list-view)
   - [Dashboard View](#dashboard-view)
   - [Timeline View](#timeline-view)
   - [Idea Detail Panel](#idea-detail-panel)
   - [Filtering & Search](#filtering--search)
8. [Data & Storage](#data--storage)
9. [Architecture](#architecture)
10. [Contributing](#contributing)
    - [Development Workflow](#development-workflow)
    - [Code Style](#code-style)
    - [Submitting a PR](#submitting-a-pr)
11. [License](#license)

---

## What Is Idea Pipeline?

**Idea Pipeline** is a personal productivity tool designed for developers, indie hackers, and makers who have more ideas than time. It gives you a structured, visual workspace to:

- Capture raw ideas quickly before they vanish
- Track which ideas you're actively building vs. just dreaming about
- See progress at a glance across all your projects
- Keep notes, todos, and activity logs per idea — all in one place

Everything is stored **100% locally** in your browser's IndexedDB — no accounts, no cloud sync, no subscriptions. Your ideas stay on your machine.

---

## Features

| Feature | Description |
|---|---|
| 🗂️ **Kanban Board** | Drag-and-drop ideas across 6 status columns |
| 📋 **Compact Title View** | Toggle to a dense title-only mode for columns with many ideas |
| 🎯 **Detail Panel** | Slide-in panel with tabs for Overview, Todos, Notes, and Activity Log |
| 📊 **Dashboard** | Visual stats — status distribution, priority breakdown, progress charts |
| 🕐 **Timeline View** | Chronological history of idea activity |
| 📝 **List View** | Sortable table view of all ideas |
| 🔍 **Live Search** | Instant filtering by title, description, or tags |
| 🏷️ **Filter by Status/Priority/Tag** | Sidebar filters narrow down visible ideas |
| 💾 **Local-First Storage** | Persisted in IndexedDB via `localforage` — works offline |
| 🌱 **84 Seed Ideas** | Ships with a curated set of real project/app ideas to get you started |

---

## How It Works

### Idea Lifecycle

Every idea moves through six status stages:

```
💡 Spark  →  📋 Planned  →  🔨 Building  →  🧪 Testing  →  🚀 Launched  →  ❄️ Archived
```

You drag cards between columns on the Board view, or change status from the detail panel dropdown.

### Local-First Architecture

```
Browser
  └── React App (Vite dev server / static build)
        └── Zustand store (in-memory state)
              └── localforage (IndexedDB via browser API)
```

When the app starts:
1. `useIdeasStore.loadIdeas()` is called from `App.tsx`'s `useEffect`
2. `localforage` reads all idea records from IndexedDB
3. If the store is empty (first run), **84 seed ideas** are written in parallel
4. The Zustand store holds the ideas in memory for the session
5. Every CRUD action writes back to IndexedDB immediately

There is no server, no REST API, and no authentication. All data lives in the browser that opened the app.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) | Concurrent rendering, stable ecosystem |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type safety across the entire codebase |
| **Build Tool** | [Vite 7](https://vite.dev/) | Instant HMR, fast production builds |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | Minimal, no-boilerplate global store |
| **Persistence** | [localforage](https://localforage.github.io/localForage/) | Unified IndexedDB API with localStorage fallback |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) | Accessible, modular DnD for React |
| **Icons** | [lucide-react](https://lucide.dev/) | Crisp, consistent icon set |
| **Date Formatting** | [date-fns](https://date-fns.org/) | Lightweight date utilities |
| **Styling** | Vanilla CSS with CSS custom properties | No build overhead, full control |

---

## Project Structure

```
idea_pipeline/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── BoardView.tsx       # Kanban board with drag-and-drop
│   │   ├── Badges.tsx          # StatusBadge, PriorityBadge, ProgressBar
│   │   ├── DashboardView.tsx   # Stats & charts
│   │   ├── DetailPanel.tsx     # Slide-in idea detail (tabs: Overview/Todos/Notes/Log)
│   │   ├── Header.tsx          # Search bar + view switcher
│   │   ├── IdeaCard.tsx        # Card component for board/list views
│   │   ├── IdeaForm.tsx        # Create/edit idea modal
│   │   ├── ListView.tsx        # Table view of ideas
│   │   ├── Sidebar.tsx         # Navigation + filters + new idea button
│   │   └── TimelineView.tsx    # Chronological timeline
│   ├── lib/
│   │   ├── seedData.ts         # 84 pre-populated project/app ideas
│   │   └── storage.ts          # localforage wrapper (CRUD operations)
│   ├── store/
│   │   └── useIdeasStore.ts    # Zustand store — ideas, filters, view, CRUD actions
│   ├── types/
│   │   └── idea.ts             # TypeScript types + status/priority config constants
│   ├── App.tsx                 # Root layout — initializes store, renders views/modals
│   ├── index.css               # Global design system (CSS variables, all component styles)
│   └── main.tsx                # React entry point with ErrorBoundary
├── app_ideas.md                # Source file for app idea seed data
├── project_ideas.md            # Source file for project idea seed data
├── index.html                  # HTML shell
├── vite.config.ts              # Vite config (with localforage optimizeDeps)
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or later**
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/idea-pipeline.git
cd idea-pipeline

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** Always use `http://localhost:5173` (the Vite dev server), not a `file://` URL. IndexedDB requires an HTTP context.

On first launch the app seeds 84 ideas automatically so you have something to explore right away.

### Building for Production

```bash
# Build optimized static files into /dist
npm run build

# Preview the production build locally
npm run preview
```

The production build outputs to `dist/` and can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

---

## Using the App

### Board View

The default view — a Kanban board with one column per status.

- **Cards mode**: Full idea cards showing emoji, title, description, tags, progress, and priority
- **Titles mode**: Compact single-line rows — ideal when a column has many ideas
- **Drag & drop**: Click and drag any card to a different column to change its status
- **Click a card**: Opens the detail panel on the right

### List View

A compact table showing all filtered ideas with status badges, priority, progress, and task count. Click any row to open the detail panel.

### Dashboard View

Visual statistics about your idea portfolio:
- Total counts by status
- Priority breakdown
- Average progress across active ideas
- Most common tags

### Timeline View

Ideas grouped by the month they were last updated — useful for seeing what you worked on recently.

### Idea Detail Panel

Click any card/row to open the slide-in detail panel. It has four tabs:

| Tab | Content |
|---|---|
| **Overview** | Full description, category, status/priority dropdowns, links (repo, demo) |
| **Todos** | Checklist of tasks with completion tracking |
| **Notes** | Free-form notes field |
| **Activity Log** | Timestamped history of status changes and manual log entries |

### Filtering & Search

From the **Sidebar**:
- Search by title, description, or tag (live, no submit needed)
- Filter by **Status** (any of the 6 stages)
- Filter by **Priority** (low / medium / high / critical)
- Filter by **Tag** (auto-populated from your idea tags)

All filters combine (AND logic) — Zustand's `useFilteredIdeas` selector computes this reactively.

---

## Data & Storage

All data is stored inside your **browser's IndexedDB** under the name `idea-pipeline`, store `ideas`.

Each idea record has this shape:

```typescript
interface Idea {
  id: string;              // Random base-36 ID
  title: string;
  description: string;
  coverEmoji: string;      // Single emoji cover
  status: IdeaStatus;      // 'spark' | 'planned' | 'building' | 'testing' | 'launched' | 'archived'
  priority: Priority;      // 'low' | 'medium' | 'high' | 'critical'
  category: IdeaCategory;  // 'app' | 'project' | 'business' | 'content' | 'other'
  tags: string[];
  progress: number;        // 0–100
  todos: Todo[];
  notes: string;
  repoUrl?: string;
  demoUrl?: string;
  logs: LogEntry[];
  createdAt: string;       // ISO 8601
  updatedAt: string;
}
```

**To clear all data**: Open DevTools → Application → IndexedDB → `idea-pipeline` → Delete database. On next load the seed data will be restored.

**To back up your data**: Open DevTools → Console and run:
```js
const keys = await localforage.keys();
const data = await Promise.all(keys.map(k => localforage.getItem(k)));
copy(JSON.stringify(data, null, 2));
```
This copies all your ideas as JSON to the clipboard.

---

## Architecture

### State Management

Zustand is used for a single global store (`useIdeasStore`). The key design decisions:

- **Single source of truth**: All ideas live in the store, storage is a write-through cache
- **Optimistic UI**: State is updated immediately, then persisted to IndexedDB asynchronously
- **Derived state via selectors**: `useFilteredIdeas()` is a hook that computes filtered ideas reactively — components just call it, no manual subscriptions

### Component Structure

```
App.tsx (layout shell, loads ideas, renders modals)
├── Sidebar.tsx       (filters + navigation)
├── Header.tsx        (search + view switcher)
└── [Active View]
    ├── BoardView.tsx → uses DndContext + SortableContext
    ├── ListView.tsx
    ├── DashboardView.tsx
    └── TimelineView.tsx
        └── DetailPanel.tsx (mounted at App level, slides in)
```

### CSS Design System

All styling uses a single flat `index.css` file with CSS custom properties defined in `:root`. Key tokens:

```css
--bg-base        /* darkest background */
--bg-card        /* card surfaces */
--bg-input       /* form inputs */
--accent         /* indigo #6366f1 — primary interactive color */
--border         /* subtle separator */
--text-primary   /* main readable text */
--text-secondary /* secondary descriptive text */
--text-muted     /* labels, hints */
```

No CSS-in-JS, no Tailwind — just standard CSS with class naming inspired by BEM.

---

## Contributing

Contributions are welcome! This is a personal tool so PRs that add complexity without clear value may not be merged — but improvements to existing features, bug fixes, and UI polish are very much appreciated.

### Development Workflow

1. **Fork** the repository and clone your fork
2. **Create a branch** for your change:
   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/bug-description
   ```
3. **Make your changes** and test locally with `npm run dev`
4. **Check TypeScript** — all changes must compile without errors:
   ```bash
   npx tsc --noEmit
   ```
5. **Build** to confirm the production bundle is clean:
   ```bash
   npm run build
   ```
6. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add keyboard shortcut to create idea"
   ```
7. **Push** and open a Pull Request

### Code Style

- **TypeScript**: All types must be explicit. Use `import type` for type-only imports (required by `verbatimModuleSyntax`)
- **React**: Functional components only. Hooks over class components
- **No external UI libraries**: Keep the tech stack minimal — no Material UI, shadcn, etc.
- **CSS**: Add new styles to `index.css` following the existing naming conventions. Use existing CSS variables for colors/spacing
- **No console.log**: Use `console.error` for actual errors only

### Submitting a PR

- Keep PRs focused — one feature or fix per PR
- Include a brief description of what changed and why
- If your PR changes the UI, include a screenshot or screen recording
- If you added a new dependency, explain why an existing package couldn't do the job

---

## Security

### Dependency Audit

Last audited: **2025-07-14** · Tool: `npm audit`

| Area | Status |
|---|---|
| **Runtime dependencies** (shipped to users) | ✅ **0 vulnerabilities** |
| **Dev dependencies** (build/lint tools only) | ⚠️ 10 high — dev-only, not shipped |
| **TypeScript compilation** | ✅ Clean — 0 errors |

#### What the warnings mean

Running `npm audit` reports **10 high-severity** findings, all rooted in a single issue: `minimatch < 10.2.1` (ReDoS via crafted glob patterns — [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26)).

**Every affected package is a dev/lint tool** — `eslint`, `typescript-eslint`, and their transitive deps. None of these packages are included in the production bundle (`dist/`). They run only on the developer's machine during linting. End users of the app are **not exposed** to these packages.

The fix requires a semver-major bump of `eslint → 10.x` and `typescript-eslint → 8.36.x`, which involves breaking config changes. It is tracked as a future maintenance item and does not affect user-facing security.

#### Production bundle contents

The compiled output (`npm run build`) contains only these runtime packages:

| Package | Version | Purpose |
|---|---|---|
| `react` + `react-dom` | 19.x | UI framework |
| `zustand` | 5.x | State management |
| `localforage` | 1.x | IndexedDB persistence |
| `@dnd-kit/*` | 6.x | Drag and drop |
| `lucide-react` | 0.x | Icons |
| `date-fns` | 4.x | Date formatting |

All production packages are **clean** (0 audit findings).

#### Data & privacy

- No data ever leaves your browser — there is no server, no API, no analytics
- All storage is in your browser's **IndexedDB** under the key `idea-pipeline`
- No cookies, no tracking, no third-party requests at runtime

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">
  Made with 💡 for makers who have too many ideas and not enough storage for them.
</div>
