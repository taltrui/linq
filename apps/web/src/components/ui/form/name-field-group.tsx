import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NameFieldGroupProps {
  /** First name field component */
  firstNameField: ReactNode;
  /** Last name field component */
  lastNameField: ReactNode;
  /** Layout direction */
  layout?: "horizontal" | "vertical";
  /** Gap between fields */
  gap?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
  /** Responsive breakpoint for horizontal layout */
  responsive?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-4", 
  lg: "gap-6",
} as const;

const responsiveClasses = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
} as const;

export function NameFieldGroup({
  firstNameField,
  lastNameField,
  layout = "horizontal",
  gap = "md",
  className,
  responsive = "md",
}: NameFieldGroupProps) {
  const containerClassName = cn(
    layout === "horizontal" 
      ? `flex flex-col ${responsiveClasses[responsive]}flex-row` 
      : "flex flex-col",
    gapClasses[gap],
    className
  );

  return (
    <div className={containerClassName}>
      {firstNameField}
      {lastNameField}
    </div>
  );
}

export default NameFieldGroup;