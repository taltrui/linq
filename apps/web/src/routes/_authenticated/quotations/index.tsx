import { NewQuotation } from "@/components/general/NewQuotation";

import { createFileRoute } from "@tanstack/react-router";
import { QuotationsList } from "./-components";

export const Route = createFileRoute("/_authenticated/quotations/")({
  component: () => <Quotations />,
});
export function Quotations() {
  return (
    <div className="container flex flex-col gap-4 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <NewQuotation />
      </div>
      <QuotationsList />
    </div>
  );
}
