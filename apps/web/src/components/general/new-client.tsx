import { Plus } from "lucide-react";
import { ResponsiveDialog } from "../ui/responsive-dialog.js";
import { Button } from "../ui/button.js";
import { Suspense, useState } from "react";
import { NewClientForm } from "../forms/new-client-form.js";

const buttonClass = "rounded-full shadow-lg";
const floatingButtonClass =
  "rounded-full shadow-lg fixed bottom-8 right-8 z-50";

function NewClient({ floating = false }: { floating?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className={floating ? floatingButtonClass : buttonClass}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-8 w-8" /> Nuevo Cliente
      </Button>

      <ResponsiveDialog
        title="Crear nuevo trabajo"
        handleOpenChange={setOpen}
        open={open}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <NewClientForm
            handleSuccess={() => {
              setOpen(false);
            }}
          />
        </Suspense>
      </ResponsiveDialog>
    </>
  );
}

export default NewClient;
