import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface PerformanceSectionProps {
  title: string;
  children: React.ReactNode;
}

function PerformanceSection({ title, children }: PerformanceSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Rendimiento del negocio</h2>
      
      <PerformanceSection title="Por cobrar">
        <div className="text-center py-4">
          <div className="text-2xl font-bold mb-1">0</div>
          <div className="text-sm text-muted-foreground">clientes te deben</div>
          <div className="w-full h-px bg-border my-4" />
          <div className="text-xs text-muted-foreground">—</div>
        </div>
      </PerformanceSection>

      <PerformanceSection title="Próximos trabajos">
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground mb-2">Esta semana (Mañana - Jul 13)</div>
          <div className="text-xs text-muted-foreground">—</div>
        </div>
      </PerformanceSection>

      <PerformanceSection title="Ingresos">
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground mb-2">Este mes (Jul 1 - Jul 31)</div>
          <div className="text-xs text-muted-foreground">—</div>
        </div>
      </PerformanceSection>
    </div>
  );
}