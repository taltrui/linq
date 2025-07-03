import { Card, CardContent } from "@/components/ui/Card";
import {
  Users,
  FileText,
  Briefcase,
  DollarSign,
  TrendingUp,
  UserPlus,
  FileTextIcon,
} from "lucide-react";
import { NewClient } from "@/components/general/NewClient";
import { NewQuotation } from "@/components/general/NewQuotation";

interface QuickAction {
  title: string;
  description: string;
  component: React.ComponentType<{ children?: React.ReactNode }>;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Nueva Cotización",
    description: "Crear una nueva cotización para un cliente",
    component: NewQuotation,
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    title: "Agregar Cliente",
    description: "Registrar un nuevo cliente",
    component: NewClient,
    icon: UserPlus,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
];

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}

const mockStats: StatCard[] = [
  {
    title: "Trabajos Activos",
    value: 12,
    change: "+2 esta semana",
    changeType: "positive",
    icon: Briefcase,
  },
  {
    title: "Cotizaciones Pendientes",
    value: 8,
    change: "+3 hoy",
    changeType: "positive",
    icon: FileTextIcon,
  },
  {
    title: "Total de Clientes",
    value: 45,
    change: "+5 este mes",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Ingresos Este Mes",
    value: "$24,500",
    change: "+15% del mes pasado",
    changeType: "positive",
    icon: DollarSign,
  },
];

export function QuickActions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const Component = action.component;
            return (
              <div key={action.title}>
                <Component>
                  <Card
                    className={`h-full transition-all duration-200 hover:shadow-md cursor-pointer ${action.bgColor} border-0 p-0`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                          <Icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900">
                            {action.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Component>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    {stat.changeType === "positive" && (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    )}
                    <p
                      className={`text-xs ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : stat.changeType === "negative"
                            ? "text-red-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
