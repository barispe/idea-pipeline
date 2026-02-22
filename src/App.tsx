import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { useIdeasStore } from './store/useIdeasStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BoardView } from './components/BoardView';
import { ListView } from './components/ListView';
import { DashboardView } from './components/DashboardView';
import { TimelineView } from './components/TimelineView';
import { IdeaForm } from './components/IdeaForm';
import { SaveToast } from './components/SaveToast';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';

export default function App() {
    const { loadIdeas, loading, view, createIdea, selectedIdeaId, setSelectedIdea } = useIdeasStore();
    const { theme, toggleTheme } = useTheme();
    const [showForm, setShowForm] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);

    useEffect(() => {
        loadIdeas();
    }, []);

    const handleClosePanel = useCallback(() => {
        if (showShortcuts) { setShowShortcuts(false); return; }
        if (showForm) { setShowForm(false); return; }
        if (selectedIdeaId) { setSelectedIdea(null); }
    }, [showShortcuts, showForm, selectedIdeaId, setSelectedIdea]);

    const handleFocusSearch = useCallback(() => {
        const el = document.querySelector<HTMLInputElement>('.search-input');
        el?.focus();
        el?.select();
    }, []);

    const handleNewIdea = useCallback(() => {
        if (!showForm) setShowForm(true);
    }, [showForm]);

    const handleToggleHelp = useCallback(() => {
        setShowShortcuts((v) => !v);
    }, []);

    useKeyboardShortcuts({
        onNewIdea: handleNewIdea,
        onToggleHelp: handleToggleHelp,
        onClosePanel: handleClosePanel,
        onFocusSearch: handleFocusSearch,
        isPanelOpen: !!selectedIdeaId || showForm,
        isModalOpen: showShortcuts,
    });

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <div className="loading-text">Loading your ideas...</div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar onNewIdea={() => setShowForm(true)} />

            <div className="main-area">
                <Header
                    onShowShortcuts={() => setShowShortcuts(true)}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                />

                {view === 'dashboard' && <DashboardView />}
                {view === 'board' && <BoardView />}
                {view === 'list' && <ListView />}
                {view === 'timeline' && <TimelineView />}
            </div>

            {showForm && (
                <IdeaForm
                    title="New Idea"
                    onClose={() => setShowForm(false)}
                    onSubmit={(data) => {
                        createIdea(data);
                        setShowForm(false);
                    }}
                />
            )}

            {showShortcuts && (
                <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
            )}

            <SaveToast />
        </div>
    );
}
