import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /** Loading message */
  message?: string;
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Whether to show as a full page overlay */
  overlay?: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** Additional className */
  className?: string;
  /** Minimum height */
  minHeight?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
} as const;

export function LoadingState({
  message = "Cargando...",
  size = "md",
  overlay = false,
  icon,
  className,
  minHeight = "200px",
}: LoadingStateProps) {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3 text-muted-foreground",
      overlay && "fixed inset-0 bg-white/80 backdrop-blur-sm z-50",
      !overlay && "py-8",
      className
    )} style={{ minHeight: overlay ? undefined : minHeight }}>
      {icon || <Loader2 className={cn("animate-spin", sizeClasses[size])} />}
      {message && (
        <p className="text-sm font-medium">{message}</p>
      )}
    </div>
  );

  return content;
}

export default LoadingState;