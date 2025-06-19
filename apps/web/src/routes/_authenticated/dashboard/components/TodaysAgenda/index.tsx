import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Clock } from "lucide-react";
import { useTodaysAgenda, type AgendaItem } from "@/services/queries/useTodaysAgenda";

function TodaysAgenda() {
  const { data: agenda, isLoading: isLoadingAgenda } = useTodaysAgenda();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Agenda</CardTitle>
        <CardDescription>
          Tasks scheduled for today, {new Date().toLocaleDateString()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingAgenda ? (
          <p className="text-muted-foreground">Loading agenda...</p>
        ) : (
          <div className="space-y-4">
            {agenda?.map((item: AgendaItem, index: number) => (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.client} &middot; {item.worker}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Clock className='size-4' />
                      {item.time}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                {agenda && index < agenda.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>)
}

export default TodaysAgenda;