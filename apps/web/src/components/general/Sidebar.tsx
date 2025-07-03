import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Users,
  FileText,
  Briefcase,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button.js";
import { useCompany } from "@/services/queries/useCompany";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Tablero",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cotizaciones",
    href: "/quotations",
    icon: FileText,
  },
  {
    title: "Clientes",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Trabajos",
    href: "/jobs",
    icon: Briefcase,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: company } = useCompany();

  return (
    <>
      {/* Mobile Menu Button */}
      {!isMobileMenuOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-2.5 left-5 z-[60] lg:hidden bg-background"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "h-full flex-col border-r bg-card transition-transform duration-300 ease-in-out",
          // Desktop: always visible with full width, relative positioning
          "hidden lg:flex lg:w-64",
          // Mobile: fixed positioning, always present but transformed off-screen when closed
          "fixed inset-y-0 left-0 w-64 z-50 flex lg:relative lg:translate-x-0",
          // Mobile transform: slide in/out
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {company?.name?.[0] || "L"}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-sm">
                  {company?.name || "Linq"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Gestión Empresarial
                </p>
              </div>
            </Link>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/dashboard" &&
                location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
                {item.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Configuración
          </Link>
        </div>
      </div>
    </>
  );
}
