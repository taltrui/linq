import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResourceCardProps {
  /** Main title of the resource */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Icon to display in the header */
  icon?: ReactNode;
  /** Action buttons (edit, delete, etc.) */
  actions?: ReactNode;
  /** Main content area */
  children?: ReactNode;
  /** Additional content below main content */
  footer?: ReactNode;
  /** Click handler for the entire card */
  onClick?: () => void;
  /** Whether the card should have hover effects */
  hoverable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ResourceCard({
  title,
  subtitle,
  icon,
  actions,
  children,
  footer,
  onClick,
  hoverable = true,
  className = "",
}: ResourceCardProps) {
  const cardClasses = [
    hoverable && "hover:bg-muted/50 transition-colors",
    onClick && "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className={cardClasses} onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardContent className="pt-0">{footer}</CardContent>}
    </Card>
  );
}

export default ResourceCard;