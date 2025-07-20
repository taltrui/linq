import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import Badge from "@/components/ui/badge";
import { useListQuotations } from "@/services/queries/use-list-quotations";
import ResourceCard from "@/components/general/resource-card";
import EmptyState from "@/components/states/empty-state";

function Quotations() {
  const { data: quotations = [] } = useListQuotations();

  if (quotations.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="No hay cotizaciones"
        description="Comienza creando tu primera cotización para tus clientes."
        action={{
          label: "Crear Primera Cotización",
          onClick: () => {
            // The NewQuotation component handles the creation
            (document.querySelector('[data-new-quotation]') as HTMLElement)?.click();
          },
          icon: <FileText className="w-4 h-4 mr-2" />,
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quotations.map((quotation) => (
        <Link
          key={quotation.id}
          to="/quotations/$quotationId"
          params={{ quotationId: quotation.id }}
        >
          <ResourceCard
            title={quotation.title}
            subtitle={`Cliente: ${quotation.client.name}`}
            icon={<FileText className="w-5 h-5" />}
            actions={<Badge>{quotation.status}</Badge>}
          >
            <p className="text-lg font-semibold">${quotation.totalAmount}</p>
          </ResourceCard>
        </Link>
      ))}
    </div>
  );
}

export function QuotationsList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Quotations />
    </Suspense>
  );
}
