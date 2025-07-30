import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  /** Icon to display */
  icon: ReactNode;
  /** Main title */
  title: string;
  /** Description text */
  description: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  /** Whether this is a search result empty state */
  isSearchResult?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  isSearchResult = false,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="p-8 text-center">
        <div className="w-12 h-12 mx-auto text-muted-foreground mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action && !isSearchResult && (
          <Button onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default EmptyState;
