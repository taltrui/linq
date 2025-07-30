import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoSectionProps {
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Content to display */
  children: ReactNode;
  /** Visual variant */
  variant?: "default" | "muted" | "bordered";
  /** Additional className */
  className?: string;
}

interface InfoGridProps {
  /** Info items */
  children: ReactNode;
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4;
  /** Additional className */
  className?: string;
}

interface InfoItemProps {
  /** Field label */
  label: string;
  /** Field value */
  value: string | number | null | undefined;
  /** Custom value renderer */
  renderValue?: (value: string | number | null | undefined) => ReactNode;
  /** Additional className */
  className?: string;
}

export function InfoSection({
  title,
  description,
  children,
  variant = "default",
  className,
}: InfoSectionProps) {
  if (variant === "default") {
    return (
      <div className={cn("space-y-3", className)}>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <Card className={cn(
      variant === "muted" && "bg-gray-50/50",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

export function InfoGrid({
  children,
  columns = 2,
  className,
}: InfoGridProps) {
  return (
    <div className={cn(
      "grid gap-4",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
}

export function InfoItem({
  label,
  value,
  renderValue,
  className,
}: InfoItemProps) {
  const displayValue = renderValue ? renderValue(value) : (value ?? "—");
  
  return (
    <div className={cn("space-y-1", className)}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium">{displayValue}</dd>
    </div>
  );
}

export default InfoSection;