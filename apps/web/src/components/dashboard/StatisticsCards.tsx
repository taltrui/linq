import { Card, CardContent } from "@/components/ui/Card";
import { ClipboardList, FileText, Briefcase } from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  status: string;
  details: Array<{ label: string; count: number }>;
  icon: React.ReactNode;
  color: string;
}

function StatCard({
  title,
  count,
  status,
  details,
  icon,
  color,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden pt-0 rounded-sm">
      <div className={`h-1 ${color}`} />
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-muted-foreground">{icon}</div>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <div className="mb-2">
          <div className="text-4xl font-bold text-foreground">{count}</div>
          <div className="text-md">{status}</div>
        </div>

        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{detail.label}</span>
              <span className="text-foreground">({detail.count})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatisticsCards() {
  const mockStats = [
    {
      title: "Solicitudes",
      count: 0,
      status: "Nuevas",
      details: [
        { label: "Evaluaciones completas", count: 0 },
        { label: "Vencidas", count: 0 },
      ],
      icon: <ClipboardList className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      title: "Cotizaciones",
      count: 0,
      status: "Aprobadas",
      details: [
        { label: "Borrador", count: 1 },
        { label: "Cambios solicitados", count: 0 },
      ],
      icon: <FileText className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      title: "Trabajos",
      count: 0,
      status: "Requieren facturación",
      details: [
        { label: "Activos", count: 0 },
        { label: "Acción requerida", count: 0 },
      ],
      icon: <Briefcase className="h-5 w-5" />,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="mb-3">Flujo de trabajo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
