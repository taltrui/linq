import { Suspense } from "react";
import { Link } from "@tanstack/react-router";

import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useListQuotations } from "@/services/queries/useListQuotations";

function Quotations() {
  const { data: quotations } = useListQuotations();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quotations.map((quotation) => (
        <Link
          key={quotation.id}
          to="/quotations/$quotationId"
          params={{ quotationId: quotation.id }}
        >
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{quotation.title}</span>
                <Badge>{quotation.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Client: {quotation.client.name}
              </p>
              <p className="text-lg font-semibold">${quotation.totalAmount}</p>
            </CardContent>
          </Card>
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
