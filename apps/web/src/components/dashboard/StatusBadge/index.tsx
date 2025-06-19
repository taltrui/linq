import type { AgendaItem } from "@/services/queries/dashboard";

export function StatusBadge({ status }: { status: AgendaItem['status'] }) {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
    const statusClasses = {
        'Scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    return (
        <span className={`${baseClasses} ${statusClasses[status]}`}>
            {status}
        </span>
    );
} 