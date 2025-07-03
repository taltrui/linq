import useAppForm from "@/lib/form";

import { useListClients } from "@/services/queries/useListClients";
import { useCreateQuotation } from "@/services/mutations/useCreateQuotation";
import { CreateQuotationPayload, type QuotationItem } from "@repo/api-client";

import { Button } from "@/components/ui/Button";
import QuotationItemField from "../ui/form/QuotationItem";

export function NewQuotationForm({
  handleSuccess,
}: {
  handleSuccess: () => void;
}) {
  const { data: clients } = useListClients({});

  const createQuotationMutation = useCreateQuotation();

  const form = useAppForm({
    defaultValues: {
      clientId: "",
      notes: null as string | null,
      items: [] as QuotationItem[],
      title: "",
      description: null as string | null,
    },
    validators: {
      onChange: CreateQuotationPayload,
    },
    onSubmit: async ({ value }) => {
      createQuotationMutation.mutate(value, {
        onSuccess: () => {
          handleSuccess();
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppField
        name="clientId"
        children={(field) => (
          <field.Select
            label="Cliente"
            options={clients.map((client) => ({
              label: client.name,
              value: client.id,
            }))}
          />
        )}
      />

      <form.AppField
        name="notes"
        children={(field) => (
          <field.TextareaInput label="Notas" placeholder="Notas adicionales" />
        )}
      />

      <form.AppField
        name="title"
        children={(field) => (
          <field.TextInput
            label="Título"
            placeholder="Título de la cotización"
          />
        )}
      />

      <form.AppField
        name="description"
        children={(field) => (
          <field.TextareaInput
            label="Descripción"
            placeholder="Descripción de la cotización"
          />
        )}
      />

      <form.AppField name="items" mode="array">
        {(field) => {
          return (
            <div>
              {field.state.value.map((_, index) => {
                return (
                  <QuotationItemField key={index} index={index} form={form} />
                );
              })}
              <Button
                onClick={() =>
                  field.pushValue({
                    id: crypto.randomUUID(),
                    description: "",
                    quantity: 1,
                    unitPrice: "0",
                  })
                }
                type="button"
              >
                Agregar ítem
              </Button>
            </div>
          );
        }}
      </form.AppField>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="w-full">
            {isSubmitting ? "Creando..." : "Crear cotización"}
          </Button>
        )}
      />
    </form>
  );
}
