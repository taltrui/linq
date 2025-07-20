import { createFileRoute } from "@tanstack/react-router";
import { NewQuotation } from "@/components/general/new-quotation";
import ResourceListLayout from "@/components/general/resource-list-layout";
import { QuotationsList } from "./-components";

export const Route = createFileRoute("/_authenticated/quotations/")({
  component: () => <Quotations />,
});

export function Quotations() {
  return (
    <ResourceListLayout
      title="Presupuestos"
      description="Gestiona tus cotizaciones y presupuestos para clientes"
      createAction={<NewQuotation />}
      showSearch={false}
    >
      <QuotationsList />
    </ResourceListLayout>
  );
}
