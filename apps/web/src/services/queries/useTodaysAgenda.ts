import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { AgendaItem } from "@repo/api-client";

const getTodaysAgenda = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return [
        {
            id: 'JOB-001',
            title: 'Kitchen Sink Repair',
            client: 'Alice Martin',
            time: '09:00 AM',
            worker: 'Carlos Gomez',
            status: 'In Progress',
        },
        {
            id: 'JOB-002',
            title: 'Electrical Panel Upgrade',
            client: 'Bob Johnson',
            time: '11:00 AM',
            worker: 'Maria Rodriguez',
            status: 'Scheduled',
        },
        {
            id: 'JOB-003',
            title: 'AC Unit Installation',
            client: 'Eva Williams',
            time: '02:00 PM',
            worker: 'Juan Perez',
            status: 'Scheduled',
        },
        {
            id: 'JOB-004',
            title: 'Routine Maintenance',
            client: 'David Smith',
            time: '04:00 PM',
            worker: 'Carlos Gomez',
            status: 'Completed',
        },
    ];
};

export const todaysAgendaQueryOptions = queryOptions<AgendaItem[]>({
    queryKey: ['todaysAgenda'],
    queryFn: getTodaysAgenda,
});

export function useTodaysAgenda() {
    return useSuspenseQuery(todaysAgendaQueryOptions);
}