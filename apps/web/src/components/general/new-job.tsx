import { Plus } from "lucide-react"
import { ResponsiveDialog } from "../ui/responsive-dialog"
import { Button } from "../ui/button"
import { Suspense, useState } from "react"
import { NewJobForm } from "../forms/new-job-form"

const buttonClass = "rounded-full shadow-lg"
const floatingButtonClass = "rounded-full shadow-lg fixed bottom-8 right-8 z-50"

function NewJob({ floating = false }: { floating?: boolean }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button size="lg" className={floating ? floatingButtonClass : buttonClass} onClick={() => setOpen(true)}>
                <Plus className="h-8 w-8" /> Nuevo trabajo
            </Button>

            <ResponsiveDialog title="Crear nuevo trabajo" handleOpenChange={setOpen} open={open}>
                <Suspense fallback={<div>Loading...</div>}>
                    <NewJobForm handleSuccess={() => { console.log('success'); setOpen(false) }} />
                </Suspense>
            </ResponsiveDialog>
        </>
    )
}

export default NewJob