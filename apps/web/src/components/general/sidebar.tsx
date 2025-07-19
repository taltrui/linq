import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Users,
  FileText,
  Briefcase,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  Package,
  ChevronDown,
  Building,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/services/queries/use-company";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  submenu?: SidebarItem[];
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
  {
    title: "Inventario",
    href: "/inventory",
    icon: Package,
    submenu: [
      {
        title: "Items",
        href: "/inventory",
        icon: Package,
      },
      {
        title: "Proveedores",
        href: "/inventory/suppliers",
        icon: Building,
      },
      {
        title: "Dashboard",
        href: "/inventory/dashboard",
        icon: BarChart3,
      },
      {
        title: "Gestión de Stock",
        href: "/inventory/stock",
        icon: TrendingUp,
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const { data: company } = useCompany();

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  return (
    <>
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

      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "h-screen flex-col border-r bg-card transition-transform duration-300 ease-in-out",

          "hidden lg:flex lg:w-64",

          "fixed inset-y-0 left-0 w-64 z-50 flex lg:relative lg:translate-x-0",

          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="py-3 px-6 border-b">
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
              </div>
            </Link>

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

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/dashboard" &&
                location.pathname.startsWith(item.href));
            const isExpanded = expandedItems.includes(item.href);

            return (
              <div key={item.href}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.href)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground w-full",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                      {item.badge && (
                        <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", isExpanded && "rotate-180")} />
                    </button>
                    {isExpanded && (
                      <div className="mt-2 ml-4 space-y-1">
                        {item.submenu.map((subitem) => {
                          const subIsActive =
                            location.pathname === subitem.href ||
                            (subitem.href !== "/dashboard" &&
                              location.pathname.startsWith(subitem.href));

                          return (
                            <Link
                              key={subitem.href}
                              to={subitem.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                subIsActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-muted-foreground"
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <subitem.icon className="w-4 h-4" />
                              {subitem.title}
                              {subitem.badge && (
                                <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                  {subitem.badge}
                                </span>
                              )}
                              {subIsActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
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
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
