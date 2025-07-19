import { Plus } from "lucide-react";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { Button } from "../ui/button";
import { Suspense, useState } from "react";
import { NewQuotationForm } from "../forms/new-quotation-form";

const buttonClass = "rounded-full shadow-lg";
const floatingButtonClass =
  "rounded-full shadow-lg fixed bottom-8 right-8 z-50";

export function NewQuotation({ 
  floating = false,
  children 
}: { 
  floating?: boolean;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const trigger = children ? (
    <div onClick={() => setOpen(true)}>{children}</div>
  ) : (
    <Button
      size="lg"
      className={floating ? floatingButtonClass : buttonClass}
      onClick={() => setOpen(true)}
    >
      <Plus className="h-8 w-8" /> Nueva cotización
    </Button>
  );

  return (
    <>
      {trigger}

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
