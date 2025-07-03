import { Label } from "./Label";
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./PrimitiveSelect";

function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onValueChange: (value: any) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) {
  return (
    <SelectPrimitive value={value} onValueChange={onValueChange}>
      <div className="space-y-2">
        <Label htmlFor={label}>{label}</Label>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </div>
    </SelectPrimitive>
  );
}

export default Select;
