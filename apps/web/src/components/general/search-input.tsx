import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchInputProps {
  /** Current search value */
  value: string | undefined;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show in a card wrapper */
  showCard?: boolean;
  /** Card title when showCard is true */
  cardTitle?: string;
  /** Additional CSS classes for the input */
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  showCard = true,
  cardTitle = "Filtros",
  className = "max-w-sm",
}: SearchInputProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const input = (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={handleChange}
        className={`pl-10 ${className}`}
      />
    </div>
  );

  if (!showCard) {
    return input;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{input}</CardContent>
    </Card>
  );
}

export default SearchInput;