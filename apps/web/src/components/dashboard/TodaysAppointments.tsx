import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface AppointmentStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  remaining: number;
}

export function TodaysAppointments() {
  const mockStats: AppointmentStats = {
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0,
    remaining: 0,
  };

  return (
    <div>
      <h2 className="mb-3">Tu día</h2>

      <Card className="mb-8">
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Total
              </div>
              <div className="text-2xl font-bold">{mockStats.total}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Activas
              </div>
              <div className="text-2xl font-bold">{mockStats.active}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Completadas
              </div>
              <div className="text-2xl font-bold">{mockStats.completed}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Vencidas
              </div>
              <div className="text-2xl font-bold">{mockStats.overdue}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Restantes
              </div>
              <div className="text-2xl font-bold">{mockStats.remaining}</div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-6">
              Aquí es donde obtendrás una descripción general de tus citas para
              hoy una vez que estén programadas.
            </p>
            <Button
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Programar un trabajo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
