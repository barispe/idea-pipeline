import { useEffect, useState } from 'react';
import { useIdeasStore } from '../store/useIdeasStore';
import { CheckCircle } from 'lucide-react';
import { SAVE_TOAST_DURATION } from '../lib/constants';

/**
 * Renders a brief "Saved" toast at the top-center of the viewport whenever
 * the Zustand store's `savedAt` timestamp changes (i.e., after any mutation).
 * It is position:fixed so it never displaces any layout element.
 */
export function SaveToast() {
    const savedAt = useIdeasStore((s) => s.savedAt);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!savedAt) return;
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), SAVE_TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [savedAt]);

    return (
        <div className={`save-toast${visible ? ' save-toast-visible' : ''}`} aria-live="polite">
            <CheckCircle size={13} />
            Saved
        </div>
    );
}
