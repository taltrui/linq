import type { AuthContextType } from '@/lib/auth.js'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient } from '@tanstack/react-query'

export interface RootRouterContext {
    auth: AuthContextType
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    )
})  