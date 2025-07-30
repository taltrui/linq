import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message */
  message?: string;
  /** Custom error icon */
  icon?: ReactNode;
  /** Retry action */
  onRetry?: () => void;
  /** Retry button label */
  retryLabel?: string;
  /** Additional actions */
  actions?: ReactNode;
  /** Additional className */
  className?: string;
  /** Minimum height */
  minHeight?: string;
  /** Error variant */
  variant?: "default" | "destructive" | "warning";
}

const variantClasses = {
  default: "text-gray-600",
  destructive: "text-red-600",
  warning: "text-yellow-600",
} as const;

const iconVariantClasses = {
  default: "text-gray-400",
  destructive: "text-red-400", 
  warning: "text-yellow-400",
} as const;

export function ErrorState({
  title = "Error",
  message = "Ha ocurrido un error inesperado.",
  icon,
  onRetry,
  retryLabel = "Intentar de nuevo",
  actions,
  className,
  minHeight = "200px",
  variant = "default",
}: ErrorStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center py-8",
        variantClasses[variant],
        className
      )}
      style={{ minHeight }}
    >
      {/* Icon */}
      <div className={cn("text-4xl", iconVariantClasses[variant])}>
        {icon || <AlertTriangle className="h-12 w-12" />}
      </div>
      
      {/* Content */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        {message && (
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryLabel}
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
}

export default ErrorState;