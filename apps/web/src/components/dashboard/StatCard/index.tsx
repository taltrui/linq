import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function StatCard({ title, value, icon, description, loading, isWarning = false }: {
    title: string;
    value?: number;
    icon: React.ReactNode;
    description: string;
    loading: boolean;
    isWarning?: boolean;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
                ) : (
                    <div className={`text-2xl font-bold ${isWarning ? 'text-destructive' : ''}`}>
                        {value ?? '-'}
                    </div>
                )}
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
} 