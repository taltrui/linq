import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function BackToButton({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="text-sm text-muted-foreground flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </Link>
  );
}

export default BackToButton;
