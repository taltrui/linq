
import { useFormContext } from "@/lib/form"
import { LoadingButton } from "../loadingbutton"

function SubmitButton({ label, ...props }: { label: string } & React.ComponentProps<"button">) {
    const form = useFormContext()
    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
                <LoadingButton type="submit" loading={isSubmitting} disabled={!canSubmit || isSubmitting} {...props}>
                    {label}
                </LoadingButton>
            )}
        />
    )
}

export default SubmitButton