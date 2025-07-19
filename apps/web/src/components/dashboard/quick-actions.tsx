import { Card, CardContent } from "@/components/ui/card";
import { FileText, UserPlus } from "lucide-react";
import { NewClient } from "@/components/general/new-client";
import { NewQuotation } from "@/components/general/new-quotation";

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

export function QuickActions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4">Acciones Rápidas</h2>
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
    </div>
  );
}
