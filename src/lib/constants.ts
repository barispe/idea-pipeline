/** Shared constants used across the app. */

// ─── UI Timing ───────────────────────────────────────────────────────────────
/** How long (ms) the "Saved" toast stays visible */
export const SAVE_TOAST_DURATION = 1800;

/** How long (ms) the drop-flash animation on a board column plays */
export const BOARD_DROP_FLASH_DURATION = 500;

// ─── Sidebar limits ──────────────────────────────────────────────────────────
/** Maximum number of tags shown in the sidebar tag list */
export const SIDEBAR_MAX_TAGS = 15;

// ─── Board card limits ───────────────────────────────────────────────────────
/** Maximum tags shown on an idea card in board / timeline views */
export const CARD_MAX_TAGS = 3;

// ─── Emoji picker ────────────────────────────────────────────────────────────
/**
 * Canonical list of selectable cover emojis.
 * Used in IdeaForm, DetailPanel — keep in one place.
 */
export const EMOJIS = [
    '💡', '🤖', '🔨', '🚀', '🎮', '📱', '🔬', '🧪', '🌱', '💰',
    '🔐', '🎯', '🌐', '🗺️', '📋', '⚡', '🛡️', '🔄', '📝', '🎬',
    '🏠', '🔊', '🍞', '🏊', '🐾', '🎤', '⚖️', '🌡️', '👴', '🗃️',
    '📡', '🔒', '📵', '🕸️', '👁️', '🏗️', '🔀', '🌉', '💓', '✨',
];
