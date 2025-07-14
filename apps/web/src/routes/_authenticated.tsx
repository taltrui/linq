import { AuthenticatedHeader } from "@/components/general/AuthenticatedHeader";
import { Sidebar } from "@/components/general/Sidebar";
import { ensureMultipleQueries } from "@/lib/queryUtils";
import { companyQueryOptions } from "@/services/queries/useCompany";
import { profileQueryOptions } from "@/services/queries/useProfile";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: async () => {
    await ensureMultipleQueries([profileQueryOptions, companyQueryOptions] as any);
  },
});

function AuthenticatedLayout() {
  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0 ml-0 h-screen overflow-auto">
        <AuthenticatedHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
