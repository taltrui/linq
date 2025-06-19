import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
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

function RouteComponent() {
  return <Outlet />
}
