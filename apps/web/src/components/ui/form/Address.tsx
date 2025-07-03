import { Label } from "../Label";
import SubField from "./SubField";

function AddressField({
  name,
  label = "Dirección",
  form,
}: {
  name: string;
  label?: string;
  form: any;
}) {
  return (
    <div>
      {label && <Label className="font-medium">{label}</Label>}
      <div className="grid w-full items-center gap-2 rounded-md border p-4 mt-2">
        <SubField
          name={`${name}.street`}
          label="Calle"
          placeholder="Calle 123"
          form={form}
          key={`${name}.street`}
        />
        <SubField
          name={`${name}.city`}
          label="Ciudad"
          placeholder="Ciudad"
          form={form}
          key={`${name}.city`}
        />
        <SubField
          name={`${name}.state`}
          label="Provincia"
          placeholder="Provincia"
          form={form}
          key={`${name}.state`}
        />
        <SubField
          name={`${name}.zipCode`}
          label="Código Postal"
          placeholder="12345"
          form={form}
          key={`${name}.zipCode`}
        />
        <SubField
          name={`${name}.country`}
          label="País"
          placeholder="Argentina"
          form={form}
          key={`${name}.country`}
        />
      </div>
    </div>
  );
}

export default AddressField;
