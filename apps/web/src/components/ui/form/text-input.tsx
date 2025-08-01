import { useFieldContext } from "@/lib/form";
import { Input } from "../input";
import { Label } from "../label";

function TextInput({
  label,
  type = "text",
  description,
  labelProps,
  ...props
}: {
  label: string;
  type?: "text" | "password" | "number" | "datetime-local";
  description?: string;
  labelProps?: React.ComponentProps<"label">;
} & React.ComponentProps<"input">) {
  const field = useFieldContext<string>();

  const errors = field.state.meta.errors
    .map((error) => error.message)
    .join(", ");

  const showErrors = field.state.meta.isTouched && errors.length > 0;
  const showDescription = !showErrors && description;

  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor={field.name} {...labelProps}>
        {label}
      </Label>
      <Input
        id={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
      {showDescription && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
      {showErrors && <p className="text-red-500 text-xs">{errors}</p>}
    </div>
  );
}

export default TextInput;
