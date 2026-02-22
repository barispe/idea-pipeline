import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useIdeasStore, useFilteredIdeas } from '../store/useIdeasStore';
import { STATUS_CONFIG, ALL_STATUSES } from '../types/idea';
import type { IdeaStatus, Idea } from '../types/idea';
import { IdeaCard } from './IdeaCard';
import { DetailPanel } from './DetailPanel';
import { LayoutGrid, List } from 'lucide-react';
import { BOARD_DROP_FLASH_DURATION } from '../lib/constants';

// ─── Compact title row ─────────────────────────────────────────────────────
function IdeaTitleRow({ idea, onClick }: { idea: Idea; onClick: () => void }) {
    return (
        <div className="idea-title-row" onClick={onClick}>
            <span className="title-row-emoji">{idea.coverEmoji}</span>
            <span className="title-row-text">{idea.title}</span>
            {idea.priority === 'high' && (
                <span className="title-row-dot high" title="High priority" />
            )}
            {idea.priority === 'critical' && (
                <span className="title-row-dot critical" title="Critical priority" />
            )}
        </div>
    );
}

// ─── Sortable card wrapper ─────────────────────────────────────────────────
function SortableCard({
    idea,
    compact,
    onClick,
}: {
    idea: Idea;
    compact: boolean;
    onClick: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: idea.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {compact ? (
                <IdeaTitleRow idea={idea} onClick={onClick} />
            ) : (
                <IdeaCard idea={idea} onClick={onClick} />
            )}
        </div>
    );
}

// ─── BoardView ─────────────────────────────────────────────────────────────
export function BoardView() {
    const { setSelectedIdea, changeStatus } = useIdeasStore();
    const ideas = useFilteredIdeas();
    const selectedIdea = useIdeasStore((s) => s.ideas.find((i) => i.id === s.selectedIdeaId));
    const [compact, setCompact] = useState(false);
    const [activeIdea, setActiveIdea] = useState<Idea | null>(null);
    const [droppedColumn, setDroppedColumn] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    function handleDragStart(event: DragStartEvent) {
        const idea = ideas.find((i) => i.id === event.active.id);
        if (idea) setActiveIdea(idea);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveIdea(null);
        const { active, over } = event;
        if (!over) return;

        const draggedIdea = ideas.find((i) => i.id === active.id);
        if (!draggedIdea) return;

        // "over" can be a column droppable id (a status string) or another card id
        let targetStatus: IdeaStatus | null = null;

        // Check if dropped onto a column zone
        if ((ALL_STATUSES as string[]).includes(over.id as string)) {
            targetStatus = over.id as IdeaStatus;
        } else {
            // Dropped onto another card — find that card's column
            const overIdea = ideas.find((i) => i.id === over.id);
            if (overIdea) targetStatus = overIdea.status;
        }

        if (targetStatus && targetStatus !== draggedIdea.status) {
            changeStatus(draggedIdea.id, targetStatus);
            // Brief flash on the destination column
            setDroppedColumn(targetStatus);
            setTimeout(() => setDroppedColumn(null), BOARD_DROP_FLASH_DURATION);
        }
    }

    return (
        <>
            {/* Toolbar */}
            <div className="board-toolbar">
                <span className="board-toolbar-label">
                    {compact ? 'Title view — click a row to open' : 'Card view — drag cards between columns'}
                </span>
                <div className="board-view-toggle">
                    <button
                        className={`toggle-btn${!compact ? ' active' : ''}`}
                        onClick={() => setCompact(false)}
                        title="Full card view"
                    >
                        <LayoutGrid size={14} />
                        Cards
                    </button>
                    <button
                        className={`toggle-btn${compact ? ' active' : ''}`}
                        onClick={() => setCompact(true)}
                        title="Compact title view"
                    >
                        <List size={14} />
                        Titles
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={`board-container${compact ? ' board-compact' : ''}`}>
                    {ALL_STATUSES.map((status: IdeaStatus) => {
                        const cfg = STATUS_CONFIG[status];
                        const col = ideas.filter((i) => i.status === status);
                        return (
                            <BoardColumn
                                key={status}
                                status={status}
                                cfg={cfg}
                                col={col}
                                compact={compact}
                                flashDrop={droppedColumn === status}
                                onCardClick={(id) => setSelectedIdea(id)}
                            />
                        );
                    })}
                </div>

                {/* Drag overlay — ghost card while dragging */}
                <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                    {activeIdea ? (
                        <div style={{ opacity: 0.9, transform: 'scale(1.03)', pointerEvents: 'none' }}>
                            {compact ? (
                                <IdeaTitleRow idea={activeIdea} onClick={() => { }} />
                            ) : (
                                <IdeaCard idea={activeIdea} onClick={() => { }} />
                            )}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {selectedIdea && (
                <DetailPanel
                    idea={selectedIdea}
                    onClose={() => setSelectedIdea(null)}
                />
            )}
        </>
    );
}

// ─── Individual column with droppable zone ─────────────────────────────────
function BoardColumn({
    status,
    cfg,
    col,
    compact,
    flashDrop,
    onCardClick,
}: {
    status: IdeaStatus;
    cfg: (typeof STATUS_CONFIG)[IdeaStatus];
    col: Idea[];
    compact: boolean;
    flashDrop: boolean;
    onCardClick: (id: string) => void;
}) {
    const { setNodeRef, isOver } = useSortable({ id: status });

    return (
        <div
            ref={setNodeRef}
            className={`board-column${isOver ? ' board-column-over' : ''}${flashDrop ? ' board-column-drop-flash' : ''}`}
        >
            <div
                className="board-column-header"
                style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}
            >
                <span className="col-emoji">{cfg.emoji}</span>
                <span className="col-label" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="col-count">{col.length}</span>
            </div>

            <SortableContext items={col.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="board-column-body">
                    {col.map((idea) => (
                        <SortableCard
                            key={idea.id}
                            idea={idea}
                            compact={compact}
                            onClick={() => onCardClick(idea.id)}
                        />
                    ))}
                    {col.length === 0 && (
                        <div className="board-column-empty">
                            Drop ideas here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
