import SubField from "./sub-field";

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
    <div className="grid w-full items-center gap-2 rounded-md border p-4">
      {label && <p className="font-medium">{label}</p>}

      <SubField
        name={`${name}.street`}
        label="Street"
        placeholder="Main St"
        form={form}
        key={`${name}.street`}
      />
      <SubField
        name={`${name}.city`}
        label="City"
        placeholder="Anytown"
        form={form}
        key={`${name}.city`}
      />
      <SubField
        name={`${name}.state`}
        label="State"
        placeholder="Anystate"
        form={form}
        key={`${name}.state`}
      />
      <SubField
        name={`${name}.zipCode`}
        label="Zip Code"
        placeholder="12345"
        form={form}
        key={`${name}.zipCode`}
      />
      <SubField
        name={`${name}.country`}
        label="Country"
        placeholder="Argentina"
        form={form}
        key={`${name}.country`}
      />
    </div>
  );
}

export default AddressField;
