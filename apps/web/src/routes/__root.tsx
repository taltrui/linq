import type { AuthContextType } from '@/lib/auth.js'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export interface RootRouterContext {
    auth: AuthContextType
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    )
})  