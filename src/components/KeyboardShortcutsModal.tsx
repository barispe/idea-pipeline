import { X } from 'lucide-react';

interface Props {
    onClose: () => void;
}

const SHORTCUTS = [
    { keys: ['N'], desc: 'Create a new idea' },
    { keys: ['/'], desc: 'Focus the search bar' },
    { keys: ['Esc'], desc: 'Close panel or dialog' },
    { keys: ['?'], desc: 'Toggle this help dialog' },
];

export function KeyboardShortcutsModal({ onClose }: Props) {
    return (
        <>
            <div className="panel-overlay" onClick={onClose} />
            <div className="kb-modal" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
                <div className="kb-modal-header">
                    <span className="kb-modal-title">⌨️ Keyboard Shortcuts</span>
                    <button className="panel-close" onClick={onClose} aria-label="Close keyboard shortcuts">
                        <X size={18} />
                    </button>
                </div>
                <div className="kb-modal-body">
                    {SHORTCUTS.map(({ keys, desc }) => (
                        <div key={desc} className="kb-row">
                            <div className="kb-keys">
                                {keys.map((k) => (
                                    <kbd key={k} className="kb-key">{k}</kbd>
                                ))}
                            </div>
                            <span className="kb-desc">{desc}</span>
                        </div>
                    ))}
                </div>
                <div className="kb-modal-footer">
                    Shortcuts are inactive while typing in an input.
                </div>
            </div>
        </>
    );
}
