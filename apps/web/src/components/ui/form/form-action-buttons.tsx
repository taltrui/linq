import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import SubmitButton from "./submit-button";

interface FormActionButtonsProps {
  /** Submit button label */
  submitLabel: string;
  /** Cancel handler function */
  onCancel: () => void;
  /** Cancel button label */
  cancelLabel?: string;
  /** Whether buttons should be full width */
  fullWidth?: boolean;
  /** Additional props for submit button */
  submitButtonProps?: Omit<React.ComponentProps<typeof SubmitButton>, "label">;
  /** Additional props for cancel button */
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  /** Custom layout className */
  className?: string;
  /** Additional action buttons to display */
  extraActions?: ReactNode;
}

export function FormActionButtons({
  submitLabel,
  onCancel,
  cancelLabel = "Cancelar",
  fullWidth = false,
  submitButtonProps = {},
  cancelButtonProps = {},
  className = "flex gap-4",
  extraActions,
}: FormActionButtonsProps) {
  return (
    <div className={className}>
      <SubmitButton
        {...submitButtonProps}
        label={submitLabel}
        className={fullWidth ? "flex-1" : undefined}
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className={fullWidth ? "flex-1" : undefined}
        {...cancelButtonProps}
      >
        {cancelLabel}
      </Button>
      
      {extraActions}
    </div>
  );
}

export default FormActionButtons;