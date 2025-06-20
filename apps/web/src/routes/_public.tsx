import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
