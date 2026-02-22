import { useEffect } from 'react';

interface Options {
    onNewIdea: () => void;
    onToggleHelp: () => void;
    onClosePanel: () => void;
    onFocusSearch: () => void;
    isPanelOpen: boolean;
    isModalOpen: boolean;
}

/**
 * Global keyboard shortcuts:
 *   N        → New Idea (when no input/textarea focused)
 *   /        → Focus search bar
 *   Esc      → Close open panel / modal
 *   ?        → Toggle keyboard shortcuts help modal
 */
export function useKeyboardShortcuts({
    onNewIdea,
    onToggleHelp,
    onClosePanel,
    onFocusSearch,
    isPanelOpen,
    isModalOpen,
}: Options) {
    useEffect(() => {
        function handler(e: KeyboardEvent) {
            // Never intercept when user is typing in an input/textarea/select
            const tag = (e.target as HTMLElement).tagName;
            const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
                (e.target as HTMLElement).isContentEditable;

            if (e.key === 'Escape') {
                // Esc always works regardless of editing state
                if (isPanelOpen || isModalOpen) {
                    onClosePanel();
                }
                return;
            }

            if (isEditing) return; // all other shortcuts require focus to be outside inputs

            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                onNewIdea();
            } else if (e.key === '/') {
                e.preventDefault();
                onFocusSearch();
            } else if (e.key === '?') {
                e.preventDefault();
                onToggleHelp();
            }
        }

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onNewIdea, onToggleHelp, onClosePanel, onFocusSearch, isPanelOpen, isModalOpen]);
}
