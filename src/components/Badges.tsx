import { STATUS_CONFIG, PRIORITY_CONFIG } from '../types/idea';
import type { IdeaStatus, Priority } from '../types/idea';

interface StatusBadgeProps {
    status: IdeaStatus;
    small?: boolean;
}

export function StatusBadge({ status, small }: StatusBadgeProps) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span
            className="status-badge"
            style={{
                color: cfg.color,
                background: cfg.bg,
                borderColor: `${cfg.color}30`,
                fontSize: small ? '10.5px' : undefined,
                padding: small ? '2px 7px' : undefined,
            }}
        >
            {cfg.emoji} {cfg.label}
        </span>
    );
}

interface PriorityBadgeProps {
    priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
    const cfg = PRIORITY_CONFIG[priority];
    return (
        <span
            className="priority-badge"
            style={{ color: cfg.color, background: cfg.bg }}
        >
            {cfg.label}
        </span>
    );
}

interface ProgressBarProps {
    value: number;
    height?: number;
}

export function ProgressBar({ value, height = 4 }: ProgressBarProps) {
    return (
        <div className="progress-bar" style={{ height }}>
            <div
                className="progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    );
}
