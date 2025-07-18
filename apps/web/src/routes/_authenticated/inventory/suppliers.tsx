import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/inventory/suppliers")({
  component: SuppliersLayout,
});

function SuppliersLayout() {
  return <Outlet />;
}