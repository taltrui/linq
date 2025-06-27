import { Plus } from "lucide-react";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { Button } from "../ui/button";
import { Suspense, useState } from "react";
import { NewQuotationForm } from "../forms/new-quotation-form";

const buttonClass = "rounded-full shadow-lg";
const floatingButtonClass =
  "rounded-full shadow-lg fixed bottom-8 right-8 z-50";

export function NewQuotation({ floating = false }: { floating?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className={floating ? floatingButtonClass : buttonClass}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-8 w-8" /> Nueva cotización
      </Button>

      <ResponsiveDialog
        title="Crear nueva cotización"
        handleOpenChange={setOpen}
        open={open}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <NewQuotationForm
            handleSuccess={() => {
              setOpen(false);
            }}
          />
        </Suspense>
      </ResponsiveDialog>
    </>
  );
}
