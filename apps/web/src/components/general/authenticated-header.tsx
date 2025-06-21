import { Link, useNavigate, useRouteContext } from '@tanstack/react-router'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProfile } from '@/services/queries/use-profile.js'
import { useCompany } from '@/services/queries/use-company'

export function AuthenticatedHeader() {
    const { data: profile } = useProfile()
    const { data: company } = useCompany()
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate({ to: '/' })
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex max-w-screen-2xl items-center py-3 px-3">
                <div className="mr-4 flex">
                    <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">Linq | {company?.name}</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-fit justify-start gap-2"
                            >
                                <UserIcon className="size-4" />
                                <span>{profile?.firstName} {profile?.lastName}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {profile?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/profile" className="w-full">
                                    <UserIcon className="mr-2 size-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 size-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}