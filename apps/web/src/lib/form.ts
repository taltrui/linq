
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import TextInput from '@/components/ui/form/textinput'
import SubmitButton from '@/components/ui/form/submitbutton'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
    fieldComponents: {
        TextInput,
    },
    formComponents: {
        SubmitButton
    },
    fieldContext,
    formContext,
})

export default useAppForm