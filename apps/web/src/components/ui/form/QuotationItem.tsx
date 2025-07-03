import type { QuotationItem } from "@repo/api-client";
import SubField from "./SubField";

function QuotationItemField({ index, form }: { index: number; form?: any }) {
  return (
    <div className="w-full items-center gap-2 rounded-md border p-4 mb-6">
      <SubField
        name={`items[${index}].description`}
        label={`Item - ${index + 1}`}
        placeholder="Descripción del ítem"
        form={form as any}
        key={`items[${index}].description`}
      />
      <div className="grid grid-cols-3 gap-2 mt-6">
        <SubField
          name={`items[${index}].quantity`}
          label="Cantidad"
          placeholder="1"
          form={form as any}
          type="number"
          key={`items[${index}].quantity`}
        />

        <SubField
          name={`items[${index}].unitPrice`}
          label="Precio Unitario"
          placeholder="0"
          form={form as any}
          key={`items[${index}].unitPrice`}
        />
        <form.Subscribe
          selector={(state: any) => state.values.items[index]}
          children={(item: QuotationItem) => {
            const quantity = item.quantity || 0;
            const unitPrice = parseFloat(item.unitPrice || "0");
            const subTotal = quantity * unitPrice;
            console.log(subTotal);
            return (
              <SubField
                name={`items[${index}].subTotal`}
                label="Subtotal"
                disabled
                value={subTotal}
                placeholder="0"
                form={form as any}
                key={`items[${index}].subTotal`}
              />
            );
          }}
        />
      </div>
    </div>
  );
}

export default QuotationItemField;
