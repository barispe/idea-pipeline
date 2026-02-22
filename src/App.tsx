import { useState, useEffect } from 'react';
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

export default function App() {
  const { loadIdeas, loading, view, createIdea } = useIdeasStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

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
        <Header onNewIdea={() => setShowForm(true)} />

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

      <SaveToast />
    </div>
  );
}
