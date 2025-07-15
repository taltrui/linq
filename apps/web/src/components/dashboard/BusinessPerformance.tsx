import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";

interface PerformanceSectionProps {
  title: string;
  children: React.ReactNode;
}

function PerformanceSection({ title, children }: PerformanceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          {title}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function BusinessPerformance() {
  return (
    <div className="space-y-3">
      <h2>Tu negocio</h2>

      <PerformanceSection title="Por cobrar">
        <div>
          <div className="text-md mb-3">0 clientes te deben</div>
          <div className="text-xs text-muted-foreground">—</div>
        </div>
      </PerformanceSection>

      <PerformanceSection title="Próximos trabajos">
        <div>
          <div className="text-sm text-muted-foreground mb-3">
            Esta semana (Mañana - Jul 13)
          </div>
          <div className="text-xs text-muted-foreground">—</div>
        </div>
      </PerformanceSection>

      <PerformanceSection title="Ingresos">
        <div>
          <div className="text-sm text-muted-foreground mb-3">
            Este mes (Jul 1 - Jul 31)
          </div>
          <div className="text-xs text-muted-foreground">—</div>
        </div>
      </PerformanceSection>
    </div>
  );
}
