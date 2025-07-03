import type useAppForm from "@/lib/form";
import { Label } from "../Label";
import { Input } from "../Input";

function SubField({
  name,
  label,
  form,
  ...props
}: {
  name: string;
  label: string;
  form: ReturnType<typeof useAppForm>;
} & React.ComponentProps<"input">) {
  return (
    <form.Field
      name={name}
      children={(subField) => (
        <div className="w-full gap-2 flex flex-col">
          <Label htmlFor={subField.name} className="text-sm">
            {label}
          </Label>
          <Input
            id={subField.name}
            name={subField.name}
            onBlur={subField.handleBlur}
            onChange={(e) =>
              subField.handleChange(
                props.type === "number"
                  ? Number(e.target.value)
                  : e.target.value
              )
            }
            value={subField.state.value as string}
            {...props}
          />
          {subField.state.meta.isTouched &&
            subField.state.meta.errors.length > 0 && (
              <p className="text-red-500 text-xs">
                {subField.state.meta.errors
                  .map((error: any) => error?.message || "")
                  .join(", ")}
              </p>
            )}
        </div>
      )}
    />
  );
}

export default SubField;
