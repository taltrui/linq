import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import TextInput from '@/components/ui/form/textinput'
import SubmitButton from '@/components/ui/form/submitbutton'
import TextareaInput from '@/components/ui/form/textareainput'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
    fieldComponents: {
        TextInput,
        TextareaInput
    },
    formComponents: {
        SubmitButton
    },
    fieldContext,
    formContext,
})

export default useAppForm