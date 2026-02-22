# Idea Pipeline — Improvement Tracker

This file documents all bugs, UX issues, code quality problems, missing features, performance concerns, and accessibility gaps found during a comprehensive audit. Each item is tracked with its status.

---

## 🐛 Bugs

| ID  | Description | File | Severity | Status |
|-----|-------------|------|----------|--------|
| B1  | DetailPanel category dropdown is hardcoded — ignores custom categories from the store | `DetailPanel.tsx` ~L183 | 🔴 High | ✅ Fixed |
| B2  | `IdeaStatus` type has `'published'` but audit noted potential mismatch — confirmed `STATUS_CONFIG` and seed data both use `'published'` correctly | `idea.ts` | 🔴 High | ✅ Confirmed OK (no fix needed) |
| B3  | `onBlur` on title textarea calls `updateIdea(id, {})` with empty object — dead code | `DetailPanel.tsx` ~L85 | 🟡 Medium | ✅ Fixed |
| B4  | Import error shows raw `alert()`, input cleared on failure making retry awkward | `Header.tsx`, `useIdeasStore.ts` | 🟡 Medium | ✅ Fixed |
| B5  | No validation clamping progress to 0–100 on import | `useIdeasStore.ts` | 🟡 Medium | ✅ Fixed |
| B6  | Filters persist across view switches (board→dashboard shows filtered dashboard stats) | `useIdeasStore.ts` | 🟡 Medium | ✅ Fixed |

---

## 😤 UX Issues

| ID  | Description | File | Severity | Status |
|-----|-------------|------|----------|--------|
| U1  | Delete confirmation auto-resets after 3 s with no timer indicator — accidental delete risk | `DetailPanel.tsx` ~L54 | 🔴 High | ✅ Fixed |
| U2  | Empty state identical for "no ideas" vs "search returned nothing" | `ListView.tsx`, `BoardView.tsx` | 🔴 High | ✅ Fixed |
| U3  | No "Clear filters" button — users must manually reset each filter | `Sidebar.tsx` | 🟡 Medium | ✅ Fixed |
| U4  | Long custom category names truncate without a tooltip to reveal full name | `Sidebar.tsx` ~L156 | 🟡 Medium | ✅ Fixed |
| U5  | No visual feedback after drag-and-drop (no brief flash/highlight on drop) | `BoardView.tsx` | 🟡 Medium | ✅ Fixed |
| U6  | Target date field has no clear/reset button once a date is set | `DetailPanel.tsx`, `IdeaForm.tsx` | 🟡 Medium | ✅ Fixed |

---

## 🧹 Code Quality

| ID  | Description | Files | Severity | Status |
|-----|-------------|-------|----------|--------|
| C1  | `EMOJIS` array duplicated in `IdeaForm.tsx` and `DetailPanel.tsx` — lists differ | Both | 🔴 High | ✅ Fixed |
| C2  | No error handling in `storage.save()`, `storage.delete()`, `storage.clear()` | `storage.ts` | 🔴 High | ✅ Fixed |
| C3  | Magic numbers throughout: `1800` toast timeout, `3000` delete confirm, `15` tag limit, `3` tags per card | Multiple | 🟡 Medium | ✅ Fixed |
| C4  | No URL validation on repo/demo URL fields — accepts any string | `IdeaForm.tsx`, `DetailPanel.tsx` | 🟡 Medium | ✅ Fixed |
| C5  | `useFilteredIdeas()` returns new array every render even when nothing changed | `useIdeasStore.ts` | 🟡 Medium | ✅ Fixed |
| C6  | `allTags` in Sidebar recalculated every render via `flatMap` — O(n×m) | `Sidebar.tsx` ~L26 | 🟡 Medium | ✅ Fixed |
| C7  | Imported JSON not validated — malformed data silently corrupts store | `useIdeasStore.ts` | 🟡 Medium | ✅ Fixed |
| C8  | `targetDate` stored as `string \| null` but form uses `''` for empty | Multiple | 🟢 Low | ✅ Fixed |
| C9  | Dashboard stats (7 × `.filter()`) recalculate on every render | `DashboardView.tsx` | 🟢 Low | ✅ Fixed |
| C10 | No Zod / runtime type guards on storage reads — corrupt IndexedDB crashes app silently | `storage.ts` | 🟢 Low | ✅ Fixed |

---

## ✨ Missing Features

| ID  | Description | Impact | Status |
|-----|-------------|--------|--------|
| F1  | Notes field labelled "markdown-friendly" but renders raw text — no preview | 🔴 High | ✅ Fixed |
| F2  | List View has no sorting — can't sort by progress, date, title, priority | 🔴 High | ✅ Fixed |
| F3  | No keyboard shortcuts (`N` new idea, `/` search, `Esc` close panel, `?` help) | 🟡 Medium | ✅ Fixed |
| F4  | Dark-only theme — no light mode, no `prefers-color-scheme` support | 🟡 Medium | ✅ Fixed |
| F5  | Export is all-or-nothing — can't export a single idea | 🟡 Medium | ✅ Fixed |
| F6  | No "Duplicate idea" button | 🟡 Medium | ✅ Fixed |
| F7  | No CSV export (can't open in Excel/Sheets) | 🟡 Medium | ✅ Fixed |

---

## ⚡ Performance

| ID  | Description | Impact | Status |
|-----|-------------|--------|--------|
| P1  | `useFilteredIdeas` not memoized — reruns filter on every render | 🟡 Medium | ✅ Fixed (see C5) |
| P2  | No pagination/virtualization in ListView — slow with 500+ ideas | 🟡 Medium | ✅ Fixed |
| P3  | Notes/description fields write to IndexedDB on every keystroke — no debounce | 🟡 Medium | ✅ Fixed |
| P4  | Timeline grouping logic recalculates on every render | 🟢 Low | ✅ Fixed |

---

## ♿ Accessibility

| ID  | Description | File | Severity | Status |
|-----|-------------|------|----------|--------|
| A1  | Emoji picker uses `<div onClick>` instead of `<button>` — not keyboard/screen-reader accessible | `IdeaForm.tsx`, `DetailPanel.tsx` | 🔴 High | ✅ Fixed |
| A2  | No focus trap in modals — Tab key reaches elements behind open detail panel | `IdeaForm.tsx`, `DetailPanel.tsx` | 🔴 High | ✅ Fixed |
| A3  | Form labels are plain `<div>` elements, not `<label htmlFor>` — screen readers can't associate them | Multiple | 🔴 High | ✅ Fixed |
| A4  | Icon-only buttons (export, import, view-switcher) lack `aria-label` | `Header.tsx` | 🟡 Medium | ✅ Fixed |
| A5  | No `prefers-reduced-motion` support — animations play regardless of OS setting | `index.css` | 🟡 Medium | ✅ Fixed |

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 High | Broken functionality or significant user impact |
| 🟡 Medium | Noticeable issue but has workaround |
| 🟢 Low | Polish / nice-to-have |
| ⬜ Pending | Not yet started |
| 🔧 In Progress | Currently being worked on |
| ✅ Fixed | Implemented and pushed to main |

---

*Audit performed on commit `45b1a4e` — All 37 items resolved. Last updated: 2025-07-15 — Final commit `2ea7545`*
