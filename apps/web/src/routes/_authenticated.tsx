import { AuthenticatedHeader } from '@/components/general/authenticated-header'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context }) => {
    if (!context.auth.authenticated) {
      console.log('redirecting to /')
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
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
