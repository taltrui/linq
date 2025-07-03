import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/Button"

function LoadingButton({ children, loading, ...props }: React.ComponentProps<"button"> & { loading: boolean }) {
    return (
        <Button size="sm" disabled={loading} {...props} className="flex items-center gap-2">
            {loading && <Loader2Icon className="animate-spin" />}
            {children}
        </Button>
    )
}

export { LoadingButton }