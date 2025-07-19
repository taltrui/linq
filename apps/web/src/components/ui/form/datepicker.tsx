
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useFieldContext } from "@/lib/form"
import { Label } from "../label"

export function DatePicker({ label, description }: { label: string, description?: string }) {
    const field = useFieldContext<Date>()

    const errors = field.state.meta.errors.map((error) => error.message).join(', ')

    const showErrors = field.state.meta.isTouched && errors.length > 0
    const showDescription = !showErrors && description

    return (
        <Popover>
            <div className="space-y-2 w-full">
                <Label htmlFor={field.name}>{label}</Label>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!field.state.value}
                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                    >
                        <CalendarIcon />
                        {field.state.value ? format(field.state.value, "PPP") : <span>{label}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.state.value} onSelect={(date) => field.handleChange(date ?? new Date())} />
                </PopoverContent>
                {showErrors && <p className="text-red-500 text-xs">{errors}</p>}
                {showDescription && <p className="text-muted-foreground text-xs">{description}</p>}
            </div>
        </Popover>
    )
}