import { useFieldContext } from "@/lib/form";
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitive-select";
import { Label } from "../label";

function Select({
  label,
  description,
  options,
}: {
  label: string;
  description?: string;
  options: { label: string; value: string }[];
}) {
  const field = useFieldContext<string>();

  const errors = field.state.meta.errors
    .map((error) => error.message)
    .join(", ");

  const showErrors = field.state.meta.isTouched && errors.length > 0;
  const showDescription = !showErrors && description;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="w-full">
        {label}
      </Label>
      <SelectPrimitive onValueChange={field.handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive>
      {showErrors && <p className="text-red-500 text-sm">{errors}</p>}
      {showDescription && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}

export default Select;
