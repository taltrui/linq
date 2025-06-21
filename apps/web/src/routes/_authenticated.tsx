import { AuthenticatedHeader } from '@/components/general/authenticated-header'
import { ensureMultipleQueries } from '@/lib/queryUtils'
import { companyQueryOptions } from '@/services/queries/use-company.js'
import { profileQueryOptions } from '@/services/queries/use-profile.js'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  loader: async () => {
    const [profile, company] = await ensureMultipleQueries([
      profileQueryOptions,
      companyQueryOptions,
    ])

    return {
      profile,
      company,
    }
  },
})

function AuthenticatedLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-muted">
      <AuthenticatedHeader />
      <main className="flex-1 justify-center items-center p-2 sm:p-4 md:p-6 bg-background rounded-lg m-2">
        <Outlet />
      </main>
    </div>
  )
}
