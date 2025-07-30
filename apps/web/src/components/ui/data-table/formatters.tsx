import type { ReactNode } from "react";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Common cell formatters for data tables
 */

// Date formatter
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  
  try {
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

// Date time formatter
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  
  try {
    const d = new Date(date);
    return d.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

// Currency formatter  
export function formatCurrency(
  amount: number | null | undefined,
  currency = "$"
): string {
  if (amount === null || amount === undefined) return "—";
  
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  }).format(amount).replace("US$", currency);
}

// Number formatter
export function formatNumber(
  value: number | null | undefined,
  decimals = 0
): string {
  if (value === null || value === undefined) return "—";
  
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Percentage formatter
export function formatPercentage(
  value: number | null | undefined,
  decimals = 1
): string {
  if (value === null || value === undefined) return "—";
  
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

// Badge formatter for status values
export function formatStatus(
  status: string | null | undefined,
  variant: "default" | "secondary" | "destructive" | "outline" = "default"
): ReactNode {
  if (!status) return <Badge variant="outline">—</Badge>;
  
  // Convert status to display format
  const displayStatus = status
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
    
  return <Badge variant={variant}>{displayStatus}</Badge>;
}

// Boolean formatter
export function formatBoolean(
  value: boolean | null | undefined,
  labels = { true: "Sí", false: "No" }
): string {
  if (value === null || value === undefined) return "—";
  return value ? labels.true : labels.false;
}

// Text truncator
export function formatText(
  text: string | null | undefined,
  maxLength = 50
): string {
  if (!text) return "—";
  
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Array formatter (for tags, categories, etc.)
export function formatArray(
  items: string[] | null | undefined,
  _separator = ", ",
  maxItems = 3
): ReactNode {
  if (!items || items.length === 0) return "—";
  
  const displayItems = items.slice(0, maxItems);
  const remaining = items.length - maxItems;
  
  return (
    <div className="flex flex-wrap gap-1">
      {displayItems.map((item, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {item}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remaining} more
        </Badge>
      )}
    </div>
  );
}

// Quantity formatter with color coding
export function formatQuantity(
  value: number | null | undefined,
  options: {
    unit?: string;
    colorCode?: boolean;
    lowThreshold?: number;
    highThreshold?: number;
  } = {}
): ReactNode {
  const { unit = "", colorCode = false, lowThreshold = 0, highThreshold = 100 } = options;
  
  if (value === null || value === undefined) return "—";
  
  const formattedValue = `${formatNumber(value)} ${unit}`.trim();
  
  if (!colorCode) return formattedValue;
  
  let colorClass = "text-gray-900";
  
  if (value <= lowThreshold) {
    colorClass = "text-red-600 font-medium";
  } else if (value >= highThreshold) {
    colorClass = "text-green-600 font-medium";
  } else {
    colorClass = "text-yellow-600 font-medium";
  }
  
  return <span className={cn(colorClass)}>{formattedValue}</span>;
}

// Contact info formatter
export function formatContact(
  email?: string | null,
  phone?: string | null
): ReactNode {
  if (!email && !phone) return "—";
  
  return (
    <div className="space-y-1">
      {email && (
        <div className="text-sm">
          <a 
            href={`mailto:${email}`}
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {email}
          </a>
        </div>
      )}
      {phone && (
        <div className="text-sm text-gray-600">
          <a 
            href={`tel:${phone}`}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {phone}
          </a>
        </div>
      )}
    </div>
  );
}

// Address formatter
export function formatAddress(address: {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
} | null): string {
  if (!address) return "—";
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(", ") : "—";
}

export default {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatStatus,
  formatBoolean,
  formatText,
  formatArray,
  formatQuantity,
  formatContact,
  formatAddress,
};