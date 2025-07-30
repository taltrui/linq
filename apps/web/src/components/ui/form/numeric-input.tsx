import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NumericInputProps extends Omit<ComponentProps<typeof Input>, "type"> {
  /** Field label */
  label: string;
  /** Whether field is required */
  required?: boolean;
  /** Currency symbol to display */
  currency?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Show currency symbol position */
  currencyPosition?: "prefix" | "suffix";
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Whether field is touched (for error display) */
  isTouched?: boolean;
}

export function NumericInput({
  label,
  required = false,
  currency,
  decimals = 2,
  currencyPosition = "prefix",
  error,
  helperText,
  isTouched = false,
  className,
  id,
  ...inputProps
}: NumericInputProps) {
  const inputId = id || `numeric-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const showError = isTouched && error;
  
  const input = (
    <Input
      {...inputProps}
      id={inputId}
      type="number"
      step={decimals > 0 ? `0.${"0".repeat(decimals - 1)}1` : "1"}
      className={cn(
        showError && "border-red-500 focus:ring-red-500",
        currency && currencyPosition === "prefix" && "pl-8",
        currency && currencyPosition === "suffix" && "pr-8",
        className
      )}
    />
  );

  return (
    <div className="space-y-1">
      <Label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {currency ? (
        <div className="relative">
          {currencyPosition === "prefix" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">{currency}</span>
            </div>
          )}
          
          {input}
          
          {currencyPosition === "suffix" && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">{currency}</span>
            </div>
          )}
        </div>
      ) : (
        input
      )}
      
      {showError && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
      
      {helperText && !showError && (
        <p className="text-gray-500 text-xs">{helperText}</p>
      )}
    </div>
  );
}

export default NumericInput;